import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./main.css";
import { KcPage } from "./kc.gen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.kcContext ? (
      <KcPage kcContext={window.kcContext} />
    ) : (
      <h1>No Keycloak Context</h1>
    )}
  </StrictMode>,
);
