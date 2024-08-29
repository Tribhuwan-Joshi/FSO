import AnecdoteFilter from "./components/AnecdoteFilter";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";

const App = () => {
  return (
    <div>
      <AnecdoteFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
