import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
   css: {
    postcss: './postcss.config.js' // if you have postcss config
  },server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
      // '/socket.io': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      //   secure: false,
      //   ws: true, // Important for WebSocket
      //   }
    }
  }
  
})
