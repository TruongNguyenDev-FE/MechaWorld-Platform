import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/v1": {
        target: "https://gundam-platform-api.fly.dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, "/v1"), 
      },
    },
  },
})
