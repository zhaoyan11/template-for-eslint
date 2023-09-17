import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import * as path from 'path';

declare let __dirname: string;

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ]
});

