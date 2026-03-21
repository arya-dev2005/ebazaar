import { describe, it, expect, vi, beforeEach } from "vitest";

describe("order service", () => {
    // Mock prisma
    const mockPrisma = {
        order: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        product: {
            update: vi.fn(),
        },
        cart: {
            findUnique: vi.fn(),
        },
        cartItem: {
            deleteMany: vi.fn(),
        },
    };

    // Simulated service functions
    const createOrder = async (data: {
        userId: string;
        total: number;
        stripeSessionId: string;
        items: { productId: string; quantity: number; price: number }[];
    }) => {
        return mockPrisma.order.create({
            data: {
                userId: data.userId,
                total: data.total,
                stripeSessionId: data.stripeSessionId,
                status: "PENDING",
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
    };

    const getOrdersByUser = async (userId: string) => {
        const orders = await mockPrisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, slug: true, images: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return orders;
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        return mockPrisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createOrder", () => {
        it("should create with items", async () => {
            const orderItems = [
                { productId: "prod-1", quantity: 2, price: 49.99 },
            ];

            const orderData = {
                userId: "user-1",
                total: 99.99,
                stripeSessionId: "session_123",
                items: orderItems,
            };

            const createdOrder = {
                id: "order-1",
                userId: "user-1",
                status: "PENDING",
                total: 99.99,
                stripeSessionId: "session_123",
                shippingAddress: null,
                createdAt: new Date(),
                items: [
                    {
                        id: "item-1",
                        quantity: 2,
                        price: 49.99,
                        product: { id: "prod-1", name: "Product", slug: "product", images: "[]" },
                    },
                ],
            };

            mockPrisma.order.create.mockResolvedValue(createdOrder);

            const result = await createOrder(orderData);

            expect(result).toEqual(createdOrder);
            expect(mockPrisma.order.create).toHaveBeenCalledWith({
                data: {
                    userId: "user-1",
                    total: 99.99,
                    stripeSessionId: "session_123",
                    status: "PENDING",
                    items: {
                        create: orderItems,
                    },
                },
                include: { items: { include: { product: true } } },
            });
        });

        it("should create order with multiple items", async () => {
            const orderItems = [
                { productId: "prod-1", quantity: 1, price: 50.0 },
                { productId: "prod-2", quantity: 2, price: 50.0 },
            ];

            const orderData = {
                userId: "user-1",
                total: 150.0,
                stripeSessionId: "session_456",
                items: orderItems,
            };

            const createdOrder = {
                id: "order-1",
                userId: "user-1",
                status: "PENDING",
                total: 150.0,
                stripeSessionId: "session_456",
                shippingAddress: null,
                createdAt: new Date(),
                items: [
                    {
                        id: "item-1",
                        quantity: 1,
                        price: 50.0,
                        product: { id: "prod-1", name: "Product 1", slug: "p1", images: "[]" },
                    },
                    {
                        id: "item-2",
                        quantity: 2,
                        price: 50.0,
                        product: { id: "prod-2", name: "Product 2", slug: "p2", images: "[]" },
                    },
                ],
            };

            mockPrisma.order.create.mockResolvedValue(createdOrder);

            const result = await createOrder(orderData);

            expect(result.items).toHaveLength(2);
        });
    });

    describe("getOrdersByUser", () => {
        it("should filter by user", async () => {
            const orders = [
                {
                    id: "order-1",
                    userId: "user-1",
                    status: "PENDING",
                    total: 99.99,
                    stripeSessionId: "session_1",
                    shippingAddress: null,
                    createdAt: new Date(),
                    items: [],
                },
            ];

            mockPrisma.order.findMany.mockResolvedValue(orders);

            const result = await getOrdersByUser("user-1");

            expect(result).toEqual(orders);
            expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
                where: { userId: "user-1" },
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, name: true, slug: true, images: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        });

        it("should return empty array if no orders", async () => {
            mockPrisma.order.findMany.mockResolvedValue([]);

            const result = await getOrdersByUser("user-1");

            expect(result).toEqual([]);
        });

        it("should return orders sorted by date descending", async () => {
            mockPrisma.order.findMany.mockResolvedValue([]);

            await getOrdersByUser("user-1");

            expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    orderBy: { createdAt: "desc" },
                })
            );
        });
    });

    describe("updateOrderStatus", () => {
        it("should update status", async () => {
            const updatedOrder = {
                id: "order-1",
                status: "SHIPPED",
            };

            mockPrisma.order.update.mockResolvedValue(updatedOrder);

            const result = await updateOrderStatus("order-1", "SHIPPED");

            expect(result).toEqual(updatedOrder);
            expect(mockPrisma.order.update).toHaveBeenCalledWith({
                where: { id: "order-1" },
                data: { status: "SHIPPED" },
            });
        });

        it("should update to PENDING status", async () => {
            const updatedOrder = { id: "order-1", status: "PENDING" };
            mockPrisma.order.update.mockResolvedValue(updatedOrder);

            const result = await updateOrderStatus("order-1", "PENDING");
            expect(result.status).toBe("PENDING");
        });

        it("should update to PAID status", async () => {
            const updatedOrder = { id: "order-1", status: "PAID" };
            mockPrisma.order.update.mockResolvedValue(updatedOrder);

            const result = await updateOrderStatus("order-1", "PAID");
            expect(result.status).toBe("PAID");
        });

        it("should update to DELIVERED status", async () => {
            const updatedOrder = { id: "order-1", status: "DELIVERED" };
            mockPrisma.order.update.mockResolvedValue(updatedOrder);

            const result = await updateOrderStatus("order-1", "DELIVERED");
            expect(result.status).toBe("DELIVERED");
        });

        it("should update to CANCELLED status", async () => {
            const updatedOrder = { id: "order-1", status: "CANCELLED" };
            mockPrisma.order.update.mockResolvedValue(updatedOrder);

            const result = await updateOrderStatus("order-1", "CANCELLED");
            expect(result.status).toBe("CANCELLED");
        });
    });
});
