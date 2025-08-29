# Docker + PostgreSQL — Reflection

## What I set up

- A `docker-compose.yml` that runs `postgres:16-alpine` with:

  - user `app`, password `secret`, database `appdb`
  - a named volume `pgdata` mounted at `/var/lib/postgresql/data`

- Connected two ways:

  - `psql` inside the container (`docker compose exec -it postgres psql -U app -d appdb`)
  - pgAdmin in the browser

- Created a table and row (`CREATE TABLE demo…; INSERT INTO demo…;`) and verified it.

---

## What are the benefits of running PostgreSQL in a Docker container?

- **Consistency:** everyone runs the exact same Postgres version/config; fewer “works on my machine” issues.
- **Easy setup/teardown:** one command to start; remove it without polluting the host OS.
- **Isolation:** Postgres and its dependencies don’t conflict with anything else on my machine.
- **Reproducibility:** the same image can be used locally, in CI, and in production.

---

## How do Docker volumes help persist PostgreSQL data?

- The compose file maps a **named volume** (`pgdata`) to Postgres’s data directory.
- Because data lives in the volume (not the container’s ephemeral layer), it **survives restarts** and `docker compose down`.
- Data is only removed if I explicitly delete the volume, e.g.:

  ```bash
  docker compose down -v
  ```

- I proved this by inserting a row into `demo`, restarting the container, and selecting the row again—it was still there.

---

## How can you connect to a running PostgreSQL container?

- **From inside the container (always works):**

  ```bash
  docker compose exec -it postgres psql -U app -d appdb
  ```

- **From the host (if psql is installed):**

  ```bash
  PGPASSWORD=secret psql -h localhost -p 5432 -U app -d appdb
  ```

- **From another container (pgAdmin UI):**

  - Host: `postgres` (service name on the Compose network)
  - User: `app`, Password: `secret`, Database: `appdb`

> Key idea: inside the Compose network you use the **service name** (`postgres`), but from your laptop you use **localhost:5432** because of the published port.

---

## What happens when you restart the container? Does data persist?

- Restarting the container keeps the volume attached, so data persists:

  ```bash
  docker compose restart postgres
  ```

- After restarting, the `demo` table and its row were still present.
- Data only disappears if I remove the volume with `docker compose down -v`.

---

## Commands I found useful

```bash
docker compose up -d         # start services
docker compose ps            # see status
docker compose logs -f postgres
docker compose exec -it postgres psql -U app -d appdb
docker compose restart postgres
docker compose down          # stop/remove containers (keeps volume)
docker compose down -v       # stop + remove volume (deletes data)
```

**Takeaway:** Running Postgres in Docker gave me a clean, repeatable environment; volumes made persistence explicit and easy to reason about; and connecting via both `psql` and pgAdmin clarified how networking works inside and outside Compose.
