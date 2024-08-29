import { useDispatch, useSelector } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

const Notes = () => {
  const notes = useSelector(({ filter, notes }) => {
    if (filter == "IMPORTANT") return notes.filter((n) => n.important);
    return filter === "NONIMPORTANT"
      ? notes.filter((n) => !n.important)
      : notes;
  });
  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id));
  };
  const dispatch = useDispatch();
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note.id)}>
          {note.content} <strong>{note.important ? "important" : ""}</strong>
        </li>
      ))}
    </ul>
  );
};

export default Notes;
