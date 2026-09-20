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
  await expect(search).toHaveAttribute("data-hydrated", "true");
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

test("sorts priorities in business order", async ({ page }) => {
  await page.goto("/requests?sort=priority&order=desc&pageSize=10");

  await expect(page.getByRole("heading", { name: "Service requests" })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByLabel("Sort requests")).toHaveValue("priority:desc");
  const resultItems = page.locator("[data-priority]:visible");
  await expect(resultItems).toHaveCount(10);
  const priorities = await resultItems.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-priority")),
    );
  expect(priorities).toHaveLength(10);
  expect(new Set(priorities)).toEqual(new Set(["URGENT"]));
});

test("uses a content-appropriate result layout at each breakpoint", async ({
  page,
}) => {
  await page.goto("/requests?pageSize=10");
  await expect(page.getByRole("heading", { name: "Service requests" })).toBeVisible();

  const viewportWidth = page.viewportSize()?.width ?? 1280;
  const table = page.getByRole("table");
  const visibleCards = page.locator("article[data-priority]:visible");

  if (viewportWidth < 1024) {
    await expect(table).toBeHidden();
    await expect(visibleCards).toHaveCount(10);
  } else {
    await expect(table).toBeVisible();
    await expect(visibleCards).toHaveCount(0);
  }

  const faviconHref = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(faviconHref).toContain("icon.svg");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  await page.getByRole("link", { name: "Last page" }).click();
  await expect(page).toHaveURL(/page=1005/);
  await expect(page.getByText("Page 1005 of 1005")).toBeVisible();

  await page.getByRole("link", { name: "First page" }).click();
  await expect(page).not.toHaveURL(/page=/);
  await expect(page.getByText("Page 1 of 1005")).toBeVisible();
});
