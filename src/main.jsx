import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/provider/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter future={{ v7_startTransition: true }}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
