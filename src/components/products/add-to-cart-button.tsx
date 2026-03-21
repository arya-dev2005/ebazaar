"use client";

import { useActionState } from "react";
import { addToCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId }: { productId: string }) {
    const [state, formAction, isPending] = useActionState(addToCartAction, null);

    return (
        <form action={formAction}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="quantity" value="1" />
            <Button type="submit" loading={isPending} size="lg" className="w-full sm:w-auto">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                </svg>
                Add to Cart
            </Button>
            {state?.error && <p className="mt-2 text-sm text-red-400">{state.error}</p>}
            {state?.success && <p className="mt-2 text-sm text-emerald-400">Added to cart!</p>}
        </form>
    );
}
