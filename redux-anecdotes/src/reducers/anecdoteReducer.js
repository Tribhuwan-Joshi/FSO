const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

export const addAnecdotes = (content) => {
  return {
    type: "ADD",
    content,
  };
};

export const vote = (id) => {
  return {
    type: "VOTE",
    id,
  };
};

const reducer = (state = initialState, action) => {
  if (action.type == "VOTE") {
    const toChange = state.find((s) => s.id === action.id);
    return state
      .map((s) =>
        s.id == toChange.id ? { ...toChange, votes: toChange.votes + 1 } : s
      )
      .sort((a, b) => b.votes - a.votes);
  }
  if (action.type == "ADD") {
    const newAnecdote = asObject(action.content);
    return state.concat(newAnecdote);
  }

  return state;
};

export default reducer;
