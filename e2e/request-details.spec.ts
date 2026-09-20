import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ timeout: 90_000 });

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@assunnah.org");
  await page.getByLabel("Password", { exact: true }).fill("Portal@123");
  await page.getByRole("button", { name: "Sign in to the portal" }).click();
  await expect(page).toHaveURL("/", { timeout: 30_000 });
}

function requestForProject(
  projectName: string,
  numbers: { desktop: string; tablet: string; mobile: string },
) {
  if (projectName === "chromium") return numbers.desktop;
  if (projectName === "tablet-chrome") return numbers.tablet;
  return numbers.mobile;
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("loads request history directly and saves an optimistic status update", async ({
  page,
}, testInfo) => {
  const requestNumber = requestForProject(testInfo.project.name, {
    desktop: "SR-10001",
    tablet: "SR-10009",
    mobile: "SR-10002",
  });
  await page.goto(`/requests/${requestNumber}`);

  await expect(page.getByText(requestNumber, { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Activity history" })).toBeVisible();

  const status = page.getByLabel("Status");
  const current = await status.inputValue();
  const options = await status.locator("option").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLOptionElement).value),
  );
  const next = options.find((value) => value !== current);
  expect(next).toBeTruthy();
  await status.selectOption(next!);

  await expect(status).toHaveValue(next!);
  await expect(page.getByText("Request updated successfully.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("heading", { name: "Activity history" })).toBeVisible();
});

test("rolls an optimistic update back when the API fails", async ({ page }, testInfo) => {
  const requestNumber = requestForProject(testInfo.project.name, {
    desktop: "SR-10003",
    tablet: "SR-10010",
    mobile: "SR-10004",
  });
  await page.goto(`/requests/${requestNumber}`);
  const status = page.getByLabel("Status");
  const current = await status.inputValue();
  const options = await status.locator("option").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLOptionElement).value),
  );
  const next = options.find((value) => value !== current);
  expect(next).toBeTruthy();

  await page.route(`**/api/requests/${requestNumber}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: { code: "UNAVAILABLE", message: "The service is temporarily unavailable." },
      }),
    });
  });

  await status.selectOption(next!);
  await expect(status).toHaveValue(next!);
  await expect(page.getByText("The service is temporarily unavailable.")).toBeVisible();
  await expect(status).toHaveValue(current);
});

test("shows a designed not-found state for an unknown request", async ({ page }) => {
  await page.goto("/requests/SR-DOES-NOT-EXIST");
  await expect(page.getByRole("heading", { name: "Request not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to requests" })).toBeVisible();
});

test("rejects a stale version without changing the request", async ({
  page,
}, testInfo) => {
  const requestNumber = requestForProject(testInfo.project.name, {
    desktop: "SR-10012",
    tablet: "SR-10013",
    mobile: "SR-10014",
  });
  await page.goto(`/requests/${requestNumber}`);

  const panel = page.getByRole("region", { name: "Manage request" });
  const version = Number(await panel.getAttribute("data-request-version"));
  const status = page.getByLabel("Status");
  const current = await status.inputValue();
  const options = await status.locator("option").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLOptionElement).value),
  );
  const next = options.find((value) => value !== current);
  expect(next).toBeTruthy();

  const response = await page.request.patch(`/api/requests/${requestNumber}`, {
    data: {
      mutationId: crypto.randomUUID(),
      version: version + 1,
      status: next,
    },
  });

  expect(response.status()).toBe(409);
  await expect(response.json()).resolves.toMatchObject({
    ok: false,
    error: { code: "VERSION_CONFLICT" },
  });
});

test("updates an assignee and safely replays the same mutation", async ({
  page,
}, testInfo) => {
  const requestNumber = requestForProject(testInfo.project.name, {
    desktop: "SR-10007",
    tablet: "SR-10011",
    mobile: "SR-10008",
  });
  await page.goto(`/requests/${requestNumber}`);

  const panel = page.getByRole("region", { name: "Manage request" });
  const version = Number(await panel.getAttribute("data-request-version"));
  const assignee = page.getByLabel("Assignee");
  const current = await assignee.inputValue();
  const options = await assignee.locator("option").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLOptionElement).value),
  );
  const next = options.find((value) => value && value !== current);
  expect(version).toBeGreaterThan(0);
  expect(next).toBeTruthy();

  const body = {
    mutationId: crypto.randomUUID(),
    version,
    assigneeId: next,
  };
  const first = await page.request.patch(`/api/requests/${requestNumber}`, { data: body });
  expect(first.status()).toBe(200);
  await expect(first.json()).resolves.toMatchObject({
    ok: true,
    data: { replayed: false, request: { assignee: { id: next } } },
  });

  const replay = await page.request.patch(`/api/requests/${requestNumber}`, { data: body });
  expect(replay.status()).toBe(200);
  await expect(replay.json()).resolves.toMatchObject({
    ok: true,
    data: { replayed: true, request: { assignee: { id: next } } },
  });
});
