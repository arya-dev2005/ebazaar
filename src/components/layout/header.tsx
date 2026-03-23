"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();

    // Fetch cart count when session changes
    useEffect(() => {
        async function fetchCartCount() {
            if (session?.user?.email) {
                try {
                    const response = await fetch("/api/cart/count");
                    if (response.ok) {
                        const data = await response.json();
                        setCartCount(data.count || 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch cart count:", error);
                }
            } else {
                setCartCount(0);
            }
        }
        fetchCartCount();
    }, [session]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <span className="text-sm font-bold text-white">E</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Ebazaar
                        </span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="/products"
                            className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                        >
                            Products
                        </Link>
                        {session && (
                            <Link
                                href="/orders"
                                className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                            >
                                Orders
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                            >
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {session ? (
                            <>
                                <Link href="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-900">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </Link>
                                <span className="text-sm text-slate-400 px-2">
                                    {session.user?.name?.split(" ")[0]}
                                </span>
                                <form action={signOutAction}>
                                    <Button variant="ghost" size="sm" type="submit">
                                        Sign Out
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Menu Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-72 transform bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                        <span className="text-lg font-semibold text-white">Menu</span>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="p-4 border-b border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </form>

                    {/* Mobile Navigation Links */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        <Link
                            href="/products"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Products
                        </Link>
                        {session && (
                            <>
                                <Link
                                    href="/orders"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                    Orders
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={closeMobileMenu}
                                    className="flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                                        </svg>
                                        Cart
                                    </div>
                                    {cartCount > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-900">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-all duration-200"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Admin Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Auth Actions */}
                    <div className="p-4 border-t border-slate-800 space-y-2">
                        {session ? (
                            <div className="space-y-2">
                                <div className="px-4 py-2 text-sm text-slate-400">
                                    Signed in as <span className="text-white">{session.user?.email}</span>
                                </div>
                                <form action={signOutAction}>
                                    <Button variant="secondary" size="sm" type="submit" className="w-full">
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/sign-in" onClick={closeMobileMenu}>
                                    <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                                </Link>
                                <Link href="/sign-up" onClick={closeMobileMenu}>
                                    <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
