import { test, expect } from "@playwright/test";
const body = (p) => p.locator(".screen");
const jump = (p, name) =>
  p
    .getByRole("navigation", { name: "Manager prototype screens" })
    .getByRole("button", { name, exact: true })
    .click();
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
    .getByRole("button", { name: "Konfirmasi kedatangan", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Ya, sudah datang" })
    .click();
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Sudah datang",
  );
  await body(page)
    .getByRole("button", { name: "Lihat detail reservasi" })
    .click();
  await expect(body(page)).toContainText("Kedatangan dikonfirmasi");
  await body(page)
    .getByRole("button", { name: "Mulai pelayanan", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Konfirmasi", exact: true })
    .click();
  await body(page)
    .getByRole("button", { name: "Selesaikan pelayanan", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Konfirmasi", exact: true })
    .click();
  await expect(body(page)).toContainText("Pelayanan diselesaikan");
  await jump(page, "Riwayat aktivitas");
  await expect(body(page)).toContainText("CS-1045");
  expect(errors).toEqual([]);
});

test("search and reservation filters handle results and empty states", async ({
  page,
}) => {
  await page.goto("/?app=manager");
  await field(page, "Kode pemesanan").fill("missing");
  await body(page).getByRole("button", { name: "Cari", exact: true }).click();
  await expect(body(page)).toContainText("Reservasi tidak ditemukan");
  await jump(page, "Reservasi");
  await select(page, "Staf", "Adi");
  await expect(body(page).locator(".manager-reservation")).toHaveCount(1);
  await expect(body(page)).toContainText("Raka Pradana");
  await select(page, "Status", "Selesai");
  await expect(body(page)).toContainText("Tidak ada reservasi");
  await body(page).getByRole("button", { name: "Reset filter" }).click();
  await expect(body(page).locator(".manager-reservation")).toHaveCount(5);
  await field(page, "Tanggal reservasi").fill("2026-10-10");
  await expect(body(page)).toContainText("Tidak ada reservasi");
});

test("business and service editors save without mutating reservation snapshots", async ({
  page,
}) => {
  await page.goto("/?app=manager");
  await jump(page, "Profil usaha");
  await field(page, "Nama tempat usaha").fill("Care Space Kemang Demo");
  await body(page).getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(body(page)).toContainText("Care Space Kemang Demo");
  await jump(page, "Ubah layanan");
  await field(page, "Durasi (menit)").fill("0");
  await body(page).getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await field(page, "Durasi (menit)").fill("60");
  await field(page, "Harga layanan (Rp)").fill("250000");
  await page.locator("wired-checkbox").filter({ hasText: "Adi" }).click();
  await page.locator('wired-toggle[aria-label="Layanan aktif"]').click();
  await body(page).getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Rp250.000",
  );
  await expect(body(page).locator("wired-card").first()).toContainText(
    "Nonaktif",
  );
  await jump(page, "Detail reservasi");
  await expect(body(page)).toContainText("Rp230.000");
  await expect(body(page)).toContainText("45 menit");
  await jump(page, "Ubah layanan");
  await expect(field(page, "Durasi (menit)")).toHaveValue("60");
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
  const labels = await page
    .getByRole("navigation", { name: "Manager prototype screens" })
    .getByRole("button")
    .allTextContents();
  for (const label of labels) {
    await jump(page, label.trim());
    await expect(body(page).locator("h1")).not.toBeEmpty();
  }
  await jump(page, "Jadwal staf");
  await field(page, "Selesai kerja").fill("08:00");
  await body(page).getByRole("button", { name: "Simpan jadwal" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await field(page, "Selesai kerja").fill("19:00");
  await body(page).getByRole("button", { name: "Simpan jadwal" }).click();
  await select(page, "Staf terpilih", "Dee");
  await select(page, "Staf terpilih", "Esta");
  await expect(field(page, "Selesai kerja")).toHaveValue("19:00");
  expect(errors).toEqual([]);
});

test("manager mobile fits and bottom navigation is usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?app=manager");
  await expect(page.locator(".manager-hero h1")).toHaveText("Front Desk");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page
    .getByRole("navigation", { name: "Navigasi manajer" })
    .getByRole("button", { name: "Kelola", exact: true })
    .click();
  await body(page)
    .getByRole("button", { name: /Profil tempat usaha/ })
    .click();
  await expect(field(page, "Nama tempat usaha")).toBeVisible();
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
  await page.getByRole("link", { name: "Customer app", exact: true }).click();
  await expect(page.locator("#screen-home")).toBeVisible();
});
