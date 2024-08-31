import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, getNotes, updateNote } from "../request";

const App = () => {
  const queryClient = useQueryClient();
  //mutation for mutating data on the server
  const newNoteMutation = useMutation({
    // it gets the parameter of newNoteMutation
    mutationFn: createNote,
    onSuccess: (newNote) => {
      // queryClient.invalidateQueries({ queryKey: ["notes"] }); // invalidate query
      // rather than invalidating query, we can manually update the state
      const notes = queryClient.getQueryData(["notes"]); // get current state
      queryClient.setQueryData(["notes"], notes.concat(newNote)); // concat to it - IMMUTABLE
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      // queryClient.invalidateQueries({ queryKey: ["notes"] });
      const notes = queryClient.getQueryData(["notes"]);
      queryClient.setQueryData(
        ["notes"],
        notes.map((n) => (n.id == updatedNote.id ? updatedNote : n))
      );
    },
  });

  const addNote = async (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = "";
    newNoteMutation.mutate({ content, important: false });
  };

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({ ...note, important: !note.important });
  };

  const result = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>Loading data...</div>;
  }
  const notes = result.data;

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? "important" : ""}</strong>
        </li>
      ))}
    </div>
  );
};

export default App;
