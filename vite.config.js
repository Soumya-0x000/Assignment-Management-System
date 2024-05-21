import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        // Include any specific configuration if needed
      },
    },
  },
  optimizeDeps: {
    include: ['@uppy/core', '@uppy/dashboard', '@uppy/webcam', '@uppy/progress-bar'],
  },
})
