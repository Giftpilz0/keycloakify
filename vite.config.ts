import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    keycloakify({
      accountThemeImplementation: "none",
      // Only Keycloak 26 is in use
      keycloakVersionTargets: {
        "22-to-25": false,
        "all-other-versions": "keycloak-theme.jar",
      },
    }),
  ],
});
