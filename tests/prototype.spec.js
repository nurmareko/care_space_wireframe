import { test, expect } from "@playwright/test";
const screen = (page) => page.locator(".screen");
const nav = (page, name) =>
  page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name, exact: true })
    .click();

async function backToNav(page) {
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  for (let depth = 0; depth < 10 && !(await navigation.isVisible()); depth++) {
    await page.getByRole("button", { name: "Back", exact: true }).click();
  }
  await expect(navigation).toBeVisible();
}

test("guest can discover, sign in, book, and cancel", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?app=customer");
  await screen(page)
    .getByRole("button", { name: "Book", exact: true })
    .click();
  await screen(page)
    .getByRole("button", { name: "Book +", exact: true })
    .first()
    .click();
  await screen(page).getByRole("button", { name: /Esta/ }).click();
  await screen(page)
    .getByRole("button", { name: "19:00", exact: true })
    .click();
  await screen(page)
    .getByRole("button", { name: "Add to booking" })
    .click();
  await page
    .locator("wired-textarea textarea")
    .fill("Keep the sides short.");
  await screen(page)
    .getByRole("button", { name: "Sign in & save" })
    .click();
  await page.locator("wired-input input").fill("123");
  await screen(page)
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("valid");
  await page.locator("wired-input input").fill("82110778883");
  await screen(page)
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await page.locator("wired-input input").fill("000000");
  await screen(page)
    .getByRole("button", { name: "Verify & continue" })
    .click();
  await expect(page.getByRole("alert")).toContainText("Incorrect code");
  await page.locator("wired-input input").fill("123456");
  await screen(page)
    .getByRole("button", { name: "Verify & continue" })
    .click();
  await expect(screen(page)).toContainText("Keep the sides short.");
  await screen(page)
    .getByRole("button", { name: "Save appointment" })
    .click();
  await expect(screen(page)).toContainText("CS0001");
  await screen(page)
    .getByRole("button", { name: "View appointment details" })
    .click();
  await screen(page)
    .getByRole("button", { name: "Cancel appointment" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Yes, cancel" })
    .click();
  await expect(screen(page)).toContainText("Canceled");
  expect(errors).toEqual([]);
});

test("search, favorites, available times, and support controls work", async ({
  page,
}) => {
  await page.goto("/?app=customer");
  await screen(page)
    .getByRole("button", { name: "Search barbers, salons, services..." })
    .click();
  await page.locator("wired-search-input input").fill("menteng");
  await expect(screen(page).locator(".result")).toHaveCount(1);
  await screen(page)
    .getByRole("button", { name: /Di Bawah Pohon Barber & Shop Menteng/ })
    .click();
  await screen(page).getByRole("button", { name: "Save outlet" }).click();
  await backToNav(page);
  await nav(page, "Favorites");
  await expect(screen(page)).toContainText("Menteng");
  await screen(page)
    .getByRole("button", {
      name: "Di Bawah Pohon Barber & Shop Menteng",
      exact: true,
    })
    .click();
  await screen(page)
    .getByRole("button", { name: "Book +", exact: true })
    .first()
    .click();
  await screen(page).getByRole("button", { name: /Esta/ }).click();
  await expect(screen(page).getByRole("button", { name: "15:00", exact: true })).toBeDisabled();
  await screen(page).locator(".date-grid button").nth(1).click();
  await expect(screen(page).getByRole("button", { name: "Add to booking" })).toBeDisabled();
  await screen(page).getByRole("button", { name: "19:00", exact: true }).click();
  await screen(page).getByRole("button", { name: "Add to booking" }).click();
  await expect(screen(page)).toContainText("Starts at 19:00");
  await backToNav(page);
  await nav(page, "Profile");
  await screen(page)
    .getByRole("button", { name: "Contact us", exact: true })
    .click();
  await expect(
    screen(page).getByRole("button", { name: "Save request", exact: true }),
  ).toBeDisabled();
  await page.locator("wired-radio").filter({ hasText: "Verification code issue" }).click();
  await screen(page)
    .getByRole("button", { name: "Save request", exact: true })
    .click();
  await expect(screen(page)).toContainText("Request saved");
});

test("native onboarding, rewards, and profile changes work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?app=customer");
  await expect(page.locator("#screen-home")).toBeVisible();
  for (const label of ["Favorites", "Appointments", "Profile"]) {
    await nav(page, label);
    await expect(page.locator(".app-header h1")).not.toBeEmpty();
  }
  await screen(page).getByRole("button", { name: "Sign in or register" }).click();
  await page.locator("wired-input input").fill("82110778883");
  await screen(page)
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await page.locator("wired-input input").fill("123456");
  await screen(page)
    .getByRole("button", { name: "Verify & continue" })
    .click();
  await screen(page)
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await expect(
    screen(page).getByRole("button", { name: "Continue with phone number" }),
  ).toBeVisible();
  await screen(page)
    .getByRole("button", { name: "Browse as a guest" })
    .click();
  await expect(page.locator("#screen-home")).toBeVisible();
  await nav(page, "Profile");
  await expect(screen(page)).toContainText("You are browsing as a guest");
  await screen(page).getByRole("button", { name: "Sign in or register" }).click();
  await screen(page)
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await page.locator("wired-input input").fill("123456");
  await screen(page)
    .getByRole("button", { name: "Verify & continue" })
    .click();
  await screen(page)
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await screen(page).getByRole("button", { name: "Continue with phone number" }).click();
  await screen(page).getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("wired-input input").fill("123456");
  await screen(page).getByRole("button", { name: "Verify & continue" }).click();
  await nav(page, "Profile");
  await screen(page)
    .getByRole("button", { name: /^Reward/ })
    .click();
  await expect(screen(page)).toContainText("300");
  await backToNav(page);
  await nav(page, "Profile");
  await screen(page)
    .getByRole("button", { name: "Edit profile", exact: true })
    .click();
  await page.locator("wired-input").first().locator("input").fill("Sheena");
  await screen(page).getByRole("button", { name: "Save changes" }).click();
  await expect(screen(page)).toContainText("Sheena Nurmareko");
  await screen(page)
    .getByRole("button", { name: /^Language/ })
    .click();
  await expect(screen(page)).toContainText("The app is currently available in English.");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await backToNav(page);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("button", { name: "Home", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile viewport stays within screen and navigation works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?app=customer");
  await expect(page.locator(".sidebar")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "All apps", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await expect(screen(page)).toContainText("You are browsing as a guest");
  await page.screenshot({
    path: "test-results/mobile-profile.png",
    fullPage: true,
  });
});

test("desktop home visual capture", async ({ page }) => {
  await page.goto("/?app=customer");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/desktop-home.png",
    fullPage: true,
  });
});
