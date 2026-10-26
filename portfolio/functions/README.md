Firebase Function for contact form

Environment (set with `firebase functions:config:set` or using runtime env):

- smtp.user: SMTP username (SMTP_USER)
- smtp.pass: SMTP password (SMTP_PASS)
- smtp.host: SMTP host (optional, default smtp.gmail.com)
- smtp.port: SMTP port (optional, default 587)
- smtp.secure: true/false (optional)
- to.email: recipient email address (optional, default jameslurtinv@gmail.com)

Example (using firebase CLI):

```
firebase functions:config:set smtp.user="your@email.com" smtp.pass="yourpass" to.email="jameslurtinv@gmail.com"
firebase deploy --only functions
```

Notes:
- For Gmail, create an App Password if using 2FA or enable less-secure apps (not recommended).
- Alternatively use a transactional email provider (SendGrid, Mailgun) and provide SMTP credentials.
