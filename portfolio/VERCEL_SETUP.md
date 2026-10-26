Vercel deploy guide

This repository is prepared for static deployment to Vercel (build output `dist`).

Recommended steps:

1) Install Vercel CLI (optional):

   ```bash
   npm i -g vercel
   # or
   npx vercel
   ```

2) Log in to Vercel:

   ```bash
   vercel login
   ```

3) From the `portfolio` folder run:

   ```bash
   npm run build
   vercel --prod
   ```

4) Environment variables (optional):
- If you want server-side contact endpoint, set `VITE_CONTACT_ENDPOINT` to the functions URL (e.g., `https://<region>-<project>.cloudfunctions.net/api`) in Vercel Project Settings → Environment Variables.
- For EmailJS fallback, set `VITE_EMAILJS_USER`, `VITE_EMAILJS_SERVICE`, and `VITE_EMAILJS_TEMPLATE`.

Notes:
- `vercel --prod` will prompt to link to a project or create a new one. Choose your account and enter the domain `jameslurtinveeraraj.com` if you own it.
- You can also connect your Git repo in Vercel dashboard for automatic deployments on push.

If you want, I can run `vercel --prod` from here (it will open an authentication flow). Confirm and I'll proceed.
