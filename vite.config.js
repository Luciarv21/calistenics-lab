import { viteStaticCopy } from 'vite-plugin-static-copy';

export default {
  root: '.',
  publicDir: false,
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'content', dest: '.' },
        { src: 'images', dest: '.' },
      ],
    }),
  ],
};
