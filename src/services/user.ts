import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
}) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role || "USER",
        },
    });
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });
}
