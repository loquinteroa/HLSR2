import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NavigationProvider } from "./contexts/NavigationContext";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <NavigationProvider>
      <App />
    </NavigationProvider>
  </BrowserRouter>,
);

reportWebVitals();
