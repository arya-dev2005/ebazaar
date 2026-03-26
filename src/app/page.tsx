import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoriesSection } from "@/components/home/categories-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-medium text-indigo-300">Now Live — Free Shipping on Orders $50+</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">Shop the</span>
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Premium products curated for those who demand the best. From cutting-edge electronics to handcrafted goods — discover your next favorite thing.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Free Shipping $50+</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products - Client Component with Loading/Error States */}
      <FeaturedProducts />

      {/* Why Choose Us / Trust Section */}
      <section className="border-y border-slate-800/50 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">
              <span className="text-white">Why Choose </span>
              <span className="gradient-text">Us</span>
            </h2>
            <p className="mt-2 text-slate-400">Experience the difference of shopping with us</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quality Guarantee */}
            <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(99,102,241,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-slate-400">Every product is carefully vetted for quality and durability</p>
            </div>

            {/* Fast Shipping */}
            <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(99,102,241,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Shipping</h3>
              <p className="text-sm text-slate-400">Free shipping on orders over $50 with fast delivery</p>
            </div>

            {/* Easy Returns */}
            <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(99,102,241,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Returns</h3>
              <p className="text-sm text-slate-400">30-day hassle-free return policy</p>
            </div>

            {/* 24/7 Support */}
            <div className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(99,102,241,0.1)]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-400">Round-the-clock customer support for any questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-white">Ready to </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Discover
            </span>
            <span className="text-white">?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Join thousands of satisfied customers who trust us for their shopping needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg">
                Start Shopping
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
