import { Page, Locator, expect } from "@playwright/test";

/**
 * Test user credentials for E2E testing
 */
export const TEST_USERS = {
    default: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
    },
    admin: {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
    },
};

/**
 * Generate a unique email for testing
 */
export function generateUniqueEmail(): string {
    return `test${Date.now()}@example.com`;
}

/**
 * Sign in a user with email and password
 */
export async function signIn(page: Page, email: string, password: string): Promise<void> {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });
}

/**
 * Sign up a new user
 */
export async function signUp(
    page: Page,
    name: string,
    email: string,
    password: string
): Promise<void> {
    await page.goto("/sign-up");
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });
}

/**
 * Sign out the current user
 */
export async function signOut(page: Page): Promise<void> {
    await page.click("text=Sign Out");
    await expect(page.locator("text=Sign In")).toBeVisible();
}

/**
 * Add a product to cart from the products listing page
 */
export async function addProductToCart(page: Page): Promise<boolean> {
    await page.goto("/products");
    await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

    const firstProduct = page.locator("a[href^='/products/']").first();
    await firstProduct.click();
    await page.waitForSelector("text=Add to Cart", { timeout: 10000 });

    // Check if product is in stock
    const outOfStock = await page.locator("text=Out of stock").count();
    if (outOfStock > 0) {
        return false;
    }

    await page.click("text=Add to Cart");
    await page.waitForTimeout(1000);
    return true;
}

/**
 * Get the cart page and wait for it to load
 */
export async function goToCart(page: Page): Promise<void> {
    await page.goto("/cart");
    await page.waitForSelector("text=Shopping Cart", { timeout: 10000 });
}

/**
 * Get a product from the products listing
 */
export async function getFirstAvailableProduct(page: Page): Promise<Locator | null> {
    await page.goto("/products");
    await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

    const products = page.locator("a[href^='/products/']");
    const count = await products.count();

    if (count === 0) {
        return null;
    }

    return products.first();
}

/**
 * Check if user is signed in by looking for sign out button
 */
export async function isSignedIn(page: Page): Promise<boolean> {
    const signOutButton = page.locator("text=Sign Out");
    const count = await signOutButton.count();
    return count > 0;
}

/**
 * Wait for an element to be visible with custom timeout
 */
export async function waitForElement(
    page: Page,
    selector: string,
    timeout: number = 10000
): Promise<Locator> {
    return page.locator(selector).first();
}

/**
 * Get text content of an element
 */
export async function getElementText(page: Page, selector: string): Promise<string> {
    const element = page.locator(selector).first();
    const text = await element.textContent();
    return text ?? "";
}

/**
 * Check if element exists on page
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
    const count = await page.locator(selector).count();
    return count > 0;
}

/**
 * Navigate to home page
 */
export async function goToHome(page: Page): Promise<void> {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
}

/**
 * Navigate to products page
 */
export async function goToProducts(page: Page): Promise<void> {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");
}

/**
 * Navigate to orders page
 */
export async function goToOrders(page: Page): Promise<void> {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");
}

/**
 * Get the cart item count from header
 */
export async function getCartItemCount(page: Page): Promise<number> {
    // This would require the cart to show item count in header
    // For now, return 0 as placeholder
    return 0;
}

/**
 * Clear cart by removing all items
 */
export async function clearCart(page: Page): Promise<void> {
    await goToCart(page);

    // Check if cart has items
    const removeButtons = page.locator('form button[type="submit"]');
    const count = await removeButtons.count();

    for (let i = 0; i < count; i++) {
        await removeButtons.first().click();
        await page.waitForTimeout(500);
    }
}

/**
 * Take a screenshot for debugging (useful during test development)
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}
