import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer.js";
import { StrictMode } from "react";

const store = configureStore({
  reducer: { notes: noteReducer, filter: filterReducer },
});

//action creator
const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
