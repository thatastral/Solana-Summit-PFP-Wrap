import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { figmaAssetsPlugin } from './vite-plugin-figma-assets';

export default defineConfig({
  plugins: [react(), figmaAssetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  assetsInclude: ['/*.png', '/.jpg', '**/.jpeg', '/*.svg', '/*.mp3'],
});
