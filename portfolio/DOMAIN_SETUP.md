Domain setup guide — choose and connect a custom domain

Recommended domain: jameslurtinveeraraj.com

1) Buy the domain
- Use a registrar (Namecheap, Google Domains, GoDaddy, OVH, etc.) and register the domain.

2) Option A — Firebase Hosting (recommended if you use Firebase hosting):
- In the Firebase Console, go to Hosting → Add custom domain.
- Enter `jameslurtinveeraraj.com` and follow the verification steps.
- Firebase will provide DNS records (A / TXT) to add at your registrar — add them and wait for propagation.
- Once verified, Firebase will provision SSL automatically and serve your site.
- Deploy your site with:

  ```bash
  cd portfolio
  npm run build
  firebase deploy --only hosting,functions
  ```

3) Option B — Vercel or Netlify:
- On Vercel: add a new project (connect Git repo) then in Project Settings → Domains add `jameslurtinveeraraj.com` and follow DNS instructions.
- On Netlify: add site, then Domains → Add custom domain and set DNS records as instructed.
- Both providers handle SSL automatically.

4) If you prefer to host with Firebase Functions + Hosting (this repo):
- Ensure `firebase.json` includes the hosting `public` set to `dist` and `functions.source` is `functions` (already configured).
- Set SMTP credentials for the function (see `functions/README.md`) using the Firebase CLI:

  ```bash
  firebase functions:config:set smtp.user="your_smtp_user" smtp.pass="your_smtp_pass" to.email="jameslurtinv@gmail.com"
  firebase deploy --only functions,hosting
  ```

5) After DNS is live:
- Verify the site at https://jameslurtinveeraraj.com
- Update `index.html` `og:url` and canonical (already set to the domain) if you change domain.

If you want, I can:
- Run the Firebase deploy commands here (requires Firebase CLI authentication and project ID).
- Help purchase the domain (I can suggest vendors and the exact DNS records you'll need).
