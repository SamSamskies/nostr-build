import { defineConfig } from 'vite';

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
  }
});
