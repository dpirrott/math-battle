import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

let props = {
  cookies: {
    username: "Dfish",
  },
  roomID: null,
};

describe("Header component responding to different props", () => {
  test("Renders header component", () => {
    render(<Header {...props} />);
    const H1 = screen.getByText("Choose a room");
    const logoutBtn = screen.queryByRole("button");
    expect(H1).toBeInTheDocument();
    expect(logoutBtn).toBeNull();
  });

  test("Renders leave room button when room ID provided", () => {
    props = {
      ...props,
      roomID: 2,
      inGame: false,
    };
    render(<Header {...props} />);
    const logoutBtn = screen.getByRole("button", { name: "Leave room" });
    expect(logoutBtn).toBeInTheDocument();
  });
});
