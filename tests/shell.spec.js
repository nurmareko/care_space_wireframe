import { test, expect } from "@playwright/test";

const apps = [
  { id: "customer", initial: "home", screens: ["welcome", "phone", "search", "outlet", "favorites", "appointments", "rewards", "profile", "language", "support", "home"], nativeNav: "Main navigation", nativeLabel: "Profile", nativeScreen: "profile" },
  { id: "manager", initial: "frontdesk", screens: ["reservations", "detail", "manage", "business", "services", "service", "hours", "staff", "schedule", "activity", "frontdesk"], nativeNav: "Manager navigation", nativeLabel: "Reservations", nativeScreen: "reservations" },
  { id: "staff", initial: "agenda", screens: ["detail", "availability", "profile", "agenda"], nativeNav: "Staff navigation", nativeLabel: "Availability", nativeScreen: "availability" },
];
const menu = (page) => page.getByRole("navigation", { name: "Screen navigation", includeHidden: true });
const item = (page, id) => menu(page).locator(`[data-screen="${id}"]`);

async function expectActive(page, id) {
  await expect(menu(page).locator('[aria-current="page"]')).toHaveCount(1);
  await expect(item(page, id)).toHaveAttribute("aria-current", "page");
}

async function expectBoundedPhone(page) {
  const { width, height } = page.viewportSize();
  const phone = page.locator(".phone");
  await expect(phone).toBeVisible();
  const box = await phone.boundingBox();
  expect(box.width).toBeGreaterThan(0);
  expect(box.height).toBeGreaterThan(0);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
  const size = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  expect(size.width).toBeLessThanOrEqual(width + 1);
  expect(size.height).toBeLessThanOrEqual(height + 1);
}

async function expectNoHiddenTabStops(page, hiddenSelector, start) {
  // Walk a full keyboard cycle, including shadow-root inputs in wired elements.
  const count = await page.locator("button, a[href], input, textarea, select, summary, [tabindex]").count();
  await start.focus();
  for (let i = 0; i < count + 2; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate((selector) => {
      const active = document.activeElement;
      return !!active?.closest(selector);
    }, hiddenSelector)).toBe(false);
  }
}

