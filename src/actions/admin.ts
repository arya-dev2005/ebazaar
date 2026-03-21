"use server";

import { requireAdmin } from "@/lib/auth";
import {
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/services/product";
import { updateOrderStatus } from "@/services/order";
import { productSchema, updateOrderStatusSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createProductAction(_prevState: any, formData: FormData) {
    await requireAdmin();

    const raw = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: formData.get("price"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId") as string,
        featured: formData.get("featured") === "on",
        images: formData.get("images") as string || "[]",
    };

    const result = productSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await createProduct({
            ...result.data,
            slug: slugify(result.data.name),
        });
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function updateProductAction(_prevState: any, formData: FormData) {
    await requireAdmin();

    const id = formData.get("id") as string;
    const raw = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: formData.get("price"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId") as string,
        featured: formData.get("featured") === "on",
        images: formData.get("images") as string || "[]",
    };

    const result = productSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await updateProduct(id, {
            ...result.data,
            slug: slugify(result.data.name),
        });
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function deleteProductAction(id: string) {
    await requireAdmin();

    try {
        await deleteProduct(id);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
}

export async function updateOrderStatusAction(_prevState: any, formData: FormData) {
    await requireAdmin();

    const raw = {
        orderId: formData.get("orderId") as string,
        status: formData.get("status") as string,
    };

    const result = updateOrderStatusSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await updateOrderStatus(result.data.orderId, result.data.status);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/orders");
    return { success: true };
}
