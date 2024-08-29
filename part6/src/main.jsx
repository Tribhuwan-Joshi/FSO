import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer.js";
import { StrictMode } from "react";

// combine reducer using key:value
const reducer = combineReducers({ notes: noteReducer, filter: filterReducer });

const store = createStore(reducer);

//action creator
const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
