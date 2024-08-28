import NewNote from "./components/newNote";
import Notes from "./components/Notes";

const App = () => {
  return (
    <div>
      <NewNote />
      <h3>Notes</h3>
      <Notes />
    </div>
  );
};

export default App;
