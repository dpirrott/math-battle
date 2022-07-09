import { render, screen, renderHook, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { KeyPad } from "./Keypad";

function useDisplay(initialValue = "0") {
  const [display, setDisplay] = useState(initialValue);

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
    expect(mainDisplayText).toHaveTextContent(/^75$/i);
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

  test("Renders x.0 when dot operator pressed after number button x", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const num5Btn = screen.getByRole("button", { name: /5/i });
    const dotBtn = screen.getByRole("button", { name: /\./i });

    fireEvent.click(num5Btn);
    expect(result.current.display).toStrictEqual(["5"]);

    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    fireEvent.click(dotBtn);
    expect(result.current.display).toStrictEqual(["5", "."]);

    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent("5.");
  });

  test("Renders 0 if negative sign is pressed before other number pressed", () => {
    const { result } = renderHook(() => useDisplay());
    render(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const negBtn = screen.getByRole("button", { name: /-/i });

    fireEvent.click(negBtn);
    expect(result.current.display).toStrictEqual("0");

    expect(mainDisplayText).toHaveTextContent(/^0$/i);
  });

  test("Renders -x when negative sign is pressed after number button x", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const num5Btn = screen.getByRole("button", { name: /5/i });
    const negBtn = screen.getByRole("button", { name: /-/i });

    fireEvent.click(num5Btn);
    expect(result.current.display).toStrictEqual(["5"]);

    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    fireEvent.click(negBtn);
    expect(result.current.display).toStrictEqual(["-", "5"]);

    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent(/^-5$/i);
  });

  test("Renders 7 when delete key is pressed on value 75", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const num7Btn = screen.getByRole("button", { name: /7/i });
    const num5Btn = screen.getByRole("button", { name: /5/i });
    const delBtn = screen.getByRole("button", { name: /del/i });

    fireEvent.click(num7Btn);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);
    fireEvent.click(num5Btn);

    expect(result.current.display).toStrictEqual(["7", "5"]);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    fireEvent.click(delBtn);
    expect(result.current.display).toStrictEqual(["7"]);

    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent(/^7$/i);
  });

  test("Renders 0 if user presses delete on single digit once and twice", () => {
    const { result } = renderHook(() => useDisplay());
    const { rerender } = render(
      <KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />
    );
    const mainDisplayText = screen.getByTitle("mainDisplayText");
    const num7Btn = screen.getByRole("button", { name: /7/i });

    const delBtn = screen.getByRole("button", { name: /del/i });

    fireEvent.click(num7Btn);
    expect(result.current.display).toStrictEqual(["7"]);
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    fireEvent.click(delBtn);
    expect(result.current.display).toStrictEqual("0");
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent(/^0$/i);

    fireEvent.click(delBtn);
    expect(result.current.display).toStrictEqual("0");
    rerender(<KeyPad display={result.current.display} setDisplay={result.current.setDisplay} />);

    expect(mainDisplayText).toHaveTextContent(/^0$/i);
  });

  test("Renders question in display", () => {
    const { result } = renderHook(() => useDisplay());
    const question = {
      number: 4,
      question: "(5 x 20) =",
    };
    render(<KeyPad question={question} display={result.current.display} />);
    const questionNumField = screen.getByTitle("questionNumber");
    const questionField = screen.getByTitle("question");

    expect(questionNumField).toHaveTextContent(/^Q#4$/i);
    expect(questionField).toHaveTextContent(/^\(5 x 20\) \=/i);
  });

  test("Renders ?? x ?? in display and disables buttons when game paused", () => {
    const { result } = renderHook(() => useDisplay("PAUSED"));
    const question = {
      number: 4,
      question: "(5 x 20) =",
    };
    render(<KeyPad question={question} display={result.current.display} />);
    const num7Btn = screen.getByRole("button", { name: /7/i });
    const questionField = screen.getByTitle("question");

    expect(questionField).toHaveTextContent(/^\(\?\? x \?\?\) \=/i);
    expect(num7Btn).toBeDisabled();
  });
});
