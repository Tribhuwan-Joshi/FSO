import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter((a) => a.content.includes(state.filter))
  );
  const dispatch = useDispatch();
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                dispatch(vote(anecdote.id));
                dispatch(setNotification(`You voted ${anecdote.content}`));
                setTimeout(() => dispatch(setNotification("")), 5000);
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
