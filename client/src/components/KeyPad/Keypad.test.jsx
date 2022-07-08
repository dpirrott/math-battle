import { render, screen, renderHook, fireEvent, waitFor } from "@testing-library/react";
import { wait } from "@testing-library/user-event/dist/utils";
import { useState } from "react";
import { KeyPad } from "./Keypad";

function useDisplay() {
  const [display, setDisplay] = useState("0");

  return { display, setDisplay };
}

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
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    let mainDisplayText = screen.getByTitle("mainDisplayText");
    const num7Btn = screen.getByRole("button", { name: /7/i });
    expect(mainDisplayText).toHaveTextContent("0");
    fireEvent.click(num7Btn);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);
    expect(mainDisplayText).toHaveTextContent("7");
  });

  test("Renders 75 on display if button 7 then 5 is pressed", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const num7Btn = screen.getByRole("button", { name: /7/i });
    const num5Btn = screen.getByRole("button", { name: /5/i });

    expect(mainDisplayText).toHaveTextContent("0");

    fireEvent.click(num7Btn);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);
    fireEvent.click(num5Btn);

    expect(result.current.display).toStrictEqual(["7", "5"]);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);
    expect(mainDisplayText).toHaveTextContent("75");
  });

  test("Renders 0. when dot operator pressed before other numbers", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const dotBtn = screen.getByRole("button", { name: /\./i });

    fireEvent.click(dotBtn);
    expect(result.current.display).toStrictEqual(["0", "."]);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent("0.");
  });

  // next tests:
  // - Check if special characters work
  // - Verify users cant delete past 0
  // - Test what happens when a question is present
  // - Test what happens when game is paused
});
