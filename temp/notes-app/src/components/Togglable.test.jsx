import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";

describe("<Togglable/>", () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container;
  });

  test("render its children", async () => {
    await screen.findAllByText("togglable content");
  });

  test("at the start children  are not displayed", () => {
    // get children and check their style
    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display : none");
  });

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button); // user events are asynchronous

    const div = container.querySelector(".togglableContent");
    expect(div).not.toHaveStyle("display: none");
  });
  test("clicking the hide button, togglable content is closed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const closeButton = screen.getByText("cancel");
    await user.click(closeButton);

    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display:none");
  });
});
