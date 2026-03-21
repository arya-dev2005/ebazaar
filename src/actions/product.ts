"use server";

import { requireAuth } from "@/lib/auth";
import { createReview } from "@/services/review";
import { reviewSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createReviewAction(_prevState: any, formData: FormData) {
    const user = await requireAuth();

    const raw = {
        productId: formData.get("productId") as string,
        rating: Number(formData.get("rating")),
        comment: (formData.get("comment") as string) || undefined,
    };

    const result = reviewSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await createReview({ ...result.data, userId: user.id! });
    } catch (e: any) {
        if (e.message?.includes("Unique constraint")) {
            return { error: "You have already reviewed this product" };
        }
        return { error: e.message };
    }

    revalidatePath(`/products`);
    return { success: true };
}
