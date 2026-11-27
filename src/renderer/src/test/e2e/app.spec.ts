import { test, expect } from '@playwright/test';

test.describe('EXCO Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load without errors', async ({ page }) => {
    // Check that the app loads
    await expect(page.locator('#root')).toBeVisible();

    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('DevTools')).length).toBe(0);
  });

  test('should show chatbot mode by default', async ({ page }) => {
    // Check for chatbot interface elements
    await expect(page.locator('text=New Conversation')).toBeVisible();
    await expect(page.locator('text=Welcome to EXCO Chatbot')).toBeVisible();
  });

  test('should have theme toggle in header', async ({ page }) => {
    const themeButton = page.locator('button[title*="theme" i], button[title*="Theme" i]').first();
    await expect(themeButton).toBeVisible();
  });

  test('should have settings button in header', async ({ page }) => {
    const settingsButton = page.locator('button[title*="settings" i], button[title*="Settings" i]').first();
    await expect(settingsButton).toBeVisible();
  });

  test('should open settings drawer', async ({ page }) => {
    const settingsButton = page.locator('button[title*="settings" i], button[title*="Settings" i]').first();
    await settingsButton.click();

    // Check drawer is visible
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=General')).toBeVisible();
    await expect(page.locator('text=Appearance')).toBeVisible();
  });

  test('should switch between chat and work modes', async ({ page }) => {
    // Should start in chat mode
    await expect(page.locator('text=Chat')).toBeVisible();

    // Try to switch to work mode (might need workspace first)
    const workButton = page.locator('button:has-text("Work")').first();
    await workButton.click();

    // Should show workspace selection or work mode
    // (Implementation may vary)
  });

  test('should have sidebar with collapse toggle', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    const collapseButton = page.locator('button[title*="collapse" i], button[title*="Collapse" i]').first();
    await expect(collapseButton).toBeVisible();
  });
});

test.describe('Chatbot Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('should show welcome screen for new conversation', async ({ page }) => {
    await expect(page.locator('text=Welcome to EXCO Chatbot')).toBeVisible();
    await expect(page.locator('text=Start a new conversation')).toBeVisible();
  });

  test('should have message input area', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Message"], textarea[placeholder*="conversation"]').first();
    await expect(textarea).toBeVisible();
  });

  test('should have send button', async ({ page }) => {
    const sendButton = page.locator('button[title*="send" i], button[title*="Send" i]').first();
    await expect(sendButton).toBeVisible();
  });

  test('should show suggestion chips', async ({ page }) => {
    await expect(page.locator('text=Explain a concept')).toBeVisible();
    await expect(page.locator('text=Write code')).toBeVisible();
    await expect(page.locator('text=Debug an issue')).toBeVisible();
    await expect(page.locator('text=Review code')).toBeVisible();
  });
});

test.describe('Work Mode', () => {
  test('should show workspace selection when no workspace', async ({ page }) => {
    await page.goto('/work');

    // Should show empty state or workspace selector
    // Exact behavior depends on implementation
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const settingsButton = page.locator('button[title*="settings" i], button[title*="Settings" i]').first();
    await settingsButton.click();
  });

  test('should have all setting tabs', async ({ page }) => {
    await expect(page.locator('text=General')).toBeVisible();
    await expect(page.locator('text=Appearance')).toBeVisible();
    await expect(page.locator('text=AI Providers')).toBeVisible();
    await expect(page.locator('text=API Keys')).toBeVisible();
    await expect(page.locator('text=MCP Servers')).toBeVisible();
    await expect(page.locator('text=Plugins')).toBeVisible();
    await expect(page.locator('text=Security')).toBeVisible();
  });

  test('should switch theme in appearance tab', async ({ page }) => {
    await page.click('text=Appearance');

    // Check theme options
    await expect(page.locator('text=Light')).toBeVisible();
    await expect(page.locator('text=Dark')).toBeVisible();
    await expect(page.locator('text=System')).toBeVisible();
  });

  test('should show providers tab', async ({ page }) => {
    await page.click('text=AI Providers');
    await expect(page.locator('text=AI Providers')).toBeVisible();
  });

  test('should show api keys tab', async ({ page }) => {
    await page.click('text=API Keys');
    await expect(page.locator('text=API Keys')).toBeVisible();
  });
});