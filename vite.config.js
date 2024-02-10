// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Entry file is usually specified here
      },
    },
  },
});
