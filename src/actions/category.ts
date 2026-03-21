"use server";

import { requireAdmin } from "@/lib/auth";
import { createCategory, updateCategory, deleteCategory } from "@/services/product";
import { categorySchema, updateCategorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(_prevState: any, formData: FormData) {
    await requireAdmin();

    const raw = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string || undefined,
    };

    const result = categorySchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await createCategory({
            ...result.data,
            slug: result.data.slug || slugify(result.data.name),
        });
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
}

export async function updateCategoryAction(_prevState: any, formData: FormData) {
    await requireAdmin();

    const id = formData.get("id") as string;
    const raw = {
        name: formData.get("name") as string || undefined,
        slug: formData.get("slug") as string || undefined,
    };

    const result = updateCategorySchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    // Remove undefined values
    const data = Object.fromEntries(
        Object.entries(result.data).filter(([, v]) => v !== undefined)
    );

    // If name is provided but slug is not, generate slug from name
    if (data.name && !data.slug) {
        data.slug = slugify(data.name);
    }

    try {
        await updateCategory(id, data);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
}

export async function deleteCategoryAction(id: string) {
    await requireAdmin();

    try {
        await deleteCategory(id);
    } catch (e: any) {
        return { error: e.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
}
