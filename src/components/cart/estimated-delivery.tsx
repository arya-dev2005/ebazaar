"use client";

import { useState, useEffect } from "react";

interface EstimatedDeliveryProps {
    subtotal?: number;
}

export function EstimatedDelivery({ subtotal = 0 }: EstimatedDeliveryProps) {
    const [deliveryRange, setDeliveryRange] = useState<{ start: Date; end: Date } | null>(null);
    const freeShippingThreshold = 50;

    useEffect(() => {
        const today = new Date();
        const shippingDays = subtotal >= freeShippingThreshold ? 3 : 5;
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + 2); // Start delivering in 2 days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + shippingDays);

        setDeliveryRange({ start: startDate, end: endDate });
    }, [subtotal]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const isFreeShipping = subtotal >= freeShippingThreshold;
    const remainingForFreeShipping = freeShippingThreshold - subtotal;

    return (
        <div className="space-y-3">
            {/* Free shipping progress */}
            {remainingForFreeShipping > 0 ? (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-300">
                        Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping
                    </p>
                    <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-emerald-400">You qualify for FREE shipping!</span>
                </div>
            )}

            {/* Delivery estimate */}
            {deliveryRange && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                    <div className="p-2 rounded-lg bg-indigo-500/20">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Estimated Delivery</p>
                        <p className="text-sm text-slate-400">
                            {formatDate(deliveryRange.start)} - {formatDate(deliveryRange.end)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
