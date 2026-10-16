import { test, expect } from "@playwright/test";
const body = (p) => p.locator(".screen");
const nav = (p, name) =>
  p
    .getByRole("navigation", { name: "Manager navigation" })
    .getByRole("button", { name, exact: true })
    .click();
async function manage(p, name) {
  await nav(p, "Manage");
  await body(p).getByRole("button", { name }).click();
}
async function editService(p) {
  await manage(p, /^Services/);
  await body(p)
    .getByRole("button", { name: "Edit service", exact: true })
    .first()
    .click();
}
const field = (p, label) =>
  p.locator(`wired-input[aria-label="${label}"] input`);
async function select(p, label, text) {
  await p.locator(`wired-combo[aria-label="${label}"]`).click();
  await p
    .locator(`wired-combo[aria-label="${label}"] wired-item`)
    .filter({ hasText: text })
    .click();
}

test("manager check-in updates reservation and timeline through completion", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?app=manager");
  await body(page)
    .getByRole("button", { name: "Confirm arrival", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Yes, confirm arrival" })
    .click();
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Arrived",
  );
  await body(page)
    .getByRole("button", { name: "View reservation details" })
    .click();
  await expect(body(page)).toContainText("Arrival confirmed");
  await body(page)
    .getByRole("button", { name: "Start service", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await body(page)
    .getByRole("button", { name: "Complete service", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(body(page)).toContainText("Service completed");
  await manage(page, /^Activity history/);
  await expect(body(page)).toContainText("CS-1045");
  expect(errors).toEqual([]);
});

test("search and reservation filters handle results and empty states", async ({
  page,
}) => {
  await page.goto("/?app=manager");
  await field(page, "Booking code").fill("missing");
  await body(page).getByRole("button", { name: "Search", exact: true }).click();
  await expect(body(page)).toContainText("Reservation not found");
  await nav(page, "Reservations");
  await select(page, "Staff", "Adi");
  await expect(body(page).locator(".manager-reservation")).toHaveCount(1);
  await expect(body(page)).toContainText("Raka Pradana");
  await select(page, "Status", "Completed");
  await expect(body(page)).toContainText("No reservations");
  await body(page).getByRole("button", { name: "Reset filters" }).click();
  await expect(body(page).locator(".manager-reservation")).toHaveCount(5);
  await field(page, "Reservation date").fill("2026-10-10");
  await expect(body(page)).toContainText("No reservations");
});

test("business and service editors save without mutating reservation snapshots", async ({
  page,
}) => {
  await page.goto("/?app=manager");
  await manage(page, /^Business profile/);
  await field(page, "Business name").fill("Care Space Kemang Demo");
  await body(page).getByRole("button", { name: "Save changes" }).click();
  await expect(body(page)).toContainText("Care Space Kemang Demo");
  await editService(page);
  await field(page, "Duration (min)").fill("0");
  await body(page).getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await field(page, "Duration (min)").fill("60");
  await field(page, "Service price (Rp)").fill("250000");
  await page.locator("wired-checkbox").filter({ hasText: "Adi" }).click();
  await page.locator('wired-toggle[aria-label="Service active"]').click();
  await body(page).getByRole("button", { name: "Save changes" }).click();
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Rp250,000",
  );
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Inactive",
  );
  await nav(page, "Reservations");
  await body(page).getByRole("button", { name: /Nadia/ }).click();
  await expect(body(page)).toContainText("Rp230,000");
  await expect(body(page)).toContainText("45 min");
  await editService(page);
  await expect(field(page, "Duration (min)")).toHaveValue("60");
  await expect(
    page.locator("wired-checkbox").filter({ hasText: "Adi" }).locator("input"),
  ).not.toBeChecked();
});

test("all manager screens render and shift validation persists saved data", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?app=manager");
  for (const label of ["Front Desk", "Reservations", "Manage"]) {
    await nav(page, label);
    await expect(body(page).locator("h1")).not.toBeEmpty();
  }
  await nav(page, "Reservations");
  await body(page).getByRole("button", { name: /Nadia/ }).click();
  await expect(body(page)).toContainText("Rp230,000");
  for (const label of [
    /^Business profile/,
    /^Services/,
    /^Business hours/,
    /^Staff Profiles/,
    /^Staff schedule/,
    /^Activity history/,
  ]) {
    await manage(page, label);
    await expect(body(page).locator("h1")).not.toBeEmpty();
  }
  await editService(page);
  await expect(field(page, "Duration (min)")).toBeVisible();
  await manage(page, /^Staff schedule/);
  await field(page, "Shift end").fill("08:00");
  await body(page).getByRole("button", { name: "Save schedule" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await field(page, "Shift end").fill("19:00");
  await body(page).getByRole("button", { name: "Save schedule" }).click();
  await select(page, "Selected staff", "Dee");
  await select(page, "Selected staff", "Esta");
  await expect(field(page, "Shift end")).toHaveValue("19:00");
  expect(errors).toEqual([]);
});

test("manager mobile fits and bottom navigation is usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?app=manager");
  await expect(page.locator(".manager-hero h1")).toHaveText("Front Desk");
  await expect(
    page.getByRole("link", { name: "All apps", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Screen menu", exact: true })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("navigation", { name: "Screen navigation" })).toBeHidden();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page
    .getByRole("navigation", { name: "Manager navigation" })
    .getByRole("button", { name: "Manage", exact: true })
    .click();
  await body(page)
    .getByRole("button", { name: /Business profile/ })
    .click();
  await expect(field(page, "Business name")).toBeVisible();
  await page.screenshot({
    path: "test-results/manager-mobile.png",
    fullPage: true,
  });
});

test("manager desktop visual capture and customer switch", async ({ page }) => {
  await page.goto("/?app=manager");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/manager-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "All apps", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Customer", exact: true }).click();
  await expect(page).toHaveURL("/?app=customer");
  await expect(page.locator("#screen-home")).toBeVisible();
});
