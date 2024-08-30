import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addAnecdotes: (state, action) => {
      // if mutate don't return
      state.push(action.payload);
    },
    vote: (state, action) => {
      return state
        .map((a) => (a.id === action.payload.id ? action.payload : a))
        .sort((a, b) => b.votes - a.votes);
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes);
    },
  },
});

export default anecdoteSlice.reducer;
export const { addAnecdotes, vote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(addAnecdotes(newAnecdote));
  };
};

export const giveVote = (id) => {
  return async (dispatch, getState) => {
    const toUpdate = getState().anecdotes.find((a) => a.id == id);
    const updatedAnecdote = await anecdoteService.update(toUpdate.id, {
      ...toUpdate,
      votes: toUpdate.votes + 1,
    });
    dispatch(vote(updatedAnecdote));
  };
};
