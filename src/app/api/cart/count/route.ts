import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ count: 0 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ count: 0 });
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: {
                items: true,
            },
        });

        if (!cart) {
            return NextResponse.json({ count: 0 });
        }

        const count = cart.items.reduce((total, item) => total + item.quantity, 0);

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to get cart count:", error);
        return NextResponse.json({ count: 0 });
    }
}
