const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.join(__dirname, 'index.html');

test.describe('Game CRUD Frontend', () => {
  test('should create, read, update, and delete a game', async ({ page }) => {
    await page.goto(FILE_URL);

    await page.fill('#title', 'Playwright JS Game');
    await page.fill('#genre', 'Adventure');
    await page.fill('#year', '2025');
    await page.click('button:has-text("Save Game")');

    await page.waitForSelector('.game');
    const gameBlock = page.locator('.game').first();
    await expect(gameBlock).toContainText('Playwright JS Game');
    
    await gameBlock.locator('button:has-text("Edit")').click();
    await page.fill('#title', 'Updated JS Game');
    await page.click('button:has-text("Save Game")');
    await expect(gameBlock).toContainText('Updated JS Game');

    await gameBlock.locator('button:has-text("Delete")').click();
    await expect(gameBlock).not.toContainText('Updated JS Game');
  });
});
