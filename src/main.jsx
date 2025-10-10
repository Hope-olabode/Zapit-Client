import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./context/Provider.jsx";
import axios from "axios";

axios.defaults.withCredentials = true; // send cookies with requests
axios.defaults.baseURL = "http://localhost:5000"; // backend URL

createRoot(document.getElementById("root")).render(
  <Provider>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
