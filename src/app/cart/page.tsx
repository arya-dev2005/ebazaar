import { auth } from "@/lib/auth";
import { getOrCreateCart, calculateCartTotal } from "@/services/cart";
import { removeFromCartAction } from "@/actions/cart";
import { checkoutAction } from "@/actions/order";
import { formatPrice, parseImages } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
    const session = await auth();
    if (!session?.user) return null;

    const cart = await getOrCreateCart(session.user.id!);
    const total = calculateCartTotal(cart);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart</h1>

                {cart.items.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-16 text-center">
                        <p className="text-slate-400 mb-4">Your cart is empty</p>
                        <Link href="/products"><Button>Browse Products</Button></Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => {
                                const images = parseImages(item.product.images);
                                return (
                                    <div key={item.id} className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                                            {images[0] && (
                                                <img src={images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <p className="text-sm text-slate-400 mt-1">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-indigo-400 mt-1">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                        <form action={removeFromCartAction.bind(null, item.id)}>
                                            <Button variant="ghost" size="sm" type="submit">
                                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </Button>
                                        </form>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="h-fit rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                                <div className="border-t border-slate-800 pt-3 flex justify-between text-white font-semibold">
                                    <span>Total</span>
                                    <span className="text-lg">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <form action={checkoutAction} className="mt-6">
                                <Button type="submit" className="w-full" size="lg">
                                    Checkout
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
