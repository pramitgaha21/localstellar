import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  server: {
    fs: {
      allow: ['./packages']
    }
  },
  plugins: [
    nodePolyfills({ include: [ 'buffer' ]}),
    sveltekit()
  ],
});
