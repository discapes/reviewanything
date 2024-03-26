# reviewanything

- Install dependencies with `pnpm install`
- Download SVG icons with `node export-svg.mjs`
- Start Postgres and Keycloak with `docker compose up`
- Create a keycloak realm and client named `reviewanything`
- Copy `.env.example` to `.env`
- Start the dev server with `pnpm run dev`
- Build for production with `pnpm run build`
