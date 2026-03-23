"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PromoCodeInputProps {
    onApply?: (code: string) => void;
}

export function PromoCodeInput({ onApply }: PromoCodeInputProps) {
    const [code, setCode] = useState("");
    const [isApplied, setIsApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [appliedCode, setAppliedCode] = useState("");
    const [error, setError] = useState("");

    const handleApply = async () => {
        if (!code.trim()) return;

        setIsApplying(true);
        setError("");

        // Simulate API call for promo code validation
        // In a real app, this would call an API to validate the promo code
        await new Promise(resolve => setTimeout(resolve, 500));

        // For demo purposes, accept any code that starts with "SAVE" or "DISCOUNT"
        const upperCode = code.toUpperCase();
        if (upperCode.startsWith("SAVE") || upperCode.startsWith("DISCOUNT") || upperCode === "EBazaar10") {
            setAppliedCode(code);
            setIsApplied(true);
            onApply?.(code);
        } else {
            setError("Invalid promo code");
        }

        setIsApplying(false);
    };

    const handleRemove = () => {
        setIsApplied(false);
        setAppliedCode("");
        setCode("");
        onApply?.("");
    };

    if (isApplied) {
        return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-emerald-400">{appliedCode}</span>
                </div>
                <button
                    onClick={handleRemove}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Remove
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                />
                <Button
                    onClick={handleApply}
                    disabled={!code.trim() || isApplying}
                    variant="outline"
                    size="md"
                >
                    {isApplying ? "Applying..." : "Apply"}
                </Button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <p className="text-xs text-slate-500">Try: SAVE20, DISCOUNT10, or EBazaar10</p>
        </div>
    );
}
