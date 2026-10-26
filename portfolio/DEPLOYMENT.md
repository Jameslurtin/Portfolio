# Docker and Render free deployment

Run locally from `portfolio` with `docker compose up -d --build`, then open http://localhost:8080. Compose loads `.env.local` at runtime. The image excludes secrets and runs as a non-root user. `/healthz` reports server health; it does not verify email credentials.

## CI/CD

GitHub Actions in `.github/workflows/portfolio-ci.yml` installs locked dependencies, lints, runs tests, builds the frontend, and builds and smoke-tests the Docker image. Successful main runs publish commit-SHA and latest images to GHCR. Pull requests only validate.

The root `render.yaml` defines a free Docker web service in Frankfurt. Render builds the same repository commit with `portfolio/Dockerfile`, serves the frontend and API together, and uses `autoDeployTrigger: checksPass` to deploy after GitHub checks succeed. GHCR images are available separately; Render does not need registry credentials. The first Blueprint deployment is a bootstrap deployment, so create it from a commit whose CI has passed.

## Activate deployment

1. Push the project and workflow to GitHub and verify both build and container jobs pass.
2. Connect GitHub to Render, choose New > Blueprint, and select Jameslurtin/Portfolio with the root `render.yaml`.
3. Enter `RESEND_API_KEY` privately when prompted. The Blueprint selects the free plan and HTTPS email provider. No SMTP password or Vercel token is needed in Render.
4. Wait for the service to become Live. Check its generated HTTPS URL, `/healthz`, project dialogs, and one contact-form submission.
5. Future main commits deploy automatically after checks pass. Confirm this setting in Render before relying on the deployment gate.

Free services sleep after 15 minutes idle and may take about a minute to wake. Free Render blocks SMTP ports, so production email uses Resend. Register Resend as jameslurtin@gmail.com to use onboarding@resend.dev for delivery to that same address, or configure EMAIL_FROM with a verified domain. See EMAIL_SETUP.md.

Local files alone do not activate hosting. Render account access and the Resend key are required. No secrets belong in Git, Docker images, frontend variables, or chat.

To roll back, revert the relevant commit and push to main, then let checks and Render deploy finish.

References: https://render.com/docs/blueprint-spec and https://render.com/docs/free
