import { test, expect } from "@playwright/test";

for (const app of ["customer", "manager", "staff"]) {
  test(`${app} review shell supports keyboard skip navigation`, async ({
    page,
  }) => {
    await page.goto(`/?app=${app}`);
    await expect(page.locator(".screen")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("body")).not.toContainText(/\bdemo\b/i);
    await expect(page.locator('.screen a[href^="?app="]')).toHaveCount(0);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to app" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".screen")).toBeFocused();
    await expect(
      page.locator(
        ".handnote, .sidebar-intro, .journey, .annotations, .canvas-footer, .workspace-label",
      ),
    ).toHaveCount(0);
  });
}

test("staff secondary date picker remains operable after collapsing it", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  const picker = page.locator(".staff-date-picker");
  await expect(picker.locator("wired-input")).toBeHidden();
  await picker.locator("summary").click();
  await picker.locator("input").fill("2026-10-10");
  await expect(page.locator(".screen")).toContainText("No appointments");
});
