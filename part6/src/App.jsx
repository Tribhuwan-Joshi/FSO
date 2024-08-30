import { useEffect } from "react";
import NewNote from "./components/newNote";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";
import { useDispatch } from "react-redux";
import { initializeNotes } from "./reducers/noteReducer";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeNotes());
  }, []);
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
