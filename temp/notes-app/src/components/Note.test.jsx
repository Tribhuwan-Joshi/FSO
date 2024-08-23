import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // user event library to simulate event
import Note from "./Note";

test("renders content", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };
  const { container } = render(<Note note={note} />);
  const div = container.querySelector(".note");

  //   screen.debug(); // show the whole DOM
  //   screen.debug(div);
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
});

test("clicking the button calls event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockhandler = vi.fn();

  render(<Note note={note} toggleImportance={mockhandler} />);

  const user = userEvent.setup(); // create userEvent instance

  const button = screen.getByText("make not important");
  await user.click(button);
  expect(mockhandler.mock.calls).toHaveLength(1);
});
