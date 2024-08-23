import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm";

describe("<NoteForm/>", () => {
  let createNote;
  beforeEach(() => {
    createNote = vi.fn();
    render(<NoteForm createNote={createNote} />).container;
  });
  test("calls onSubmit with correct arguement", async () => {
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText("write note content here");
    const saveBtn = screen.getByText("save");

    // type inside input
    await user.type(input, "testing a form...");
    await user.click(saveBtn);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe("testing a form...");

    //side note
    // use {exact:false} as getByText search for exact element
    // use queryByText if u have to check if the result is null without getting exception
  });
});
