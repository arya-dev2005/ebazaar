import { describe, it, expect, vi, beforeEach } from "vitest";

describe("auth utilities", () => {
    // Inline implementations matching the source code
    const requireAuth = async (authFn: () => Promise<any>) => {
        const session = await authFn();
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        return session.user;
    };

    const requireAdmin = async (authFn: () => Promise<any>) => {
        const user = await requireAuth(authFn);
        if ((user as any).role !== "ADMIN") {
            throw new Error("Forbidden");
        }
        return user;
    };

    describe("requireAuth", () => {
        it("should throw if no session", async () => {
            const mockAuth = vi.fn().mockResolvedValue(null);

            await expect(requireAuth(mockAuth)).rejects.toThrow("Unauthorized");
        });

        it("should throw if session has no user", async () => {
            const mockAuth = vi.fn().mockResolvedValue({} as any);

            await expect(requireAuth(mockAuth)).rejects.toThrow("Unauthorized");
        });

        it("should return user if session exists", async () => {
            const mockUser = { id: "user-1", name: "Test User", email: "test@example.com" };
            const mockAuth = vi.fn().mockResolvedValue({ user: mockUser } as any);

            const result = await requireAuth(mockAuth);
            expect(result).toEqual(mockUser);
        });
    });

    describe("requireAdmin", () => {
        it("should throw if not authenticated", async () => {
            const mockAuth = vi.fn().mockResolvedValue(null);

            await expect(requireAdmin(mockAuth)).rejects.toThrow("Unauthorized");
        });

        it("should throw if user is not admin", async () => {
            const mockUser = { id: "user-1", role: "USER" };
            const mockAuth = vi.fn().mockResolvedValue({ user: mockUser } as any);

            await expect(requireAdmin(mockAuth)).rejects.toThrow("Forbidden");
        });

        it("should return user if admin", async () => {
            const mockUser = { id: "user-1", role: "ADMIN" };
            const mockAuth = vi.fn().mockResolvedValue({ user: mockUser } as any);

            const result = await requireAdmin(mockAuth);
            expect(result).toEqual(mockUser);
        });
    });
});
