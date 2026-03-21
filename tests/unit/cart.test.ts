import { describe, it, expect, vi, beforeEach } from "vitest";

describe("cart service", () => {
    // Mock prisma
    const mockPrisma = {
        cart: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        cartItem: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn(),
        },
        product: {
            findUnique: vi.fn(),
        },
    };

    // Simulated service functions
    const getOrCreateCart = async (userId: string) => {
        let cart = await mockPrisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, slug: true, price: true, images: true, stock: true },
                        },
                    },
                },
            },
        });

        if (!cart) {
            cart = await mockPrisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, name: true, slug: true, price: true, images: true, stock: true },
                            },
                        },
                    },
                },
            });
        }

        return cart;
    };

    const addToCart = async (userId: string, productId: string, quantity: number) => {
        const cart = await getOrCreateCart(userId);

        const product = await mockPrisma.product.findUnique({ where: { id: productId } });
        if (!product || product.stock < quantity) {
            throw new Error("Product not available in requested quantity");
        }

        const existing = cart.items.find((item: any) => item.product.id === productId);
        if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
                throw new Error("Not enough stock available");
            }
            return mockPrisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: newQty },
            });
        }

        return mockPrisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
        });
    };

    const updateCartItem = async (cartItemId: string, quantity: number, userId: string) => {
        const cartItem = await mockPrisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true, product: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new Error("Cart item not found");
        }

        if (quantity > cartItem.product.stock) {
            throw new Error("Not enough stock available");
        }

        return mockPrisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    };

    const removeFromCart = async (cartItemId: string, userId: string) => {
        const cartItem = await mockPrisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new Error("Cart item not found");
        }

        return mockPrisma.cartItem.delete({ where: { id: cartItemId } });
    };

    const calculateCartTotal = (cart: any) => {
        return cart.items.reduce(
            (total: number, item: any) => total + item.product.price * item.quantity,
            0
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getOrCreateCart", () => {
        it("should return existing cart", async () => {
            const existingCart = {
                id: "cart-1",
                userId: "user-1",
                items: [],
            };

            mockPrisma.cart.findUnique.mockResolvedValue(existingCart);

            const result = await getOrCreateCart("user-1");

            expect(result).toEqual(existingCart);
            expect(mockPrisma.cart.create).not.toHaveBeenCalled();
        });

        it("should create cart if not exists", async () => {
            mockPrisma.cart.findUnique.mockResolvedValue(null);

            const newCart = {
                id: "cart-new",
                userId: "user-1",
                items: [],
            };

            mockPrisma.cart.create.mockResolvedValue(newCart);

            const result = await getOrCreateCart("user-1");

            expect(result).toEqual(newCart);
            expect(mockPrisma.cart.create).toHaveBeenCalledWith({
                data: { userId: "user-1" },
                include: expect.any(Object),
            });
        });
    });

    describe("addToCart", () => {
        it("should add new item to cart", async () => {
            const mockCart = {
                id: "cart-1",
                userId: "user-1",
                items: [],
            };

            const productData = {
                id: "prod-1",
                name: "Test Product",
                price: 99.99,
                stock: 10,
            };

            mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
            mockPrisma.product.findUnique.mockResolvedValue(productData);

            const newCartItem = { id: "item-1", cartId: "cart-1", productId: "prod-1", quantity: 1 };
            mockPrisma.cartItem.create.mockResolvedValue(newCartItem);

            const result = await addToCart("user-1", "prod-1", 1);

            expect(result).toEqual(newCartItem);
        });

        it("should update quantity if item exists", async () => {
            const mockCart = {
                id: "cart-1",
                userId: "user-1",
                items: [
                    {
                        id: "item-1",
                        quantity: 1,
                        product: { id: "prod-1", name: "Test", slug: "test", price: 99.99, images: "[]", stock: 10 },
                    },
                ],
            };

            const productData = {
                id: "prod-1",
                name: "Test Product",
                price: 99.99,
                stock: 10,
            };

            mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
            mockPrisma.product.findUnique.mockResolvedValue(productData);

            const updatedItem = { id: "item-1", quantity: 3 };
            mockPrisma.cartItem.update.mockResolvedValue(updatedItem);

            const result = await addToCart("user-1", "prod-1", 2);

            expect(result.quantity).toBe(3);
        });

        it("should throw if not enough stock", async () => {
            const mockCart = {
                id: "cart-1",
                userId: "user-1",
                items: [],
            };

            const productData = {
                id: "prod-1",
                name: "Test Product",
                price: 99.99,
                stock: 2,
            };

            mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
            mockPrisma.product.findUnique.mockResolvedValue(productData);

            await expect(addToCart("user-1", "prod-1", 5)).rejects.toThrow(
                "Product not available in requested quantity"
            );
        });

        it("should throw when exceeding stock on update", async () => {
            const mockCart = {
                id: "cart-1",
                userId: "user-1",
                items: [
                    {
                        id: "item-1",
                        quantity: 5,
                        product: { id: "prod-1", name: "Test", slug: "test", price: 99.99, images: "[]", stock: 5 },
                    },
                ],
            };

            const productData = {
                id: "prod-1",
                name: "Test Product",
                price: 99.99,
                stock: 5,
            };

            mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
            mockPrisma.product.findUnique.mockResolvedValue(productData);

            await expect(addToCart("user-1", "prod-1", 2)).rejects.toThrow(
                "Not enough stock available"
            );
        });
    });

    describe("updateCartItem", () => {
        it("should update quantity", async () => {
            const mockCartItem = {
                id: "item-1",
                quantity: 2,
                cart: { userId: "user-1" },
                product: { stock: 10 },
            };

            mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
            mockPrisma.cartItem.update.mockResolvedValue({ ...mockCartItem, quantity: 5 });

            const result = await updateCartItem("item-1", 5, "user-1");

            expect(result.quantity).toBe(5);
        });

        it("should throw if cart item not found", async () => {
            mockPrisma.cartItem.findUnique.mockResolvedValue(null);

            await expect(updateCartItem("item-1", 5, "user-1")).rejects.toThrow(
                "Cart item not found"
            );
        });

        it("should throw if user does not own cart", async () => {
            const mockCartItem = {
                id: "item-1",
                cart: { userId: "other-user" },
            };

            mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);

            await expect(updateCartItem("item-1", 5, "user-1")).rejects.toThrow(
                "Cart item not found"
            );
        });

        it("should throw if not enough stock", async () => {
            const mockCartItem = {
                id: "item-1",
                cart: { userId: "user-1" },
                product: { stock: 3 },
            };

            mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);

            await expect(updateCartItem("item-1", 10, "user-1")).rejects.toThrow(
                "Not enough stock available"
            );
        });
    });

    describe("removeFromCart", () => {
        it("should remove item", async () => {
            const mockCartItem = {
                id: "item-1",
                cart: { userId: "user-1" },
            };

            mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
            mockPrisma.cartItem.delete.mockResolvedValue({ id: "item-1" });

            await removeFromCart("item-1", "user-1");

            expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
                where: { id: "item-1" },
            });
        });

        it("should throw if cart item not found", async () => {
            mockPrisma.cartItem.findUnique.mockResolvedValue(null);

            await expect(removeFromCart("item-1", "user-1")).rejects.toThrow(
                "Cart item not found"
            );
        });
    });

    describe("calculateCartTotal", () => {
        it("should sum correctly", () => {
            const cart = {
                id: "cart-1",
                userId: "user-1",
                items: [
                    {
                        id: "item-1",
                        quantity: 2,
                        product: { id: "p1", name: "Product 1", slug: "p1", price: 10.0, images: "[]", stock: 5 },
                    },
                    {
                        id: "item-2",
                        quantity: 3,
                        product: { id: "p2", name: "Product 2", slug: "p2", price: 20.0, images: "[]", stock: 5 },
                    },
                ],
            };

            const total = calculateCartTotal(cart);

            expect(total).toBe(80);
        });

        it("should return 0 for empty cart", () => {
            const cart = {
                id: "cart-1",
                userId: "user-1",
                items: [],
            };

            const total = calculateCartTotal(cart);

            expect(total).toBe(0);
        });

        it("should handle single item", () => {
            const cart = {
                id: "cart-1",
                userId: "user-1",
                items: [
                    {
                        id: "item-1",
                        quantity: 5,
                        product: { id: "p1", name: "Product", slug: "product", price: 15.99, images: "[]", stock: 10 },
                    },
                ],
            };

            const total = calculateCartTotal(cart);

            expect(total).toBe(79.95);
        });
    });
});
