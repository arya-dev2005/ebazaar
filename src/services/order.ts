import { prisma } from "@/lib/prisma";
import type { OrderStatus, OrderWithItems } from "@/types";

export async function createOrder(data: {
    userId: string;
    total: number;
    stripeSessionId: string;
    items: { productId: string; quantity: number; price: number }[];
}) {
    return prisma.order.create({
        data: {
            userId: data.userId,
            total: data.total,
            stripeSessionId: data.stripeSessionId,
            status: "PENDING",
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: { items: { include: { product: true } } },
    });
}

export async function getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    product: { select: { id: true, name: true, slug: true, images: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return orders as OrderWithItems[];
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: {
                    product: { select: { id: true, name: true, slug: true, images: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return orders as OrderWithItems[];
}

export async function getOrderByStripeSession(stripeSessionId: string) {
    return prisma.order.findUnique({
        where: { stripeSessionId },
        include: { items: { include: { product: true } } },
    });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}

export async function fulfillOrder(stripeSessionId: string) {
    const order = await getOrderByStripeSession(stripeSessionId);
    if (!order) throw new Error("Order not found");
    if (order.status === "PAID") return order; // idempotent

    // Use transaction to ensure atomicity
    return prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
            where: { id: order.id },
            data: { status: "PAID" },
        });

        // Decrease stock for each item
        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // Clear user's cart
        const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
        if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return order;
    });
}
