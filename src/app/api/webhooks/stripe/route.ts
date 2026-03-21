import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event;
    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;

            // Parse cart data from Stripe metadata
            const metadata = session.metadata;
            if (!metadata?.userId || !metadata?.cartData) {
                console.error("Missing metadata in Stripe session");
                return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
            }

            let cartData: {
                items: { productId: string; quantity: number; price: number }[];
                total: number;
            };
            try {
                cartData = JSON.parse(metadata.cartData);
            } catch (err) {
                console.error("Failed to parse cartData:", err);
                return NextResponse.json({ error: "Invalid cartData" }, { status: 400 });
            }

            try {
                // Validate order total by recalculating from current DB prices
                // This prevents price manipulation by clients
                const productIds = cartData.items.map((item) => item.productId);
                const products = await prisma.product.findMany({
                    where: { id: { in: productIds } },
                    select: { id: true, price: true, stock: true },
                });

                // Create a map for quick lookup
                const productMap = new Map(products.map((p) => [p.id, p]));

                // Calculate expected total and validate stock
                let calculatedTotal = 0;
                for (const item of cartData.items) {
                    const product = productMap.get(item.productId);
                    if (!product) {
                        console.error(`Product not found: ${item.productId}`);
                        return NextResponse.json({ error: "Product not found" }, { status: 400 });
                    }

                    // Check stock availability
                    if (product.stock < item.quantity) {
                        console.error(`Insufficient stock for product: ${item.productId}`);
                        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
                    }

                    calculatedTotal += product.price * item.quantity;
                }

                // Validate total matches (allow for small floating point differences)
                const totalDiff = Math.abs(calculatedTotal - cartData.total);
                if (totalDiff > 0.01) {
                    console.error(`Order total mismatch. Expected: ${calculatedTotal}, Got: ${cartData.total}`);
                    return NextResponse.json({ error: "Order total mismatch" }, { status: 400 });
                }

                // Use transaction to ensure atomicity of order creation, stock decrement, and cart clearing
                await prisma.$transaction(async (tx) => {
                    // Create the order with PAID status
                    await tx.order.create({
                        data: {
                            userId: metadata.userId,
                            total: calculatedTotal,
                            stripeSessionId: session.id,
                            status: "PAID",
                            items: {
                                create: cartData.items.map((item) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: productMap.get(item.productId)!.price,
                                })),
                            },
                        },
                    });

                    // Decrease stock for each item
                    for (const item of cartData.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity } },
                        });
                    }

                    // Clear user's cart
                    const cart = await tx.cart.findUnique({
                        where: { userId: metadata.userId },
                    });
                    if (cart) {
                        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
                    }
                });
            } catch (err) {
                console.error("Failed to create order:", err);
                return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
            }
            break;
        }
        case "checkout.session.expired": {
            const session = event.data.object;

            // Handle expired checkout session
            const metadata = session.metadata;
            if (metadata?.userId) {
                try {
                    // Update any pending orders to CANCELLED status
                    await prisma.order.updateMany({
                        where: {
                            stripeSessionId: session.id,
                            status: "PENDING",
                        },
                        data: {
                            status: "CANCELLED",
                        },
                    });

                    console.log(`Checkout session expired for user: ${metadata.userId}, session: ${session.id}`);
                } catch (err) {
                    console.error("Failed to update expired checkout session:", err);
                }
            }
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
