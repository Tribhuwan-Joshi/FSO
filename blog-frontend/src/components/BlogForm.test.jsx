import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm/> pass accuarate data", async () => {
  const addBlog = vi.fn();
  const { container } = render(<BlogForm addBlog={addBlog} />);
  const url = "/test";
  const author = "joji";
  const title = "medicine";

  const titleInput = container.querySelector("#title");
  const authorInput = container.querySelector("#author");
  const urlInput = container.querySelector("#url");

  const user = userEvent.setup();

  await user.type(titleInput, title);
  await user.type(authorInput, author);
  await user.type(urlInput, url);

  const btn = screen.getByText("Add blog");
  screen.debug(btn);
  await user.click(btn);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0].title).toBe(title);
  expect(addBlog.mock.calls[0][0].author).toBe(author);
  expect(addBlog.mock.calls[0][0].url).toBe(url);
});
