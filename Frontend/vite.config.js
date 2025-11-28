// Frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  // *** INCLUIR ESTO PARA ASEGURAR RUTAS CORRECTAS EN PRODUCCIÓN ***
  base: '/',
  // ***************************************************************
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Esto es solo para desarrollo
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
    },
  },
});