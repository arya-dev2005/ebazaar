"use client";

import { useState, useEffect } from "react";
import { formatPrice, parseImages } from "@/lib/utils";
import { checkoutAction } from "@/actions/order";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuantityAdjuster } from "./quantity-adjuster";
import { PromoCodeInput } from "./promo-code-input";
import { EstimatedDelivery } from "./estimated-delivery";
import { RecommendedProducts } from "./recommended-products";
import type { CartWithItems } from "@/types";

interface CartClientProps {
    cart: CartWithItems;
    initialTotal: number;
}

export function CartClient({ cart, initialTotal }: CartClientProps) {
    const [total, setTotal] = useState(initialTotal);
    const [discount, setDiscount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleApplyDiscount = (code: string) => {
        setDiscountCode(code);
        // Calculate discount (simulated: 10% off)
        const discountAmount = total * 0.1;
        setDiscount(discountAmount);
    };

    const handleRemoveDiscount = () => {
        setDiscountCode("");
        setDiscount(0);
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // checkoutAction redirects to Stripe, so we don't need to wait for it
            await checkoutAction();
        } catch (error) {
            // If it's a redirect error, that's expected - the function redirects to Stripe
            // Otherwise, log the error
            if (error && typeof error === 'object' && 'message' in error) {
                const err = error as { message?: string };
                if (!err.message?.includes('NEXT_REDIRECT')) {
                    console.error("Checkout failed:", error);
                }
            }
        } finally {
            // Don't set isProcessing to false if redirect happened
            // The page will redirect anyway
        }
    };

    const shipping = total >= 50 ? 0 : 5.99;
    const finalTotal = total - discount + shipping;

    if (!mounted) {
        // Return a skeleton or loading state
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-slate-800 rounded w-48"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
                                ))}
                            </div>
                            <div className="h-96 bg-slate-800 rounded-xl"></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Empty Cart State */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 text-center">
                        <div className="mx-auto w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                                Start Shopping
                            </Button>
                        </Link>
                    </div>

                    {/* Recommended Products */}
                    <RecommendedProducts />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Shopping Cart</h1>
                    <span className="text-sm text-slate-400">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => {
                            const images = parseImages(item.product.images);
                            return (
                                <div key={item.id} className="flex gap-4 md:gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4 md:p-6">
                                    {/* Larger Product Image - 120x120px */}
                                    <div className="h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                                        {images[0] ? (
                                            <img
                                                src={images[0]}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-600">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                            <div>
                                                <Link
                                                    href={`/products/${item.product.slug}`}
                                                    className="text-base md:text-lg font-medium text-white hover:text-amber-400 transition-colors line-clamp-2"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold text-amber-400">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            {/* Quantity Adjuster */}
                                            <QuantityAdjuster
                                                cartItemId={item.id}
                                                quantity={item.quantity}
                                                maxStock={item.product.stock}
                                            />

                                            <p className="text-sm text-slate-400">
                                                {formatPrice(item.product.price)} each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue Shopping Link */}
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                            {/* Estimated Delivery */}
                            <EstimatedDelivery subtotal={total} />

                            {/* Promo Code */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Promo Code
                                </label>
                                <PromoCodeInput onApply={handleApplyDiscount} />
                            </div>

                            {/* Price Breakdown */}
                            <div className="mt-6 space-y-3 border-t border-slate-800 pt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white">{formatPrice(total)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400">Discount ({discountCode})</span>
                                        <span className="text-emerald-400">-{formatPrice(discount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Shipping</span>
                                    <span className={shipping === 0 ? "text-emerald-400" : "text-white"}>
                                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-lg font-semibold border-t border-slate-800 pt-3">
                                    <span className="text-white">Total</span>
                                    <span className="text-amber-400">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Prominent Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                size="lg"
                                className="w-full mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-slate-900 font-bold text-lg py-4 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        Proceed to Checkout
                                    </>
                                )}
                            </Button>

                            {/* Trust badges */}
                            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure Checkout
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Money Back Guarantee
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
