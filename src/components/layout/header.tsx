"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function Header() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <span className="text-sm font-bold text-white">E</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Ebazaar
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/products" className="text-sm text-slate-400 hover:text-white transition-colors">
                        Products
                    </Link>
                    {session && (
                        <Link href="/orders" className="text-sm text-slate-400 hover:text-white transition-colors">
                            Orders
                        </Link>
                    )}
                    {isAdmin && (
                        <Link href="/admin" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {session ? (
                        <>
                            <Link href="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                                </svg>
                            </Link>
                            <span className="text-sm text-slate-400 hidden sm:inline">
                                {session.user?.name}
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
            </div>
        </header>
    );
}
