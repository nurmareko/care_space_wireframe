import { test, expect } from "@playwright/test";
const screen = (page) => page.locator(".screen");
const jump = (page, name) =>
  page
    .getByRole("navigation", { name: "Prototype screens" })
    .getByRole("button", { name, exact: true })
    .click();

test("guest can discover, sign in, book, and cancel", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await screen(page)
    .getByRole("button", { name: "Pesan", exact: true })
    .click();
  await screen(page)
    .getByRole("button", { name: "Pesan +", exact: true })
    .first()
    .click();
  await screen(page).getByRole("button", { name: /Esta/ }).click();
  await screen(page)
    .getByRole("button", { name: "19:00", exact: true })
    .click();
  await screen(page)
    .getByRole("button", { name: "Tambahkan ke keranjang" })
    .click();
  await page
    .locator("wired-textarea textarea")
    .fill("Potong pendek di samping.");
  await screen(page)
    .getByRole("button", { name: "Masuk & konfirmasi" })
    .click();
  await page.locator("wired-input input").fill("123");
  await screen(page)
    .getByRole("button", { name: "Lanjutkan", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("valid");
  await page.locator("wired-input input").fill("82110778883");
  await screen(page)
    .getByRole("button", { name: "Lanjutkan", exact: true })
    .click();
  await page.locator("wired-input input").fill("000000");
  await screen(page)
    .getByRole("button", { name: "Verifikasi & lanjutkan" })
    .click();
  await expect(page.getByRole("alert")).toContainText("Kode tidak cocok");
  await page.locator("wired-input input").fill("123456");
  await screen(page)
    .getByRole("button", { name: "Verifikasi & lanjutkan" })
    .click();
  await expect(screen(page)).toContainText("Potong pendek di samping.");
  await screen(page)
    .getByRole("button", { name: "Konfirmasi pemesanan" })
    .click();
  await expect(screen(page)).toContainText("CS0001");
  await screen(page)
    .getByRole("button", { name: "Lihat detail janji temu" })
    .click();
  await screen(page)
    .getByRole("button", { name: "Batalkan janji temu" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Ya, batalkan" })
    .click();
  await expect(screen(page)).toContainText("Dibatalkan");
  expect(errors).toEqual([]);
});

test("search, favorites, fully booked state, and support controls work", async ({
  page,
}) => {
  await page.goto("/");
  await jump(page, "Search & outlets");
  await page.locator("wired-search-input input").fill("menteng");
  await expect(screen(page).locator(".result")).toHaveCount(1);
  await screen(page)
    .getByRole("button", { name: /Di Bawah Pohon Barber & Shop Menteng/ })
    .click();
  await screen(page).getByRole("button", { name: "Simpan outlet" }).click();
  await jump(page, "Favorites");
  await expect(screen(page)).toContainText("Menteng");
  await jump(page, "Choose stylist");
  await page.locator("wired-toggle").click();
  await expect(
    screen(page).getByRole("button", { name: /Esta/ }),
  ).toBeDisabled();
  await page.locator("wired-toggle").click();
  await expect(
    screen(page).getByRole("button", { name: /Esta/ }),
  ).toBeEnabled();
  await jump(page, "Contact support");
  await expect(
    screen(page).getByRole("button", { name: "Kirim", exact: true }),
  ).toBeDisabled();
  await page.locator("wired-radio").filter({ hasText: "Masalah OTP" }).click();
  await screen(page)
    .getByRole("button", { name: "Kirim", exact: true })
    .click();
  await expect(screen(page)).toContainText("Pesan diterima");
});

test("all screens render and profile changes are reflected", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const labels = await page
    .getByRole("navigation", { name: "Prototype screens" })
    .getByRole("button")
    .allTextContents();
  for (const label of labels) {
    await jump(page, label.trim());
    await expect(page.locator(".app-header h1")).not.toBeEmpty();
  }
  await jump(page, "Welcome");
  await screen(page)
    .getByRole("button", { name: "Lanjut dengan Google" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Lanjutkan akun demo" })
    .click();
  await jump(page, "Edit profile");
  await page.locator("wired-input").first().locator("input").fill("Sheena");
  await screen(page).getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(screen(page)).toContainText("Sheena Nurmareko");
  await jump(page, "Language");
  await screen(page).getByRole("button", { name: "EN English" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Navigasi utama" })
      .getByRole("button", { name: "Home", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile viewport stays within screen and navigation works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.locator(".sidebar")).toBeHidden();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page
    .getByRole("navigation", { name: "Navigasi utama" })
    .getByRole("button", { name: "Profil", exact: true })
    .click();
  await expect(screen(page)).toContainText("Kamu masuk sebagai tamu");
  await page.screenshot({
    path: "test-results/mobile-profile.png",
    fullPage: true,
  });
});

test("desktop home visual capture", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/desktop-home.png",
    fullPage: true,
  });
});
