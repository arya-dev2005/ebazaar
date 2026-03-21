import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                <span className="text-sm font-bold text-white">E</span>
                            </div>
                            <span className="text-lg font-bold text-white">Ebazaar</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Premium products at unbeatable prices. Your one-stop shop for everything.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Shop</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/products?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
                            <li><Link href="/products?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Account</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link></li>
                            <li><Link href="/sign-up" className="hover:text-white transition-colors">Create Account</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition-colors">Order History</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Support</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><span className="cursor-default">help@ebazaar.com</span></li>
                            <li><span className="cursor-default">1-800-555-0199</span></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Ebazaar. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
