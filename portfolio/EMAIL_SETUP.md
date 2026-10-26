# Contact email backend

The form posts to `/api/contact`. Messages always go to jameslurtin@gmail.com, with the visitor as Reply-To and their name, phone, subject and message included. Success indicates provider acceptance, not guaranteed inbox placement.

## Local Gmail SMTP

Keep the existing SMTP_USER and SMTP_PASS in the ignored `.env.local`. EMAIL_PROVIDER defaults to smtp. Gmail requires an App Password: https://myaccount.google.com/apppasswords. Run `npm run dev`, or `docker compose up -d --build` for the production server locally.

## Render free: Resend HTTPS

Render free blocks SMTP connections. Create a Resend account using jameslurtin@gmail.com and create a sending API key at https://resend.com/api-keys. Set these server-only environment variables in Render:

- EMAIL_PROVIDER=resend
- RESEND_API_KEY=<your private key>
- EMAIL_FROM=Jameslurtin Portfolio <onboarding@resend.dev>

The testing sender can send only to the email address associated with your Resend account. For a custom sender, verify a domain in Resend and set EMAIL_FROM to an address on it. The recipient stays fixed. Never use a VITE_ prefix for any secret. Never commit `.env.local` or paste keys into chat.

To test HTTPS delivery locally, add the API key and EMAIL_PROVIDER=resend to `.env.local`; retain SMTP settings for switching back. Recreate the Compose container after environment changes. Production `npm start` expects environment variables supplied by its host; it does not load `.env.local` itself.

## Verification

`npm test` mocks both providers and sends no real email. Responses: 200 provider accepted; 400/413/415 invalid request; 429 rate limit; 503 missing configuration; 502 provider failure. Provider diagnostics are never returned to visitors. HTTPS delivery has a 15-second timeout.

The handler validates inputs, limits bodies to 16 KB, rejects cross-site browser submissions and honeypot values, and limits requests per server instance. In-memory limits reset after restart and are not shared across instances.

References: https://resend.com/docs/api-reference/emails/send-email and https://resend.com/docs/api-reference/errors
