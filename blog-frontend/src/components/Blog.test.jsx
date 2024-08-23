import Blog from "./Blog";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("<Blog/>", () => {
  let container;
  let incrementLike;
  let currentUsername;
  let deleteBlog;
  beforeEach(() => {
    const blog = {
      url: "/test",
      author: "joji",
      title: "medicine",
      likes: 0,
      user: { username: "joji", id: "123", name: "franku" },
    };
    incrementLike = vi.fn();
    currentUsername = "joji";
    deleteBlog = vi.fn();
    container = render(
      <Blog
        blog={blog}
        incrementLike={incrementLike}
        deleteBlog={deleteBlog}
        currentUsername={currentUsername}
      />
    ).container;
  });

  test("render correctly", async () => {
    const blogInfo = container.querySelector(".blogInfo");
    const extraInfo = container.querySelector(".extraInfo");

    expect(blogInfo).toBeDefined();
    expect(extraInfo).toBeDefined();

    expect(blogInfo).not.toHaveStyle("display:none ");
    expect(extraInfo).toHaveStyle("display:none ");
    expect(blogInfo).toHaveTextContent("joji");
    expect(blogInfo).toHaveTextContent("medicine");
  });

  test("toggle visibility of extraInfo", async () => {
    const btn = screen.getByText("view");
    const user = userEvent.setup();
    await user.click(btn);

    let extraInfo = container.querySelector(".extraInfo");
    expect(extraInfo).not.toHaveStyle("display:none ");

    // it gets hide again if we click
    const hideBtn = screen.getByText("hide");
    await user.click(hideBtn);
    extraInfo = container.querySelector(".extraInfo");
    expect(extraInfo).toHaveStyle("display:none ");
  });

  test("like button works properly", async () => {
    const btn = screen.getByText("view");
    const user = userEvent.setup();
    await user.click(btn);

    const likeBtn = container.querySelector("#likebtn");
    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(incrementLike.mock.calls).toHaveLength(2);
  });
});
