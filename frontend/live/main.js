import React from "https://esm.sh/react@18.3.1?dev";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client?dev";
import App from "./App.js";
createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null
    , React.createElement(App, null )
  )
);
