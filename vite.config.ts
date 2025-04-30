//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'
//import path from 'path'
//
//// https://vitejs.dev/config/
//export default defineConfig({
//  base: '/Portfolio/',
//  plugins: [react()],
//  resolve: {
//    alias: {
//      '@': path.resolve(__dirname, 'src') // This tells Vite where the "@" symbol points to
//    }
//  }
//})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
