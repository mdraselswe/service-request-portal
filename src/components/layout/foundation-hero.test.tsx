import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoundationHero } from "@/components/layout/foundation-hero";

describe("FoundationHero", () => {
  it("presents the portal purpose and accessible foundation navigation", () => {
    render(<FoundationHero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /every request, clear and accountable/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /skip to content/i }),
    ).toHaveAttribute("href", "#content");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /designed for the full request lifecycle/i,
      }),
    ).toBeInTheDocument();
  });

  it("marks unavailable portal access as disabled", () => {
    render(<FoundationHero />);

    expect(
      screen.getByRole("button", { name: /portal access arrives in phase 3/i }),
    ).toBeDisabled();
  });
});
