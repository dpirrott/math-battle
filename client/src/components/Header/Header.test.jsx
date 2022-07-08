import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header component responding to different props", () => {
  let props = {
    cookies: {
      username: null,
    },
    roomID: null,
  };

  test("Renders text Math Battle when not signed in", () => {
    render(<Header {...props} />);
    const H1 = screen.getByText("Math Battle");
    expect(H1).toBeInTheDocument();
  });

  test("Renders h1 Choose a room when logged in with no room selected", () => {
    props = {
      cookies: {
        username: "Dfish",
      },
      roomID: null,
    };
    render(<Header {...props} />);
    const H1 = screen.getByText("Choose a room");
    const logoutBtn = screen.queryByRole("button");
    expect(H1).toBeInTheDocument();
    expect(logoutBtn).toBeNull();
  });

  test("Renders leave room button when room ID provided", () => {
    props = {
      cookies: {
        username: "Dfish",
      },
      roomID: 2,
      inGame: false,
    };
    render(<Header {...props} />);
    const logoutBtn = screen.getByRole("button", { name: /leave room/i });
    expect(logoutBtn).toBeInTheDocument();
  });

  test("Renders end game button when in active game with opponent", () => {
    props = {
      cookies: {
        username: "Dfish",
      },
      roomID: 2,
      inGame: true,
    };
    render(<Header {...props} />);
    const endBtn = screen.getByRole("button", { name: /end game/i });
    expect(endBtn).toBeInTheDocument();
  });
});
