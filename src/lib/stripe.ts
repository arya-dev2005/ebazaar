import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Get Stripe instance lazily
 * This prevents startup errors when Stripe is not configured
 */
function getStripe(): Stripe {
    if (!_stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error("STRIPE_SECRET_KEY is not set. Please configure it in your environment.");
        }
        _stripe = new Stripe(secretKey, {
            apiVersion: "2025-01-27.acacia" as any,
            typescript: true,
        });
    }
    return _stripe;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Create a Stripe Checkout Session for the given cart items
 * 
 * @param items - Cart items with product details
 * @param userId - The user's ID
 * @param cartData - Cart items data stored in metadata for webhook order creation
 */
export async function createCheckoutSession({
    items,
    userId,
    cartData,
}: {
    items: { name: string; price: number; quantity: number; image?: string }[];
    userId: string;
    cartData: {
        items: { productId: string; quantity: number; price: number }[];
        total: number;
    };
}) {
    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const currency = process.env.STRIPE_CURRENCY || "usd";

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata: {
            userId,
            // Store cart data as JSON string for webhook to parse
            cartData: JSON.stringify(cartData),
        },
        line_items: items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                    ...(item.image ? { images: [item.image] } : {}),
                },
                unit_amount: Math.round(item.price * 100), // cents
            },
            quantity: item.quantity,
        })),
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cart`,
    });

    return session;
}

/**
 * Export stripe for webhook handling (constructEvent needs the instance)
 */
export const stripe = {
    get get() {
        return getStripe();
    }
};
