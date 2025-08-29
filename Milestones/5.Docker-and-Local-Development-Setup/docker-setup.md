# Reflection

## What is the difference between docker run and docker compose up?

- docker run starts one container from an image with flags you pass on the command line.

- docker compose up reads a YAML file that defines multiple services (containers), their networks, volumes, and environment, and starts them together with a single command.

## How does Docker Compose help when working with multiple services?

Compose acts as a project manifest: one file declares each service (API, Postgres, Redis), pinned versions, ports, volumes, and dependencies. You get one-command lifecycle management (up, down, restart, logs, ps) and built-in networking so services can reach each other by name (for example, the Adminer UI connects to the database at db).

## What commands can you use to check logs from a running container?

- Single container: docker logs <container> or docker logs -f <container> to follow.
- With Compose: docker compose logs or docker compose logs -f db for a specific service.

## What happens when you restart a container? Does data persist?

Restarting a container keeps its writable layer and reuses attached volumes, so state normally persists across restarts. Data durability depends on storage:

- Named volumes / bind mounts: data persists across restarts and even docker compose down.

- Ephemeral container filesystem only: data is lost if the container is removed. In the demo, Postgres uses a named volume (db-data), so tables survive restarts and compose down (but not compose down -v, which deletes the volume).
