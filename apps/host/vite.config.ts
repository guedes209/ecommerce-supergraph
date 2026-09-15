import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// @ts-expect-error - The plugin typings conflict with nodenext module resolution
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        catalog: 'http://localhost:5174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql']
    })
  ],
  build: {
    target: 'esnext'
  }
})
