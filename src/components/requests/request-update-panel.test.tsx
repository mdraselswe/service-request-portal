import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

import { RequestUpdatePanel } from "./request-update-panel";

afterEach(() => {
  vi.restoreAllMocks();
  refresh.mockReset();
});

describe("RequestUpdatePanel", () => {
  it("applies an optimistic status and rolls back after an API failure", async () => {
    let releaseResponse: (() => void) | undefined;
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      await responseGate;
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "INTERNAL_ERROR", message: "The update could not be saved." },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    });

    const user = userEvent.setup();
    render(
      <RequestUpdatePanel
        assignees={[]}
        initial={{ status: "IN_PROGRESS", version: 2, assignee: null }}
        requestNumber="SR-10001"
      />,
    );

    const status = screen.getByLabelText("Status");
    await user.selectOptions(status, "WAITING");
    expect(status).toHaveValue("WAITING");
    expect(screen.getByText("Saving change...")).toBeInTheDocument();

    releaseResponse?.();
    await screen.findByText("The update could not be saved.");
    await waitFor(() => expect(status).toHaveValue("IN_PROGRESS"));
    expect(refresh).not.toHaveBeenCalled();
  });
});
