# PENITENT

A backend-first clothing demo: SvelteKit 3 / TypeScript, ASP.NET Core .NET 10, EF Core, PostgreSQL 17. Original editorial storefront, 12 seeded products, protected catalogue/inventory admin, persistent guest carts, and checkout preview only.

## Local preview
The development preview is at http://localhost:5173 while the local services are running. Admin is at /admin. A random local password was saved to the ignored backend/Penitent.Api/.env.local; do not share this file or commit it.

## Run from a clean checkout
Prerequisites: .NET 10 SDK, Node 24+, Docker.
1. Copy .env.example to .env and configure local database/admin credentials.
2. Run docker compose up --build.
3. Open http://localhost:5173.

For native development, start PostgreSQL 17 on port 55432, set backend environment variables from backend/Penitent.Api/.env.example, and run dotnet run --project backend/Penitent.Api --no-launch-profile. Run npm ci in frontend and npm run dev. The API URL must be http://localhost:5080 (set ASPNETCORE_URLS). API_ORIGIN can override the proxy target when exported to the frontend process.

The PowerShell helper scripts/start-api.ps1 starts the native API from the repository root. It reads ignored local admin credentials, creating random ones on first launch. scripts/start-storefront.ps1 starts the frontend.

## Verify
- dotnet test backend/Penitent.Tests
- npm --prefix frontend run check
- npm --prefix frontend run build
- npm --prefix frontend run test
- npm --prefix frontend audit
- dotnet list backend/Penitent.Api package --vulnerable --include-transitive

Backend tests create/drop their own disposable database; the PostgreSQL user must have CREATEDB permission. Override the local connection with TEST_POSTGRES. Browser tests require the running seeded API/storefront and local admin credentials or E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD.

## API contracts
Install tools dependencies with npm --prefix tools ci, run the API, then npm --prefix frontend run generate:api. OpenAPI: http://localhost:5080/openapi/v1.json. No frontend code can set product prices or access PostgreSQL.

## Documentation
- docs/client-scope.md — client agreement draft
- docs/architecture.md — database diagram and backend rules
- docs/deployment.md — local containers and Render handover
- docs/walkthrough.md — review demonstration
- docs/verification.md — executed checks and remaining limits
- docs/references.md — reference inspection and asset sources

This demo does not create orders, accept payments, reserve stock, or store checkout addresses. Final brand imagery, product measurements, commercial policies, and production commerce integrations are future work.

