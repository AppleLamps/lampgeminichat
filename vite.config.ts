import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // This alias allows you to import components using "@/components/..."
            // It's a common convention, especially with shadcn-ui
            "@": path.resolve(__dirname, "./src"),
        },
    },
})