for (const app of apps) {
  test(`${app.id} desktop screen menu navigates and tracks native active states`, async ({ page }) => {
    await page.goto(`/?app=${app.id}`);
    await expect(page.locator(".prototype-sidebar")).toBeVisible();
    await expect(menu(page)).toBeVisible();
    await expect(page.locator(".screen-menu-toggle")).toBeHidden();
    await expectActive(page, app.initial);
    for (const id of app.screens) {
      await item(page, id).click();
      await expectActive(page, id);
      await expect(page.locator(".screen")).toBeFocused();
      await expect(page.locator(".screen")).not.toBeEmpty();
    }
    await page.locator(".phone").getByRole("navigation", { name: app.nativeNav })
      .getByRole("button", { name: app.nativeLabel, exact: true }).click();
    await expectActive(page, app.nativeScreen);
  });

  test(`${app.id} mobile menu starts closed, toggles, selects, and dismisses with Escape`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 740 });
    await page.goto(`/?app=${app.id}`);
    const toggle = page.locator(".screen-menu-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu(page)).toBeHidden();
    await expectNoHiddenTabStops(page, ".screen-menu", toggle);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu(page)).toBeVisible();
    await expect(menu(page).locator("..")).toHaveAttribute("id", await toggle.getAttribute("aria-controls"));
    await expectActive(page, app.initial);
    await item(page, app.nativeScreen).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu(page)).toBeHidden();
    await expect(page.locator(".screen")).toBeFocused();
    await toggle.click();
    await expectActive(page, app.nativeScreen);
    await item(page, app.nativeScreen).focus();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await toggle.click();
    await expect(menu(page)).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  for (const viewport of [{ width: 1280, height: 650 }, { width: 390, height: 740 }]) {
    test(`${app.id} Zen mode at ${viewport.width}px preserves state, bounds, and focus without browser fullscreen`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript(() => {
        window.fullscreenCalls = [];
        Element.prototype.requestFullscreen = function () {
          window.fullscreenCalls.push("request");
          return Promise.resolve();
        };
        Document.prototype.exitFullscreen = function () {
          window.fullscreenCalls.push("exit");
          return Promise.resolve();
        };
      });
      await page.goto(`/?app=${app.id}`);
      const mobile = viewport.width <= 900;
      const toggle = page.locator(".screen-menu-toggle");
      const entry = page.getByRole("button", { name: "Zen mode", exact: true });
      const exit = page.getByRole("button", { name: "Exit Zen mode", exact: true });
      const phone = page.locator(".phone");
      if (mobile) await toggle.click();
      const stateScreen = { customer: "search", manager: "frontdesk", staff: "availability" }[app.id];
      await item(page, stateScreen).click();
      let draft;
      if (app.id === "customer") {
        draft = phone.locator("wired-search-input input");
        await draft.fill("menteng");
      } else if (app.id === "manager") {
        draft = phone.locator('wired-input[aria-label="Booking code"] input');
        await draft.fill("CS-1041");
      } else {
        draft = phone.locator("wired-toggle input");
        await phone.locator("wired-toggle").click();
      }
      const expectDraft = async () => {
        if (app.id === "staff") {
          await expect(draft).not.toBeChecked();
          await expect(phone.getByRole("button", { name: "Save changes" })).toBeEnabled();
        } else await expect(draft).toHaveValue(app.id === "customer" ? "menteng" : "CS-1041");
      };
      await expectBoundedPhone(page);
      const normalWidth = (await phone.boundingBox()).width;
      for (const method of ["button", "Escape"]) {
        if (mobile) await toggle.click();
        await expect(entry).toHaveAttribute("aria-pressed", "false");
        await entry.click();
        await expect(page.locator(".workspace")).toHaveClass(/zen-mode/);
        await expect(exit).toHaveAttribute("aria-pressed", "true");
        await expect(exit).toBeFocused();
        await expect(page.locator(".canvas-header")).toBeHidden();
        await expect(page.locator(".prototype-sidebar")).toBeHidden();
        await expect(menu(page)).toBeHidden();
        await expectBoundedPhone(page);
        expect((await phone.boundingBox()).width).toBeLessThanOrEqual(normalWidth + 1);
        const box = await phone.boundingBox();
        expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
        await expectDraft();
        await expectNoHiddenTabStops(page, ".prototype-sidebar, .canvas-header", exit);
        if (method === "button") await exit.click();
        else await page.keyboard.press("Escape");
        await expect(page.locator(".workspace")).not.toHaveClass(/zen-mode/);
        await expect(exit).toHaveCount(0);
        await expect(mobile ? toggle : entry).toBeFocused();
        await expect(page.locator(".canvas-header")).toBeVisible();
        if (mobile) {
          await expect(toggle).toHaveAttribute("aria-expanded", "false");
          await expect(menu(page)).toBeHidden();
        } else await expect(menu(page)).toBeVisible();
        await expectActive(page, stateScreen);
        await expectDraft();
        await expectBoundedPhone(page);
      }
      expect(await page.evaluate(() => window.fullscreenCalls)).toEqual([]);
      expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
    });
  }
}

test("Escape closes a staff dialog before leaving Zen mode and keeps the unsaved draft", async ({ page }) => {
  await page.goto("/?app=staff");
  await item(page, "availability").click();
  await page.locator(".phone wired-toggle").click();
  await page.getByRole("button", { name: "Zen mode", exact: true }).click();
  await page.locator(".phone").getByRole("navigation", { name: "Staff navigation" })
    .getByRole("button", { name: "Profile", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Discard changes?");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Exit Zen mode" })).toBeVisible();
  await expect(page.locator(".phone wired-toggle input")).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Zen mode", exact: true })).toBeFocused();
  await expectActive(page, "availability");
});
