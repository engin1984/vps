import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: true, // binds to 0.0.0.0
    open: true, // auto-opens browser
    watch: {
      include: ['**/*.html', '**/*.js', '**/*.css'],
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    },
    hmr: {
      timeout: 30000,
      overlay: true,
      host: 'localhost',
      protocol: 'ws',
      clientPort: 5173
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '', // <-- disables dist/assets/
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        // about: resolve(__dirname, 'about.html'),
        '404': resolve(__dirname, '404.html'),
        // 'password-change': resolve(__dirname, 'password-change.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  }
})
