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
  const mobileFilters = (page.viewportSize()?.width ?? 1280) < 768;
  if (mobileFilters) {
    await page.getByRole("button", { name: /Filters/ }).click();
    await expect(page.getByRole("dialog", { name: "Filter requests" })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Open", pressed: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Urgent", pressed: true })).toBeVisible();
  if (mobileFilters) {
    await page.getByRole("button", { name: "View results" }).click();
    await expect(page.getByRole("dialog", { name: "Filter requests" })).toBeHidden();
  }
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
  const mobileFilters = (page.viewportSize()?.width ?? 1280) < 768;
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

  if (mobileFilters) {
    await page.getByRole("button", { name: /Filters/ }).click();
    await page
      .getByRole("dialog", { name: "Filter requests" })
      .getByLabel("Assignee", { exact: true })
      .selectOption("unassigned");
  } else {
    await page.getByLabel("Filter by assignee").selectOption("unassigned");
  }
  await expect(page).toHaveURL(/assignee=unassigned/);
  const activeFilterSummary = mobileFilters
    ? page.getByRole("dialog", { name: "Filter requests" }).getByText(/1 active filter/)
    : page.getByRole("region", { name: "Request search and filters" }).getByText(/1 active filter/);
  await expect(activeFilterSummary).toBeVisible();

  if (mobileFilters) {
    await page.getByRole("button", { name: "View results" }).click();
    await expect(page.getByRole("dialog", { name: "Filter requests" })).toBeHidden();
    await expect(page.getByRole("button", { name: /Filters 1/ })).toBeVisible();
  }
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
    await expect(page.getByRole("link", { name: /View details for/ })).toHaveCount(0);
  } else {
    await expect(table).toBeVisible();
    await expect(visibleCards).toHaveCount(0);
    await expect(page.getByRole("link", { name: /View details for/ })).toHaveCount(10);
  }

  const faviconHref = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(faviconHref).toContain("icon.svg");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  expect(
    await page
      .locator('[data-slot="badge"]:visible')
      .evaluateAll((badges) =>
        badges.every((badge) => getComputedStyle(badge).whiteSpace === "nowrap"),
      ),
  ).toBe(true);

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(200);
  if (viewportWidth < 768) {
    const searchBox = await page
      .getByRole("searchbox", { name: "Search requests" })
      .boundingBox();
    expect(searchBox?.y).toBeGreaterThanOrEqual(80);
    expect(searchBox?.y).toBeLessThan(120);
  } else if (viewportWidth >= 1280) {
    const filterPanel = await page
      .getByRole("region", { name: "Request search and filters" })
      .boundingBox();
    const tableHeader = await page.locator("thead").boundingBox();
    expect(filterPanel?.y).toBeLessThan(0);
    expect(tableHeader?.y).toBeGreaterThanOrEqual(70);
    expect(tableHeader?.y).toBeLessThan(80);
  }

  await page.getByRole("link", { name: "Last page" }).click();
  await expect(page).toHaveURL(/page=1005/);
  await expect(page.getByText("Page 1005 of 1005")).toBeVisible();

  await page.getByRole("link", { name: "First page" }).click();
  await expect(page).not.toHaveURL(/page=/);
  await expect(page.getByText("Page 1 of 1005")).toBeVisible();
});
