import { useField, useResource } from "./hooks";

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    await noteService.create({ content: content.value });
    content.onReset();
  };

  const handlePersonSubmit = async (event) => {
    event.preventDefault();
    await personService.create({ name: name.value, number: number.value });
    name.onReset();
    number.onReset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>

      {notes.isLoading
        ? "Loading..."
        : notes.resources.map((n) => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.isLoading
        ? "Loading..."
        : persons.resources.map((n) => (
            <p key={n.id}>
              {n.name} {n.number}
            </p>
          ))}
    </div>
  );
};

export default App;
