import { test, expect } from "@playwright/test";

for (const [name, id] of [
  ["Customer", "customer"],
  ["Manager", "manager"],
  ["Staff", "staff"],
]) {
  test(`chooser opens ${name} and returns through All apps`, async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Choose your app." }),
    ).toBeVisible();
    const link = page.getByRole("link", { name, exact: true });
    await link.focus();
    await expect(
      page.locator(".chooser-preview img.is-visible"),
    ).toHaveAttribute("src", `/previews/${id}.png`);
    await link.press("Enter");
    await expect(page).toHaveURL(new RegExp(`app=${id}`));
    await expect(page.locator(".screen")).toBeVisible();
    await expect(page.locator(".sidebar")).toHaveCount(0);
    await expect(page.locator('a[href^="?app="]')).toHaveCount(0);
    await page.getByRole("link", { name: "All apps", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Choose an app" }),
    ).toBeVisible();
  });
}

for (const app of ["customer", "manager", "staff"]) {
  test(`${app} fits short viewports and toggles fullscreen`, async ({ page }) => {
    await page.goto(`/?app=${app}`);
    const phone = page.locator(".phone");
    for (const viewport of [{ width: 1280, height: 650 }, { width: 390, height: 740 }]) {
      await page.setViewportSize(viewport);
      const box = await phone.boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(viewport.height + 1);
    }
    await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
    await expect(page.getByRole("button", { name: "Exit fullscreen" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect(page.getByRole("button", { name: "Fullscreen", exact: true })).toHaveAttribute("aria-pressed", "false");

    // Exercise browsers that do not support element fullscreen.
    await page.evaluate(() => { Element.prototype.requestFullscreen = undefined; });
    await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
    await expect(phone).toHaveClass(/phone-expanded/);
    await page.keyboard.press("Escape");
    await expect(phone).not.toHaveClass(/phone-expanded/);
    await expect(page.getByRole("button", { name: "Fullscreen", exact: true })).toBeFocused();
  });
}

for (const width of [1440, 768, 390]) {
  test(`chooser layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("navigation", { name: "Choose an app" }).getByRole("link"),
    ).toHaveCount(3);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(
      page.locator(".chooser-preview img.is-visible"),
    ).toHaveJSProperty("complete", true);
    await page.screenshot({
      path: `test-results/chooser-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("unknown app falls back to chooser and reduced motion keeps choices visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?app=unknown");
  await expect(
    page.getByRole("link", { name: "Customer", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".chooser-intro h1")).toHaveCSS(
    "animation-name",
    "none",
  );
});
