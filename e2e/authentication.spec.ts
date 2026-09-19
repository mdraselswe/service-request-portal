import { expect, test } from "@playwright/test";

test("protects the portal, signs in, exposes the session, and signs out", async ({
  page,
}) => {
  const anonymousSession = await page.request.get("/api/session");
  expect(anonymousSession.status()).toBe(401);

  await page.goto("/");
  await expect(page).toHaveURL(/\/login\?returnTo=%2F$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await page.getByLabel("Email address").fill("admin@assunnah.org");
  await page.getByLabel("Password", { exact: true }).fill("Portal@123");
  await page.getByRole("button", { name: "Sign in to the portal" }).click();

  await expect(page).toHaveURL("/", { timeout: 30_000 });
  await expect(
    page.getByRole("heading", { name: "Service request workspace" }),
  ).toBeVisible();
  await expect(page.getByText("Open requests", { exact: true })).toBeVisible();

  const authenticatedSession = await page.request.get("/api/session");
  expect(authenticatedSession.status()).toBe(200);
  await expect(authenticatedSession.json()).resolves.toMatchObject({
    ok: true,
    data: { user: { email: "admin@assunnah.org", role: "ADMIN" } },
  });

  await page.getByLabel("Open account menu").click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/login");
});

test("shows a safe generic error for invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@assunnah.org");
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Sign in to the portal" }).click();

  await expect(
    page.getByText("The email or password is incorrect.", { exact: true }),
  ).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL("/login");
});
