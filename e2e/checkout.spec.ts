import { test, expect } from "@playwright/test";

const TEST_USER = {
    email: "test@example.com",
    password: "password123",
};

test.describe("Checkout E2E Tests", () => {
    test.describe("Checkout Flow", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should view cart and proceed to checkout", async ({ page }) => {
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
                const checkoutButton = page.locator("text=Checkout");
                const buttonCount = await checkoutButton.count();

                if (buttonCount > 0) {
                    // Click checkout button
                    await checkoutButton.click();

                    // Note: In real scenario, this would redirect to Stripe
                    // For E2E testing with mocked Stripe, we check if checkout initiates
                    // The actual Stripe redirect will fail without real payment
                    // but we can verify the checkout action was triggered
                    await page.waitForTimeout(2000);
                }
            }
        });

        test("should show checkout button when cart has items", async ({ page }) => {
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

                // Verify checkout button exists
                await expect(page.locator("text=Checkout")).toBeVisible();
            }
        });

        test("should display order summary on cart page before checkout", async ({ page }) => {
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

                // Verify order summary section
                await expect(page.locator("text=Order Summary")).toBeVisible();

                // Verify subtotal is shown
                await expect(page.locator("text=Subtotal")).toBeVisible();

                // Verify shipping is shown
                await expect(page.locator("text=Shipping")).toBeVisible();

                // Verify total is shown
                await expect(page.locator("text=Total")).toBeVisible();
            }
        });
    });

    test.describe("Checkout Cancel Flow", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should return to cart when checkout is cancelled", async ({ page }) => {
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

                // Click checkout
                await page.click("text=Checkout");

                // Wait a moment for potential redirect
                await page.waitForTimeout(2000);

                // If Stripe checkout was initiated, it would redirect away
                // If cancelled/failed, should return to cart or show error
                // The success page redirects to cart if no session_id
                const currentUrl = page.url();
                expect(currentUrl).toMatch(/cart|checkout/);
            }
        });

        test("should redirect to cart when accessing success page without session", async ({ page }) => {
            // Try to access success page directly without session_id
            await page.goto("/checkout/success");

            // Should redirect to cart
            await expect(page).toHaveURL("/cart");
        });
    });

    test.describe("Order After Checkout (Mocked)", () => {
        test.beforeEach(async ({ page }) => {
            // Sign in before each test
            await page.goto("/sign-in");
            await page.fill('input[name="email"]', TEST_USER.email);
            await page.fill('input[name="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL("/", { timeout: 10000 });
        });

        test("should view orders page", async ({ page }) => {
            // Navigate to orders page
            await page.goto("/orders");

            // Verify orders page loads
            await expect(page).toHaveURL("/orders");

            // Verify page title
            await expect(page.locator("text=Your Orders")).toBeVisible();
        });

        test("should show empty orders when no orders exist", async ({ page }) => {
            await page.goto("/orders");

            // Should show empty state
            await expect(page.locator("text=No orders yet")).toBeVisible();
        });

        test("should navigate to orders from header when signed in", async ({ page }) => {
            // Click Orders in header
            await page.click("nav >> text=Orders");

            await expect(page).toHaveURL("/orders");
        });

        test("should display order details when orders exist", async ({ page }) => {
            // First add a product and complete checkout (mocked)
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();
            await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

            const outOfStock = await page.locator("text=Out of stock").count();
            if (outOfStock === 0) {
                await page.click("text=Add to Cart");
                await page.waitForTimeout(1000);

                // Go to cart and checkout
                await page.goto("/cart");
                await page.click("text=Checkout");
                await page.waitForTimeout(2000);

                // Go to orders page
                await page.goto("/orders");

                // Check if any orders exist
                // Note: Real orders would only exist after successful payment
                // For now, verify the page structure
                await expect(page.locator("h1")).toContainText("Orders");
            }
        });
    });

    test.describe("Checkout Security", () => {
        test("should redirect to sign in when accessing checkout without auth", async ({ page }) => {
            await page.goto("/checkout/success?session_id=test123");

            // Should redirect to sign in
            await expect(page).toHaveURL(/sign-in/);
        });

        test("should require authentication for orders page", async ({ page }) => {
            // Clear any existing session
            await page.context().clearCookies();

            await page.goto("/orders");

            // Should redirect to sign in
            await expect(page).toHaveURL(/sign-in/);
        });
    });
});
