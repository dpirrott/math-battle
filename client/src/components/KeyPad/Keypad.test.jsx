import { render, screen } from "@testing-library/react";
import { KeyPad } from "./Keypad";

describe("Header component responding to different props", () => {
  test("Renders a button", () => {
    const setState = jest.fn();
    let state = "0";
    render(<KeyPad display={state} setDisplay={setState} />);
    const num7Btn = screen.getByRole("button", { name: /7/i });
    expect(num7Btn).toBeInTheDocument();
  });

  test("Renders 0 in display on render", () => {
    const setState = jest.fn();
    let state = "0";
    render(<KeyPad display={state} setDisplay={setState} />);
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    expect(mainDisplayText).toHaveTextContent("0");
  });

  test("Renders 7 on display if button 7 is pressed", () => {
    const setState = jest.fn();
    let state = "0";
    render(<KeyPad display={state} setDisplay={setState} />);
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    expect(mainDisplayText).toHaveTextContent("0");
  });
});
