import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',  // alias para la carpeta de componentes
      '@pages': '/src/pages',  // alias para la carpeta de páginas
      '@assets': '/src/assets', // alias para la carpeta de assets
    }
  }
});
