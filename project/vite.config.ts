import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    base: env.VITE_BASE_URL || '/',
    server: {
      port: 5000,
      host: true,
      open: true,
      strictPort: true
    },
  };
});
