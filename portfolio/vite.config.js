import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createContactHandler } from './server/contact.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const contact = createContactHandler({ getEnv: () => ({ ...loadEnv(mode, process.cwd(), ''), ...process.env }) });
  return {
    plugins: [react(), {
      name: 'portfolio-contact-api',
      configureServer(server) { server.middlewares.use('/api/contact', contact); },
      configurePreviewServer(server) { server.middlewares.use('/api/contact', contact); },
    }],
  };
})
