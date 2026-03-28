import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../../packages/assets'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,

    proxy: {
      '/rooms': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      '/math-profiles': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },

      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
