"use server";

import { signIn, signOut } from "@/lib/auth";
import { createUser } from "@/services/user";
import { signUpSchema, signInSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

export async function signUpAction(_prevState: any, formData: FormData) {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const result = signUpSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await createUser(result.data);
        await signIn("credentials", {
            email: result.data.email,
            password: result.data.password,
            redirect: false,
        });
    } catch (e: any) {
        return { error: e.message || "Failed to create account" };
    }

    redirect("/");
}

export async function signInAction(_prevState: any, formData: FormData) {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const result = signInSchema.safeParse(raw);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await signIn("credentials", {
            email: result.data.email,
            password: result.data.password,
            redirect: false,
        });
    } catch (e: any) {
        return { error: "Invalid email or password" };
    }

    const callbackUrl = formData.get("callbackUrl") as string;
    redirect(callbackUrl || "/");
}

export async function signOutAction() {
    await signOut({ redirect: false });
    redirect("/sign-in");
}
