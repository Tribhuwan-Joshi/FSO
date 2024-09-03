const Note = ({ note, toggleImportance, remove }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={remove}>Delete Note</button>
    </li>
  );
};

export default Note;
