import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const history = require('connect-history-api-fallback');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-fallback',
      configureServer(app) {
        app.middlewares.use(history({
          disableDotRule: true,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          rewrites: [
            {
              from: /\/dashboard\/.*$/,
              to: '/index.html'
            },
            {
              from: /^\/$/,
              to: '/index.html'
            }
          ]
        }));
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "/fusteps-jobs"),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
