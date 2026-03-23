"use client";

import { useState, useTransition } from "react";
import { updateCartItemAction, removeFromCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";

interface QuantityAdjusterProps {
    cartItemId: string;
    quantity: number;
    maxStock: number;
}

export function QuantityAdjuster({ cartItemId, quantity, maxStock }: QuantityAdjusterProps) {
    const [isPending, startTransition] = useTransition();
    const [currentQty, setCurrentQty] = useState(quantity);

    const handleQuantityChange = (newQty: number) => {
        if (newQty < 1 || newQty > maxStock) return;

        setCurrentQty(newQty);

        startTransition(async () => {
            const formData = new FormData();
            formData.append("cartItemId", cartItemId);
            formData.append("quantity", newQty.toString());
            await updateCartItemAction(null, formData);
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            await removeFromCartAction(cartItemId);
        });
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/50">
                <button
                    onClick={() => handleQuantityChange(currentQty - 1)}
                    disabled={isPending || currentQty <= 1}
                    className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="px-3 py-1.5 text-sm font-medium text-white min-w-[40px] text-center">
                    {currentQty}
                </span>
                <button
                    onClick={() => handleQuantityChange(currentQty + 1)}
                    disabled={isPending || currentQty >= maxStock}
                    className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
            <button
                onClick={handleRemove}
                disabled={isPending}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                aria-label="Remove item"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    );
}
