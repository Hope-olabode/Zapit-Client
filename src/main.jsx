import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./context/Provider.jsx";
import axios from "axios";
import { registerSW } from "virtual:pwa-register";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

// ✅ REGISTER SERVICE WORKER
registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});

createRoot(document.getElementById("root")).render(
  <Provider>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
