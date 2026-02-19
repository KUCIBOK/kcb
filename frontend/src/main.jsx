import "./index.css";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import {ErrorBoundary} from "react-error-boundary";
import Error500 from "./components/fallback/Error500";

const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")).render(
  <ErrorBoundary FallbackComponent={Error500}>
    <App />
  </ErrorBoundary>
);
