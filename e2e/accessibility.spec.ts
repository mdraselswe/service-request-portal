import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations,
    results.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
}

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@assunnah.org");
  await page.getByLabel("Password", { exact: true }).fill("Portal@123");
  await page.getByRole("button", { name: "Sign in to the portal" }).click();
  await expect(page).toHaveURL("/", { timeout: 30_000 });
}

test("login page has no detectable WCAG A or AA violations", async ({ page }) => {
  await page.goto("/login");
  await expectNoAccessibilityViolations(page);
});

test("protected dashboard, request list, and details pass accessibility scans", async ({
  page,
}) => {
  await signIn(page);
  await expectNoAccessibilityViolations(page);

  await page.goto("/requests?status=OPEN&pageSize=10");
  await expect(page.getByRole("heading", { name: "Service requests" })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.goto("/requests/SR-10020");
  await expect(page.getByRole("heading", { name: "Activity history" })).toBeVisible();
  await expectNoAccessibilityViolations(page);
});
