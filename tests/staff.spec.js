import { test, expect } from "@playwright/test";
const screen = (page) => page.locator(".screen");
const nav = (page, name) =>
  page
    .getByRole("navigation", { name: "Navigasi staf" })
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
  await screen(page)
    .getByRole("button", { name: /Drestayumna Nurmareko/ })
    .click();
  await expect(screen(page)).toContainText("CS-1042");
  await expect(screen(page)).toContainText("09:28");
  await screen(page)
    .getByRole("button", { name: "Mulai layanan", exact: true })
    .click();
  await confirm(page, "Kembali");
  await expect(
    screen(page).getByRole("button", { name: "Mulai layanan", exact: true }),
  ).toBeEnabled();
  await screen(page)
    .getByRole("button", { name: "Mulai layanan", exact: true })
    .click();
  await confirm(page, "Ya, mulai layanan");
  await expect(screen(page)).toContainText("Sedang dilayani");
  await screen(page)
    .getByRole("button", { name: "Selesaikan layanan", exact: true })
    .click();
  await confirm(page, "Ya, selesaikan layanan");
  await screen(page).getByRole("button", { name: "Kembali ke agenda" }).click();
  await expect(
    screen(page).getByRole("button", { name: /Drestayumna Nurmareko/ }),
  ).toContainText("Selesai");
  expect(errors).toEqual([]);
});

test("scheduled appointment cannot start until demo Front Desk check-in", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await screen(page)
    .getByRole("button", { name: /Bima Pratama/ })
    .click();
  await expect(
    screen(page).getByRole("button", { name: "Mulai layanan", exact: true }),
  ).toBeDisabled();
  await page.getByText("Kontrol skenario prototype", { exact: true }).click();
  await screen(page)
    .getByRole("button", { name: "Simulasikan kedatangan" })
    .click();
  await expect(
    screen(page).getByRole("button", { name: "Mulai layanan", exact: true }),
  ).toBeEnabled();
});

test("availability save persists without canceling existing appointments", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await nav(page, "Ketersediaan");
  const save = screen(page).getByRole("button", { name: "Simpan perubahan" });
  await expect(save).toBeDisabled();
  await page.locator("wired-toggle").click();
  await save.click();
  await expect(page.getByRole("status")).toContainText("berhasil disimpan");
  await expect(save).toBeDisabled();
  await nav(page, "Agenda");
  await expect(page.locator(".staff-appointment")).toHaveCount(3);
  await nav(page, "Ketersediaan");
  await expect(page.locator("wired-toggle input")).not.toBeChecked();
  await page.locator("wired-toggle").click();
  await nav(page, "Profil");
  await expect(page.getByRole("dialog")).toContainText("Abaikan perubahan");
  await confirm(page, "Kembali");
  await expect(page.locator("#staff-availability")).toBeVisible();
  await nav(page, "Agenda");
  await confirm(page, "Abaikan & lanjutkan");
  await nav(page, "Ketersediaan");
  await expect(page.locator("wired-toggle input")).not.toBeChecked();
});

test("date selection gives empty state and read-only schedule", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page
    .getByRole("button", { name: "Sab, 10 Oktober", exact: true })
    .click();
  await expect(screen(page)).toContainText("Agenda masih kosong");
  await nav(page, "Ketersediaan");
  await expect(page.locator("wired-toggle")).toHaveJSProperty("disabled", true);
  await expect(
    screen(page).getByRole("button", { name: "Simpan perubahan" }),
  ).toBeDisabled();
  await nav(page, "Agenda");
  await screen(page)
    .getByRole("button", { name: "Hari ini", exact: true })
    .click();
  await expect(page.locator(".staff-appointment")).toHaveCount(3);
});

test("profile is read-only and sign-out blocks navigation until demo sign-in", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await nav(page, "Profil");
  await expect(screen(page)).toContainText("STF-004");
  await expect(screen(page).locator("wired-input")).toHaveCount(0);
  await screen(page)
    .getByRole("button", { name: "Keluar", exact: true })
    .click();
  await confirm(page, "Ya, keluar");
  await expect(page.locator("#staff-signedout")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigasi staf" }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Staff prototype screens" })
      .getByRole("button", { name: "Agenda", exact: true }),
  ).toBeDisabled();
  await screen(page)
    .getByRole("button", { name: "Masuk sebagai Esta" })
    .click();
  await expect(page.locator("#staff-agenda")).toBeVisible();
});

test("staff mobile screens fit, navigation works, and desktop screenshot renders", async ({
  page,
}) => {
  await page.goto("/?app=staff");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "test-results/staff-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator(".sidebar")).toBeHidden();
  for (const label of ["Agenda", "Ketersediaan", "Profil"]) {
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
