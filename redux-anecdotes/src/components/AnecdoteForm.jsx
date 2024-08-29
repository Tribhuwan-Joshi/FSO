import { addAnecdotes } from "../reducers/anecdoteReducer";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addNewAnecdote = (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = "";
    dispatch(addAnecdotes(content));
    dispatch(setNotification(`New anecdote created - ${content}`));
    setTimeout(() => dispatch(setNotification("")), 5000);
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
