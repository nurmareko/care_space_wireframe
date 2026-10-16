import { test, expect } from "@playwright/test";
const screen = (page) => page.locator(".screen");
const nav = (page, name) =>
  page
    .getByRole("navigation", { name: "Staff navigation" })
    .getByRole("button", { name, exact: true })
    .click();
const confirm = (page, name) =>
  page.getByRole("dialog").getByRole("button", { name, exact: true }).click();

test("staff starts and completes checked-in service and agenda reflects status", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await screen(page)
    .getByRole("button", { name: /Drestayumna Nurmareko/ })
    .click();
  await expect(screen(page)).toContainText("CS-1042");
  await expect(screen(page)).toContainText("09:28");
  await screen(page)
    .getByRole("button", { name: "Start service", exact: true })
    .click();
  await confirm(page, "Back");
  await expect(
    screen(page).getByRole("button", { name: "Start service", exact: true }),
  ).toBeEnabled();
  await screen(page)
    .getByRole("button", { name: "Start service", exact: true })
    .click();
  await confirm(page, "Yes, start service");
  await expect(screen(page)).toContainText("In progress");
  await screen(page)
    .getByRole("button", { name: "Complete service", exact: true })
    .click();
  await confirm(page, "Yes, complete service");
  await screen(page).getByRole("button", { name: "Back to agenda" }).click();
  await expect(
    screen(page).getByRole("button", { name: /Drestayumna Nurmareko/ }),
  ).toContainText("Completed");
  expect(errors).toEqual([]);
});

test("scheduled appointment waits for Front Desk while checked-in appointments can start", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await screen(page)
    .getByRole("button", { name: /Bima Pratama/ })
    .click();
  await expect(
    screen(page).getByRole("button", { name: "Start service", exact: true }),
  ).toBeDisabled();
  await expect(screen(page)).toContainText("Waiting for Front Desk to confirm arrival.");
  await screen(page).getByRole("button", { name: "Back to agenda" }).click();
  await expect(screen(page).getByRole("button", { name: /Bima Pratama/ })).toContainText("Scheduled");
  await screen(page).getByRole("button", { name: /Drestayumna Nurmareko/ }).click();
  await expect(screen(page).getByRole("button", { name: "Start service", exact: true })).toBeEnabled();

});

test("availability save persists without canceling existing appointments", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await nav(page, "Availability");
  const save = screen(page).getByRole("button", { name: "Save changes" });
  await expect(save).toBeDisabled();
  await page.locator("wired-toggle").click();
  await save.click();
  await expect(page.getByRole("status")).toContainText("Availability saved.");
  await expect(save).toBeDisabled();
  await nav(page, "Agenda");
  await expect(page.locator(".staff-appointment")).toHaveCount(3);
  await nav(page, "Availability");
  await expect(page.locator("wired-toggle input")).not.toBeChecked();
  await page.locator("wired-toggle").click();
  await nav(page, "Profile");
  await expect(page.getByRole("dialog")).toContainText("Discard changes");
  await confirm(page, "Back");
  await expect(page.locator("#staff-availability")).toBeVisible();
  await nav(page, "Agenda");
  await confirm(page, "Discard & continue");
  await nav(page, "Availability");
  await expect(page.locator("wired-toggle input")).not.toBeChecked();
});

test("date selection gives empty state and read-only schedule", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await page
    .getByRole("button", { name: "Sat, 10 October", exact: true })
    .click();
  await expect(screen(page)).toContainText("No appointments");
  await nav(page, "Availability");
  await expect(page.locator("wired-toggle")).toHaveJSProperty("disabled", true);
  await expect(
    screen(page).getByRole("button", { name: "Save changes" }),
  ).toBeDisabled();
  await nav(page, "Agenda");
  await screen(page)
    .getByRole("button", { name: "Today", exact: true })
    .click();
  await expect(page.locator(".staff-appointment")).toHaveCount(3);
});

test("profile is read-only and sign-out blocks navigation until sign-in", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await nav(page, "Profile");
  await expect(screen(page)).toContainText("STF-004");
  await expect(screen(page).locator("wired-input")).toHaveCount(0);
  await screen(page)
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await confirm(page, "Yes, sign out");
  await expect(page.locator("#staff-signedout")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Staff navigation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "All apps", exact: true }),
  ).toBeVisible();
  await screen(page)
    .getByRole("button", { name: "Sign in as Esta" })
    .click();
  await expect(page.locator("#staff-agenda")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Staff navigation" }),
  ).toBeVisible();
});

test("staff mobile screens fit, navigation works, and desktop screenshot renders", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.locator(".screen").getByRole("button", { name: "View my agenda", exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/staff-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole("button", { name: "Screen menu", exact: true })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("navigation", { name: "Screen navigation" })).toBeHidden();
  await page.locator(".screen-menu-toggle").click();
  await expect(
    page.getByRole("link", { name: "All apps", exact: true }),
  ).toBeVisible();
  await page.locator(".screen-menu-toggle").click();
  for (const label of ["Agenda", "Availability", "Profile"]) {
    await nav(page, label);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(375);
  }
  await nav(page, "Agenda");
  await page.screenshot({
    path: "test-results/staff-mobile.png",
    fullPage: true,
  });
});
