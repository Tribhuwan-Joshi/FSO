import NewNote from "./components/newNote";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";

const App = () => {
  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <h3>Notes</h3>
      <Notes />
    </div>
  );
};

export default App;
