const noteReducer = (state = [], action) => {
  if (action.type === "NEW_NOTE") {
    return state.concat(action.payload);
  }
  if (action.type === "TOGGLE_IMPORTANCE") {
    return state.map((s) => {
      if (s.id == action.payload.id) return { ...s, important: !s.important };
      return s;
    });
  }
  return state;
};

export const createNote = (content) => {
  return {
    type: "NEW_NOTE",
    payload: {
      content,
      important: false,
      id: generateId(),
    },
  };
};

export const toggleImportanceOf = (id) => {
  return {
    type: "TOGGLE_IMPORTANCE",
    payload: { id },
  };
};
export const generateId = () => Number((Math.random() * 1000000).toFixed(0));

export default noteReducer;
