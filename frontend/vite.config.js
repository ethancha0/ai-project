import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the plugin

// https://vitejs.dev
export default defineConfig({
  plugins: [
    tailwindcss(), // Add the plugin
    react(),
  ],
  server: {
    // In dev, forward /api requests to the FastAPI server.
    // This lets the frontend call /api/* without hardcoding a base URL.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
