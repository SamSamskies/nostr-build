import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NostrBuild',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['nostr-tools']
    }
  },
  plugins: [dts()]
});
