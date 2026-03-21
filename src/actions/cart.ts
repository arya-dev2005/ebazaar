"use server";

import { requireAuth } from "@/lib/auth";
import { addToCart, updateCartItem, removeFromCart } from "@/services/cart";
import { addToCartSchema, updateCartItemSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function addToCartAction(_prevState: any, formData: FormData) {
    const user = await requireAuth();
    if (!user.id) {
        return { error: "User ID not found" };
    }

    const raw = {
        productId: formData.get("productId") as string,
        quantity: Number(formData.get("quantity") || 1),
    };

    const result = addToCartSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await addToCart(user.id, result.data.productId, result.data.quantity);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function updateCartItemAction(_prevState: any, formData: FormData) {
    const user = await requireAuth();
    if (!user.id) {
        return { error: "User ID not found" };
    }

    const raw = {
        cartItemId: formData.get("cartItemId") as string,
        quantity: Number(formData.get("quantity")),
    };

    const result = updateCartItemSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await updateCartItem(result.data.cartItemId, result.data.quantity, user.id);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/cart");
    return { success: true };
}

export async function removeFromCartAction(cartItemId: string) {
    const user = await requireAuth();
    if (!user.id) {
        return { error: "User ID not found" };
    }

    try {
        await removeFromCart(cartItemId, user.id);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/cart");
    return { success: true };
}
