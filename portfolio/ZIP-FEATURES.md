# ZIP functionality adapted to Jameslurtin's portfolio

- Mouse cursor with a trailing ring and enlarged hover state; disabled for touch and reduced motion.
- Rotating typewriter roles in English and French; static accessible text for screen readers and reduced motion.
- Scroll reveals, active-section navigation, smooth section links, portrait scanning, hover effects and availability animation.
- Responsive navigation with close-on-selection, Escape and outside-click dismissal.
- Full English/French content, including project details, skills, form feedback and page metadata. Switch in the header or footer; language persists and supports `?lang=en` / `?lang=fr` and browser history.
- Floating contact button, footer navigation, social links, résumé links, featured projects and factual summary cards.
- Contact form with required name/email/subject/message, optional phone, client-side honeypot, loading spinner, disabled submit while pending, localized success/error feedback, reset on success and preserved input on failure.
- Contact delivery uses the server-side Gmail SMTP endpoint at `/api/contact`. See `EMAIL_SETUP.md` for local credentials and Vercel configuration.
- Public profile links and typewriter roles in `src/data/profile.js`; projects in `src/data/projects.js`; French text in `src/data/french.js`. Unsupported project-link protocols are rejected.

## Checks

```powershell
npm run build
node --test scripts/contact.test.mjs scripts/preferences.test.mjs
```

With the development server at `http://127.0.0.1:5174/`, the Windows Chrome interaction check runs with:

```powershell
node --experimental-websocket scripts/browser-check.mjs
```

It uses an isolated temporary Chrome profile and mocks contact requests. It checks desktop/mobile layouts, language/history, cursor/typewriter, mobile navigation, active sections, reveals, reduced motion, validation, honeypot and pending/success/error form states. The screenshot is saved as `browser-mobile.local.png` and excluded from Git. Actual inbox delivery is not tested.
