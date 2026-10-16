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
    await expect(link).toBeFocused();
    await expect(link).toHaveAttribute("href", `?app=${id}`);
    await expect(link.locator("wired-card")).toBeVisible();
    await link.press("Enter");
    await expect(page).toHaveURL(new RegExp(`app=${id}`));
    await expect(page.locator(".screen")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Screen navigation" })).toBeVisible();
    await expect(page.locator('a[href^="?app="]')).toHaveCount(0);
    await page.getByRole("link", { name: "All apps", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Choose an app" }),
    ).toBeVisible();
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
    await expect(page.locator(".chooser-preview, .app-chooser img")).toHaveCount(0);
    await expect(page.locator(".chooser-options wired-card")).toHaveCount(3);
    for (const name of ["Customer", "Manager", "Staff"]) {
      await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
    }
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
