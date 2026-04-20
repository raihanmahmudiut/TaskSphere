import { test, expect, type Page } from '@playwright/test';

const email = `pw-dash-${Date.now()}@test.com`;
const password = 'TestPass123!';

async function registerAndLogin(page: Page) {
  await page.goto('/register');
  await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#confirm').fill(password);
  await page.getByRole('button', { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

  await expect(page.locator('#email')).toBeVisible({ timeout: 5000 });
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

test.describe('Dashboard & Task Flow', () => {
  test('full user journey: create app, add task', async ({ page }) => {
    await registerAndLogin(page);

    // Create a new todo app via the "New App" button in header
    await page.getByRole('button', { name: /new app/i }).click();
    await expect(page.getByText('Create new app')).toBeVisible({ timeout: 3000 });
    await page.locator('#app-name').fill('E2E Test App');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Wait for app to appear and navigate
    await expect(page.getByText('E2E Test App')).toBeVisible({ timeout: 5000 });
    await page.getByText('E2E Test App').click();
    await expect(page).toHaveURL(/\/todo\//, { timeout: 5000 });

    // Add a task
    await page.getByRole('button', { name: /add task/i }).click();
    await expect(page.getByText('New Task')).toBeVisible({ timeout: 3000 });
    await page.locator('#task-title').fill('E2E Task 1');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByText('E2E Task 1')).toBeVisible({ timeout: 5000 });
  });
});
