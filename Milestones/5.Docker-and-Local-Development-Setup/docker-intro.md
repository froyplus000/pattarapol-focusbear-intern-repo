# Docker Intro

## What is Docker?

Docker is a platform for packaging software and all its runtime dependencies (OS packages, libraries, config) into **images**. When you run an image, you get a **container**—an isolated process with its own filesystem, network namespace, and environment.
Key pieces:

- **Dockerfile** → recipe for building an image.
- **Image** → immutable snapshot built from the Dockerfile layers.
- **Container** → a running instance of an image.
- **Registry** → where images are stored and pulled from (e.g., Docker Hub, ECR, GCR).
- **Docker Compose** → runs multiple containers together for local dev.

---

## Docker vs Virtual Machines

| Aspect          | Docker (containers)                           | Virtual Machine (VM)                              |
| --------------- | --------------------------------------------- | ------------------------------------------------- |
| Isolation       | Process-level isolation using the host kernel | Full OS virtualization with its own kernel        |
| Size/Start time | Small images, start in seconds                | Large disk images, slower boot                    |
| Resource usage  | Lightweight                                   | Heavier (RAM/CPU overhead for guest OS)           |
| Consistency     | Same image runs on any host with Docker       | Consistent, but heavier to share/distribute       |
| Typical use     | Dev/prod parity, microservices, CI/CD         | Full OS isolation, legacy OS, stronger boundaries |

---

## Why containerization helps a backend like Focus Bear’s

- **Dev/Prod parity**: the exact same image runs in development, CI, and production.
- **Reproducibility**: one command brings up API, DB, cache—no “works on my machine.”
- **Fast onboarding**: new devs run `docker compose up` instead of installing stacks locally.
- **Isolation**: different services and versions can coexist without conflicts.
- **CI/CD friendly**: images are versioned artifacts that can be built, tested, scanned, and deployed.

---

## How containers keep environments consistent

- **Pinned base images** (e.g., `node:20-alpine`) lock OS and runtime versions.
- **Layered builds** make installs repeatable (lockfiles for packages).
- **Compose files** declare every dependent service (DB, cache, queues) with fixed versions.
- **Immutable artifacts**: once an image passes CI tests, the same artifact goes to staging/production.

---

## How Focus Bear typically uses Docker (pattern)

- Backend services (API, workers) are **containerized**.
- Local development uses **Docker Compose** to run the API alongside dependencies (e.g., Postgres/Redis).
- CI builds and tests the **same images** that ship to production.
- Configuration (ports, env vars, secrets) is injected at runtime, not baked into the image.

---

## Reflection

**How does Docker differ from a virtual machine?**
Docker uses the host kernel to isolate processes; VMs virtualize an entire OS with its own kernel. Containers start faster and use fewer resources, making them ideal for developing and deploying many small services. VMs provide stronger isolation at the cost of speed and footprint.

**Why is containerization useful for a backend like Focus Bear’s?**
It guarantees the same runtime across laptops, CI, and production; simplifies dependency setup; and lets services be built, tested, and deployed as versioned artifacts. This reduces integration risk and shortens feedback cycles.

**How do containers help with dependency management?**
Dependencies are installed inside the image during the build, so everyone runs with the same OS packages and library versions. Compose pins versions of databases and caches. No local system pollution, fewer “it works on my machine” bugs.

**What are the potential downsides of using Docker?**

- **Learning curve** for Dockerfiles, images, networks, and volumes.
- **Performance overhead** on macOS/Windows (Docker Desktop runs a lightweight VM).
- **Storage bloat** from many images/volumes if not cleaned.
- **Operational complexity** when scaling/orchestrating (health checks, secrets, networking, Kubernetes).
- **Debugging nuances** (container logs, exec into containers, file permissions).

---
