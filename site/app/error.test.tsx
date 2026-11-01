// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import ErrorBoundary from "./error";
import Loading from "./loading";

afterEach(cleanup);

describe("error boundary", () => {
  test("shows a plain message, hides the stack, and retries via reset()", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error("secret internal detail");
    const { getByRole, queryByText } = render(<ErrorBoundary error={error} reset={reset} />);
    expect(queryByText(/secret internal detail/)).toBeNull();
    fireEvent.click(getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe("loading state", () => {
  test("is a status region with accessible text", () => {
    const { getByRole } = render(<Loading />);
    expect(getByRole("status").textContent).toContain("Loading");
  });
});
