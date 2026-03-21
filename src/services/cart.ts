import { prisma } from "@/lib/prisma";
import type { CartWithItems } from "@/types";

export async function getOrCreateCart(userId: string): Promise<CartWithItems> {
    let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        select: { id: true, name: true, slug: true, price: true, images: true, stock: true },
                    },
                },
            },
        },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, slug: true, price: true, images: true, stock: true },
                        },
                    },
                },
            },
        });
    }

    return cart as unknown as CartWithItems;
}

export async function addToCart(userId: string, productId: string, quantity: number) {
    const cart = await getOrCreateCart(userId);

    // Check product stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) {
        throw new Error("Product not available in requested quantity");
    }

    // Upsert cart item
    const existing = cart.items.find((item) => item.product.id === productId);
    if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
            throw new Error("Not enough stock available");
        }
        return prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQty },
        });
    }

    return prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
    });
}

export async function updateCartItem(cartItemId: string, quantity: number, userId: string) {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true, product: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
        throw new Error("Cart item not found");
    }

    if (quantity > cartItem.product.stock) {
        throw new Error("Not enough stock available");
    }

    return prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });
}

export async function removeFromCart(cartItemId: string, userId: string) {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
        throw new Error("Cart item not found");
    }

    return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;

    return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export function calculateCartTotal(cart: CartWithItems): number {
    return cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );
}
