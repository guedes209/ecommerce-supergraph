import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - The plugin typings conflict with nodenext module resolution
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './Catalog': './src/Catalog.tsx',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql']
    })
  ],
  server: {
    port: 5174,
  },
  preview: {
    port: 5174,
    strictPort: true
  },
  build: {
    target: 'esnext'
  }
})
