// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Si tu déploies sur GitHub Pages, remplace <ton-repo> par le nom exact du repo
export default defineConfig({
  plugins: [react()],
  // base: "/<ton-repo>/",   // <-- dé-commente pour GitHub Pages (pas nécessaire en local)
});
