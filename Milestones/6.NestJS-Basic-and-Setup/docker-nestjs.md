# Docker + NestJS Reflection

## How does a Dockerfile define a containerized NestJS application?

- Starts from a Node base image (e.g., `node:20-alpine`) and sets `WORKDIR /app`.
- Installs dependencies from `package*.json`, builds the app (`npm run build`), exposes the port, and defines the start command (`CMD ["node","dist/main.js"]`).
- In our setup we also added a **dev target** that runs `npm run start:dev` for hot-reload.

## What is the purpose of a multi-stage build in Docker?

- **Separate build from runtime**: one stage installs deps and compiles TypeScript; the final stage contains **only** compiled `dist/` + **prod** `node_modules`.
- Results: **smaller, faster, safer** images (no dev tools/TS), reproducible installs with `npm ci`.

## How does Docker Compose simplify running multiple services together?

- One YAML describes **API + Postgres**, their env vars, ports, volumes, and start order.
- Built-in network means services talk by **name** (API connects to DB at `db:5432`, not `localhost`).
- `depends_on` + **healthcheck** ensure API waits for DB readiness.
- **Profiles** switch modes: `api-dev` (hot reload) vs `api` (optimized runner) with:

```bash
docker compose --profile dev up -d --build
docker compose --profile prod up -d --build
```

## How can you expose API logs and debug a running container?

- **Logs**: `docker compose --profile dev logs -f api-dev` or `--profile prod logs -f api`.
- **Shell in**: `docker exec -it <api-container> sh`.
- **Inspect DB**: `docker exec -it pg psql -U appuser -d appdb -c "SELECT NOW();"`

## What I verified in this task

- Dev mode hot-reload works; prod image runs `node dist/main.js`.
- API successfully reaches Postgres via `DB_HOST=db`, and endpoints (`/users`) respond after creating data.
