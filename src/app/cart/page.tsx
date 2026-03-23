import { auth } from "@/lib/auth";
import { getOrCreateCart, calculateCartTotal } from "@/services/cart";
import { CartClient } from "@/components/cart/cart-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shopping Cart" };

export default async function CartPage() {
    const session = await auth();

    // If user is not authenticated, show empty cart
    if (!session?.user) {
        return (
            <div className="flex min-h-screen flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your cart</h2>
                    </div>
                </div>
            </div>
        );
    }

    const cart = await getOrCreateCart(session.user.id!);
    const total = calculateCartTotal(cart);

    return <CartClient cart={cart} initialTotal={total} />;
}
