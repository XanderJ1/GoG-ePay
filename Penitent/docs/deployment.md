# Deployment

## Local containers
Copy .env.example to .env and set unique local credentials. Run docker compose up --build. Open http://localhost:5173. The database uses port 55432 and API port 5080 on loopback only. Stop the independently started penitent-postgres development container first if it owns port 55432. Volumes preserve inventory, carts, and protection keys.

The Compose environment is Development for local HTTP cookies. Do not use it unchanged for an internet-facing deployment.

## Render
render.yaml defines two separate paid Docker web services, PostgreSQL, and an API key disk. No Render resources have been created.

1. Obtain the client's written scope, start date, hosting budget, and access-duration agreement.
2. Push this repository to an agreed private Git host. Connect it to Render and review current service/database/disk pricing before creating the Blueprint.
3. Supply Admin__Email and a strong Admin__Password privately. The Blueprint generates the proxy secret and forwards it only to the server-side frontend.
4. Verify DATABASE_URL, API_HOSTPORT, and API_PROXY_KEY references. API_HOSTPORT identifies the API service's private hostname and HTTP port. The frontend uses HTTP on Render's private network and authenticates with the proxy key.
5. Verify both health checks, login/logout, bag persistence, checkout preview, and the storefront after an admin stock change.
6. Re-deploy and confirm old bags and admin sessions still work. Check disk/database backups and retention.
7. Share the hosted frontend URL and admin credentials through the agreed private channel.

The API's /health route is public; other production routes require the proxy secret. Inspect production OpenAPI by requesting it with the secret from a trusted terminal, or use the checked-in contract. Never put the secret in client code.

## CI
The included workflow starts PostgreSQL, runs integration tests, builds/checks the frontend, audits dependencies, and runs browser journeys. Admin browser credentials are provided through CI environment variables. Browser tests should target a disposable seeded database, never a shared client demo.

## Hosting blockers
External repository/account access, paid-resource approval, and client delivery dates are not available in this workspace. A hosted internet URL and client agreement cannot be claimed until these steps are complete.


## Repository layout
This project currently lives under the parent GoG ePay Git repository. The workflow and Blueprint assume this directory becomes the root of the agreed handover repository. If retained as a subdirectory, set the Render build root to Penitent and move the workflow to the parent repository workflow folder with matching working-directory paths before enabling CI.
