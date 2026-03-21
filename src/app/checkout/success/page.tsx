import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type SearchParams = Promise<{ session_id?: string }>;

export const metadata: Metadata = { title: "Order Confirmed" };

/**
 * Checkout success page with payment verification
 * 
 * FIX ISSUE 2: Verifies payment before showing success message
 * - Checks if session_id is provided
 * - Verifies payment status with Stripe API
 * - Verifies order belongs to current user
 * - Redirects to cart if verification fails
 */
export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const resolvedSearchParams = await searchParams;
    const sessionId = resolvedSearchParams.session_id;

    // If no session_id, redirect to cart (user didn't complete checkout)
    if (!sessionId) {
        redirect("/cart");
    }

    // Get current user
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/sign-in?callbackUrl=/checkout/success");
    }

    // Verify payment with Stripe
    let stripeSession;
    try {
        stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
        console.error("Failed to retrieve Stripe session:", err);
        redirect("/cart");
    }

    // Check payment status
    if (stripeSession.payment_status !== "paid") {
        console.error("Payment not completed:", stripeSession.payment_status);
        redirect("/cart");
    }

    // Verify order exists and belongs to current user
    const order = await prisma.order.findUnique({
        where: { stripeSessionId: sessionId },
    });

    if (!order) {
        console.error("Order not found for session:", sessionId);
        redirect("/cart");
    }

    // Verify the order belongs to the current user
    if (order.userId !== session.user.id) {
        console.error("Order does not belong to user:", order.userId, session.user.id);
        redirect("/cart");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
                    <p className="mt-2 text-slate-400 max-w-md">
                        Thank you for your order. You&apos;ll receive a confirmation email shortly.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link href="/orders"><Button>View Orders</Button></Link>
                        <Link href="/products"><Button variant="outline">Continue Shopping</Button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
