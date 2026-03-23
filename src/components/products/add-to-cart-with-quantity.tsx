"use client";

import { useState } from "react";
import { useActionState } from "react";
import { addToCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";

interface AddToCartWithQuantityProps {
    productId: string;
    stock: number;
}

export function AddToCartWithQuantity({ productId, stock }: AddToCartWithQuantityProps) {
    const maxQuantity = Math.min(stock, 10);
    const [quantity, setQuantity] = useState(1);
    const [state, formAction, isPending] = useActionState(addToCartAction, null);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    // Reset form state when quantity changes to allow re-adding
    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
    };

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="quantity" value={quantity} />

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Quantity</label>
                <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/50">
                        <button
                            type="button"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                            className="px-3 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-12 text-center text-white font-medium tabular-nums">{quantity}</span>
                        <button
                            type="button"
                            onClick={increaseQuantity}
                            disabled={quantity >= maxQuantity}
                            className="px-3 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    {maxQuantity > 1 && (
                        <span className="text-sm text-slate-500">
                            Max: {maxQuantity}
                        </span>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                loading={isPending}
                size="lg"
                className="w-full sm:w-auto"
            >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                </svg>
                Add to Cart {quantity > 1 && `(${quantity})`}
            </Button>

            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
            {state?.success && <p className="text-sm text-emerald-400">Added to cart!</p>}
        </form>
    );
}
