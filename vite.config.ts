import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
    },
  },
  build: {
    target: 'esnext',
  },
});
