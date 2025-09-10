import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageButton } from "../MessageButton";

describe("MessageButton Component", () => {
  it("renders with initial message", () => {
    render(<MessageButton />);

    expect(screen.getByTestId("message")).toHaveTextContent("Hello World!");
    expect(screen.getByTestId("change-button")).toBeInTheDocument();
  });

  it("changes message when button is clicked", async () => {
    const user = userEvent.setup();
    render(<MessageButton />);

    const message = screen.getByTestId("message");
    const button = screen.getByTestId("change-button");

    // Initially shows "Hello World!"
    expect(message).toHaveTextContent("Hello World!");

    // Click the button
    await user.click(button);

    // Message should change
    expect(message).toHaveTextContent("Button was clicked!");
  });
});
