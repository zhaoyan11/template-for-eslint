import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./src/types', import.meta.url))
    }
  }
  // server: {
  //   port: 5173,
  //   host: '0.0.0.0',
  //   proxy: {
  //     '/api': {
  //       target: 'http://bitbuilder.sit.ninetechone.com/api',
  //       changeOrigin: true
  //     }
  //   }
  // }
});
