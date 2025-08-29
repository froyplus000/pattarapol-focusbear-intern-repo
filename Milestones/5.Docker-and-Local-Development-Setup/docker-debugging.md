# Debugging & Managing Docker Containers

## See what’s running

```bash
docker ps                      # running containers
docker compose ps              # running services in the current compose project
docker inspect <container>     # full JSON (env, mounts, networks, health)
docker top <container>         # processes inside the container
docker stats                   # live CPU/RAM/IO usage
docker port <container>        # which host ports map to container ports
```

## Read logs

```bash
docker logs <container>        # show logs
docker logs -f <container>     # follow logs (like tail -f)
docker compose logs -f         # follow ALL services in this compose project
docker compose logs -f api     # follow a single service (e.g., “api”)
```

## Get a shell inside a container

```bash
docker exec -it <container> sh     # or bash if available
# examples once inside:
env                                 # view env vars
ls -la /app                         # inspect filesystem
cat /app/.env                       # verify config (if baked/mounted)
```

**exec vs attach (short):**

- `docker exec -it <c> sh` starts a **new** shell process in the container. Safe and preferred.
- `docker attach <c>` attaches to the **main process’s** stdio. Risky (you can freeze/kill the main process); seldom needed for app debugging.

## Restart, remove, rebuild

```bash
docker restart <container>          # restart one container (fast)
docker compose restart <service>    # restart a service in this project

docker compose up -d                # start (create if missing)
docker compose up -d --build        # rebuild image(s) then start
docker compose build --no-cache api # force clean rebuild of one service

docker stop <container>             # stop
docker rm <container>               # remove stopped container

docker compose down                 # stop & remove containers, keep volumes
docker compose down -v              # also remove named volumes (DATA LOSS)
```

## Example: verify Postgres service

```bash
docker compose ps
docker compose logs -f postgres
docker compose exec postgres pg_isready -U app -d appdb
docker compose exec -it postgres psql -U app -d appdb -c "SELECT now();"
```

---

# Troubleshooting DB connection in a containerized NestJS app

1. **Check logs first**

```bash
docker compose logs -f api
docker compose logs -f postgres
```

Errors like `ECONNREFUSED` or `getaddrinfo ENOTFOUND` indicate port/DNS issues; auth errors indicate credentials/DB mismatch.

2. **Use service names, not localhost**

- Inside Compose, connect to `postgres:5432` (service name), not `localhost`.
- Example URL:

  ```
  DATABASE_URL=postgresql://app:secret@postgres:5432/appdb
  ```

3. **Verify env vars inside the API container**

```bash
docker compose exec api env | grep -E 'DB|DATABASE|POSTGRES'
```

Make sure values match your `docker-compose.yml`.

4. **Test connectivity from inside the API container**

```bash
docker compose exec api sh -lc "apk add --no-cache postgresql-client || true; pg_isready -h postgres -p 5432 -U app -d appdb"
docker compose exec api sh -lc "nc -zv postgres 5432 || true"  # if netcat is available
```

5. **Database readiness**

- `depends_on` does not wait for DB readiness. Add a **healthcheck** to Postgres (as you did) and have the API wait/retry until healthy, or use a small wait-for script.

6. **Migrations/permissions**

- If NestJS (TypeORM/Prisma) runs migrations at startup, check those logs for schema/permissions errors.

7. **Rebuild when code or Dockerfile changes**

```bash
docker compose up -d --build api
```

---

# Reflection

## How can you check logs from a running container?

Use `docker logs` for single containers and `docker compose logs` for services in a Compose project. Add `-f` to follow in real time. Examples:

```bash
docker logs -f <container>
docker compose logs -f api
docker compose logs -f postgres
```

This is the fastest way to see startup errors, stack traces, and connection failures.

## What is the difference between `docker exec` and `docker attach`?

- `docker exec -it <container> sh` starts a new shell process inside the container. It’s isolated from the main process and is the safe, preferred way to inspect files, check env vars, or run quick commands.
- `docker attach <container>` connects your terminal to the container’s main process. It can interfere with that process and is rarely needed for application debugging.

## How do you restart a container without losing data?

Restart the container or service:

```bash
docker restart <container>
docker compose restart <service>
```

Data persists because it lives in named volumes (for Postgres, the volume mounted at `/var/lib/postgresql/data`). Avoid `docker compose down -v`, which deletes volumes and their data.

## How can you troubleshoot database connection issues inside a containerized NestJS app?

- Check logs for both the API and the DB to identify auth/DNS/port errors:

  ```bash
  docker compose logs -f api
  docker compose logs -f postgres
  ```

- Ensure the API uses the **service name** (`postgres`) in its connection URL, not `localhost`:

  ```
  postgresql://app:secret@postgres:5432/appdb
  ```

- Verify environment variables **inside** the API container:

  ```bash
  docker compose exec api env | grep -E 'DB|DATABASE|POSTGRES'
  ```

- From the API container, test connectivity:

  ```bash
  docker compose exec api sh -lc "pg_isready -h postgres -p 5432 -U app -d appdb"
  ```

- If the DB starts slower than the API, add a Postgres **healthcheck** and make the API retry until the DB is ready. Rebuild the API container after changes:

  ```bash
  docker compose up -d --build api
  ```

**Takeaway:** Use logs for fast feedback, `exec` for hands-on inspection, and Compose commands for lifecycle control. Keep data in named volumes so restarts and rebuilds don’t wipe your database.
