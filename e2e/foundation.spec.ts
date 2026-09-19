import { expect, test } from "@playwright/test";

test("foundation page communicates the portal purpose", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Every request, clear and accountable.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /portal access arrives in phase 3/i }),
  ).toBeDisabled();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
