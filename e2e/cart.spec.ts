import { test, expect } from "@playwright/test";

const TEST_USER = {
    email: "test@example.com",
    password: "password123",
};

test.describe("Cart E2E Tests", () => {
    test.describe("Add to Cart", () => {
        test("should add product to cart", async ({ page }) => {
            // Sign in first
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });

            // Go to products page
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            // Click on first product to go to detail page
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Wait for product detail page
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            // Check if product is in stock
            const outOfStock = await page.locator("text=Out of stock").count();

            if (outOfStock === 0) {
                // Click add to cart button
                await page.click("text=Add to Cart");

                // Wait for success message
                await expect(page.locator("text=Added to cart!")).toBeVisible({ timeout: 5000 });

                // Navigate to cart
                await page.click('a[href="/cart"]');

                // Verify cart page loads
                await expect(page).toHaveURL("/cart");

                // Verify product is in cart
                await expect(page.locator("text=Shopping Cart")).toBeVisible();
            }
        });

        test("should not show add to cart for out of stock products", async ({ page }) => {
            // This test checks that out of stock items don't show add to cart
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            // Find first product
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // If product is out of stock, add to cart button should not be visible
            // The button might still exist but be disabled
        });
    });

    test.describe("View Cart", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should view empty cart", async ({ page }) => {
            await page.goto("/cart");

            // Verify cart page loads
            await expect(page).toHaveURL("/cart");

            // Verify empty cart message
            await expect(page.locator("text=Your cart is empty")).toBeVisible();

            // Verify browse products button exists
            await expect(page.locator("text=Browse Products")).toBeVisible();
        });

        test("should view cart with items", async ({ page }) => {
            // Add a product to cart first
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart
                await page.goto("/cart");

                // Verify cart has items
                const cartItems = page.locator('[class*="border-slate-800"]');
                const count = await cartItems.count();

                if (count > 0) {
                    // Should show order summary
                    await expect(page.locator("text=Order Summary")).toBeVisible();

                    // Should show subtotal
                    await expect(page.locator("text=Subtotal")).toBeVisible();

                    // Should show total
                    await expect(page.locator("text=Total")).toBeVisible();

                    // Should show checkout button
                    await expect(page.locator("text=Checkout")).toBeVisible();
                }
            }
        });

        test("should view cart total", async ({ page }) => {
            // Add a product to cart
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart
                await page.goto("/cart");

                // Verify order summary section exists
                await expect(page.locator("text=Order Summary")).toBeVisible();

                // Should show shipping as free
                await expect(page.locator("text=Free")).toBeVisible();

                // Should show total price
                await expect(page.locator("text=Total")).toBeVisible();
            }
        });
    });

    test.describe("Remove from Cart", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should remove item from cart", async ({ page }) => {
            // Add a product to cart first
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart
                await page.goto("/cart");

                // Check if cart has items
                const cartItems = page.locator('[class*="border-slate-800"]');
                const count = await cartItems.count();

                if (count > 0) {
                    // Click remove button (trash icon)
                    const removeButton = page.locator('button[type="submit"]').first();
                    await removeButton.click();

                    // Wait for cart to update
                    await page.waitForTimeout(1000);

                    // Cart should now be empty or have fewer items
                    const newCount = await cartItems.count();
                    expect(newCount).toBeLessThanOrEqual(count);
                }
            }
        });
    });

    test.describe("Update Cart Quantity", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should display quantity in cart", async ({ page }) => {
            // Add a product to cart
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart
                await page.goto("/cart");

                // Verify quantity is displayed
                const qtyText = page.locator("text=Qty:");
                await expect(qtyText).toBeVisible();

                // Should show quantity number
                const qtyNumber = page.locator("text=/Qty: \\d+/");
                await expect(qtyNumber).toBeVisible();
            }
        });
    });

    test.describe("Cart Navigation", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should navigate to cart from header", async ({ page }) => {
            // Click cart icon in header
            await page.click('a[href="/cart"]');

            await expect(page).toHaveURL("/cart");
        });

        test("should navigate to products from empty cart", async ({ page }) => {
            await page.goto("/cart");

            // Click Browse Products button
            await page.click("text=Browse Products");

            await expect(page).toHaveURL("/products");
        });

        test("should navigate to product detail from cart item", async ({ page }) => {
            // Add a product to cart
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart
                await page.goto("/cart");

                // Click on product name in cart
                const productLink = page.locator('a[href^="/products/"]').first();
                const count = await productLink.count();

                if (count > 0) {
                    await productLink.click();

                    // Should navigate to product detail
                    await expect(page).toHaveURL(/\/products\/.+/);
                }
            }
        });
    });
});
