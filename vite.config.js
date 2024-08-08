import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NostrUpload',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['nostr-tools']
    }
  }
});
