import { test, expect } from "@playwright/test";

const roles = [
  { id: "manager", action: "Open Front Desk", destination: "frontdesk", navigation: "Manager navigation" },
  { id: "staff", action: "View my agenda", destination: "agenda", navigation: "Staff navigation" },
];

for (const width of [390, 1440]) {
  for (const role of roles) {
    test(`${role.id} welcome at ${width}px enters workspace and can be revisited`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 740 : 900 });
      await page.goto(`/?app=${role.id}`);
      const screen = page.locator(".screen");
      const menu = page.getByRole("navigation", { name: "Screen navigation", includeHidden: true });
      const welcome = menu.locator('[data-screen="welcome"]');
      await expect(page.locator(`#${role.id}-welcome`)).toBeVisible();
      await expect(welcome).toHaveAttribute("aria-current", "page");
      await expect(page.getByRole("navigation", { name: role.navigation })).toHaveCount(0);
      await expect(screen.getByRole("button", { name: role.action, exact: true })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `test-results/${role.id}-welcome-${width}.png`, fullPage: true, animations: "disabled" });
      await screen.getByRole("button", { name: role.action, exact: true }).click();
      await expect(page.locator(`#${role.id}-${role.destination}`)).toBeVisible();
      await expect(menu.locator(`[data-screen="${role.destination}"]`)).toHaveAttribute("aria-current", "page");
      await expect(page.getByRole("navigation", { name: role.navigation })).toBeVisible();
      if (width === 390) await page.locator(".screen-menu-toggle").click();
      await welcome.click();
      await expect(page.locator(`#${role.id}-welcome`)).toBeVisible();
      await expect(screen).toBeFocused();
      await expect(welcome).toHaveAttribute("aria-current", "page");
      await screen.getByRole("button", { name: role.action, exact: true }).click();
      await expect(page.locator(`#${role.id}-${role.destination}`)).toBeVisible();
    });
  }

  for (const app of ["customer", "manager", "staff"]) {
    test(`${app} headerless shell and normal/Zen captures at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 740 : 900 });
      await page.goto(`/?app=${app}`);
      const role = roles.find((role) => role.id === app);
      if (role) await page.locator(".screen").getByRole("button", { name: role.action, exact: true }).click();
      await expect(page.locator(".canvas-header")).toHaveCount(0);
      await expect(page.getByRole("button", { name: /^Reset(?: prototype)?$/i, includeHidden: true })).toHaveCount(0);
      await expect(page.locator('.prototype-sidebar button').filter({ hasText: /reset/i })).toHaveCount(0);
      const allApps = page.locator(".prototype-sidebar").getByRole("link", { name: "All apps", exact: true, includeHidden: true });
      await expect(allApps).toHaveCount(1);
      if (width === 390) {
        await expect(allApps).toBeHidden();
        await page.locator(".screen-menu-toggle").click();
        await expect(allApps).toBeVisible();
        await page.locator(".screen-menu-toggle").click();
      } else await expect(allApps).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `test-results/${app}-normal-${width}.png`, fullPage: true, animations: "disabled" });
      await page.locator(".zen-entry").click();
      await expect(page.locator(".prototype-sidebar")).toBeHidden();
      await page.screenshot({ path: `test-results/${app}-zen-${width}.png`, fullPage: true, animations: "disabled" });
      await page.locator(".zen-exit").click();
      await expect(page.locator(".zen-entry")).toBeFocused();
      if (width === 390) await page.locator(".screen-menu-toggle").click();
      await allApps.click();
      await expect(page.getByRole("navigation", { name: "Choose an app" })).toBeVisible();
    });
  }
}
