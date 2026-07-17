import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = repo name for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/charanlogisticsfleetmanagement/',
});
