import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 8 usa Rolldown. `codeSplitting.groups` es el equivalente moderno
// a manualChunks: separa vendors pesados para que el bundle inicial
// cargue solo lo que la Home necesita.
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
            },
            {
              name: "router",
              test: /node_modules[\\/]react-router/,
              priority: 30,
            },
            {
              name: "query",
              test: /node_modules[\\/]@tanstack[\\/]/,
              priority: 30,
            },
            {
              name: "radix",
              test: /node_modules[\\/](@radix-ui|@floating-ui)[\\/]/,
              priority: 25,
            },
            {
              name: "react-icons",
              test: /node_modules[\\/]react-icons[\\/]/,
              priority: 20,
            },
            {
              name: "lucide",
              test: /node_modules[\\/]lucide-react[\\/]/,
              priority: 20,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
});
