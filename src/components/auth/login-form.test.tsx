import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/actions", () => ({
  loginAction: vi.fn(),
}));

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("renders labeled credential fields and preserves the return path", () => {
    render(<LoginForm returnTo="/requests?status=OPEN" />);

    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "password");
    expect(screen.getByDisplayValue("/requests?status=OPEN")).toHaveAttribute(
      "name",
      "returnTo",
    );
    expect(screen.getByRole("button", { name: /sign in to the portal/i })).toBeEnabled();
  });
});
