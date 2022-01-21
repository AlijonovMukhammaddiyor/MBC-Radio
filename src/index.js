import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "./styles/general/general.css";
import { ContextProvider } from "./context/context";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
