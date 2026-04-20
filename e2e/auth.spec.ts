import { test, expect } from '@playwright/test';

const uniqueEmail = `pw-${Date.now()}@test.com`;
const password = 'TestPass123!';

test.describe.serial('Authentication Flow', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 5000 });
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page.locator('text=Create account').first()).toBeVisible({ timeout: 5000 });
  });

  test('should register and redirect to login', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });

    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#password').fill(password);
    await page.locator('#confirm').fill(password);

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should login with the registered user', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });

    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });

    await page.locator('#email').fill('nonexistent@test.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('.text-destructive')).toBeVisible({ timeout: 5000 });
  });
});
