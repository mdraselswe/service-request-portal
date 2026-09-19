import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@assunnah.org");
  await page.getByLabel("Password", { exact: true }).fill("Portal@123");
  await page.getByRole("button", { name: "Sign in to the portal" }).click();
  await expect(page).toHaveURL("/", { timeout: 30_000 });
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("restores filtered, sorted, and paginated state from the URL", async ({
  page,
}) => {
  await page.goto(
    "/requests?status=OPEN&priority=URGENT&pageSize=10&sort=requestNumber&order=asc&page=2",
  );

  await expect(page.getByRole("heading", { name: "Service requests" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open", pressed: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Urgent", pressed: true })).toBeVisible();
  await expect(page.getByLabel("Rows")).toHaveValue("10");
  await expect(page.getByLabel("Sort requests")).toHaveValue("requestNumber:asc");
  await expect(page.getByText(/Page 2 of/)).toBeVisible();
  await expect(page).toHaveURL(/status=OPEN/);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("debounces search and preserves a shareable URL", async ({ page }) => {
  await page.goto("/requests");
  const search = page.getByRole("searchbox", { name: "Search requests" });
  await search.fill("payroll portal");

  await expect(page).toHaveURL(/q=payroll\+portal/, { timeout: 10_000 });
  await expect(
    page
      .locator("article:visible, tbody tr:visible")
      .filter({ hasText: "Unable to access the payroll portal" })
      .first(),
  ).toBeVisible();

  await page.getByLabel("Filter by assignee").selectOption("unassigned");
  await expect(page).toHaveURL(/assignee=unassigned/);
  await expect(page.getByText(/active filters/)).toBeVisible();
});
