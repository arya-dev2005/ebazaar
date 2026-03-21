"use server";

import { requireAuth } from "@/lib/auth";
import { getOrCreateCart } from "@/services/cart";
import { createCheckoutSession } from "@/lib/stripe";
import { parseImages } from "@/lib/utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Server-side checkout action that:
 * 1. Fetches fresh prices from database (prevents price manipulation)
 * 2. Creates Stripe session with cart data in metadata
 * 3. Does NOT create order until webhook confirms payment
 */
export async function checkoutAction() {
    const user = await requireAuth();
    if (!user.id) {
        return { error: "User ID not found" };
    }
    const cart = await getOrCreateCart(user.id);

    if (cart.items.length === 0) {
        return { error: "Cart is empty" };
    }

    // FIX ISSUE 3: Server-side price validation
    // Fetch fresh prices from database instead of trusting client cart data
    const productIds = cart.items.map((item) => item.product.id);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    // Create a map for quick price lookup
    const productPriceMap = new Map(products.map((p) => [p.id, p.price]));

    // Validate all products exist and calculate total from DB prices
    const validatedItems = cart.items.map((item) => {
        const dbPrice = productPriceMap.get(item.product.id);
        if (!dbPrice) {
            throw new Error(`Product not found: ${item.product.id}`);
        }
        return {
            productId: item.product.id,
            quantity: item.quantity,
            price: dbPrice, // Use DB price, not client-provided price
            name: item.product.name,
            image: parseImages(item.product.images)[0],
        };
    });

    const total = validatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // FIX ISSUE 1: Don't create order yet - create it only after payment via webhook
    // Store cart data in Stripe metadata to create order later
    const session = await createCheckoutSession({
        items: validatedItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        })),
        userId: user.id,
        // Store cart data in metadata for webhook to create order
        cartData: {
            items: validatedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            total,
        },
    });

    // Handle case where session URL is null (checkout cancelled or failed)
    if (!session.url) {
        return { error: "Failed to create checkout session. Please try again." };
    }

    // Redirect to Stripe checkout
    // If user cancels, they will be redirected back to cart via cancel_url
    redirect(session.url);
}
