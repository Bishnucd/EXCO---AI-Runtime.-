import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '../src/renderer'),
  base: './',
  css: {
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  build: {
    outDir: path.resolve(__dirname, '../dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, '../src/renderer/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../src/shared'),
      '@renderer': path.resolve(__dirname, '../src/renderer'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
