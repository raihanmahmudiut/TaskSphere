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
  test('full user journey: create todo, add task', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('button', { name: /new todo/i }).click();
    await expect(page.getByText('Create new todo')).toBeVisible({ timeout: 3000 });
    await page.locator('#app-name').fill('E2E Test Todo');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByText('E2E Test Todo')).toBeVisible({ timeout: 5000 });
    await page.getByText('E2E Test Todo').click();
    await expect(page).toHaveURL(/\/todo\//, { timeout: 5000 });

    await page.getByRole('button', { name: 'Task', exact: true }).click();
    await expect(page.getByText('New Task')).toBeVisible({ timeout: 3000 });
    await page.locator('#task-title').fill('E2E Task 1');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByText('E2E Task 1')).toBeVisible({ timeout: 5000 });
  });
});
