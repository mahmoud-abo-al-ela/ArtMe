import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: "#4338ca",
              hover: "#3730a3",
            },
            secondary: "#64748b",
            background: {
              light: "#ffffff",
              DEFAULT: "#f8fafc",
              dark: "#0f172a",
            },
            text: {
              DEFAULT: "#1e293b",
              light: "#64748b",
            },
            danger: "#ef4444",
            success: "#22c55e",
            warning: "#f59e0b",
          },
        },
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
  },
});
