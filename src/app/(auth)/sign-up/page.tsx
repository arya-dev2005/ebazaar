"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
    const [state, formAction, isPending] = useActionState(signUpAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                            <span className="text-lg font-bold text-white">E</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create account</h1>
                        <p className="mt-1 text-sm text-slate-400">Join Ebazaar today</p>
                    </div>

                    {/* Error */}
                    {state?.error && (
                        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                            {state.error}
                        </div>
                    )}

                    {/* Form */}
                    <form action={formAction} className="space-y-4">
                        <Input id="name" name="name" type="text" label="Full Name" placeholder="Jane Doe" required />
                        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
                        <Input id="password" name="password" type="password" label="Password" placeholder="Min. 8 characters" required />

                        <Button type="submit" loading={isPending} className="w-full" size="lg">
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
