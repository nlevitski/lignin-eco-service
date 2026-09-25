# 🚀 Getting started with Strapi

This project uses Node.js 24 and pnpm 10. With `fnm` installed, run:

```sh
fnm use
pnpm install --frozen-lockfile
```

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
pnpm dev
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
pnpm start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
pnpm build
```

## Docker deployment

The production image uses Node.js 24 and builds the Strapi admin panel for
`https://lignineco.com`. Set the required secrets in `.env` on the Docker host;
the file is excluded from the image.

Prepare the two bind-mounted data directories before the first start:

```sh
mkdir -p .tmp public/uploads
docker network inspect lignin
```

If `lignin` does not exist yet, create it once with `docker network create lignin`.

The container runs as UID 1000 (`node`), which needs write access to `.tmp` and
`public/uploads`. On a Linux host, adjust these directories' ownership if needed.
The GitHub Actions workflow does not transfer the SQLite database or uploaded
files. When moving from the old VPS, transfer the production database once to
`~/lignineco/service/.tmp/data.db` on the new VPS and the matching uploads to
`~/lignineco/service/public/uploads/`, before the first deployment. Find the
actual database and uploads paths on the old VPS from that container's mounts.
Create a consistent snapshot of a live SQLite database with `sqlite3`'s
`.backup` command before transferring it. Make the destination writable by UID
1000, then start the service with `docker compose up -d --build`. Later
deployments leave both directories on the new VPS untouched.

Traefik reaches the container on port 1337 through the external `lignin` network.
Compose does not publish a host port, so another container may also use port 1337.
Do not run this Compose service alongside `pnpm start` against the same SQLite
file. Traefik routes only the Strapi paths; the frontend needs its own router.

### GitHub Actions deployment

The `Deploy` workflow runs after a push to `main` or from the Actions tab. It
uses the repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and `VPS_PATH`.
`VPS_PATH` may be an absolute path or start with `~/`, for example
`~/lignineco/service`. The workflow copies this commit to the VPS, preserves
`.env`, `.tmp`, `public/uploads`, and `backups`, then builds and starts Compose.
Other files under `VPS_PATH` that are absent from the repository are removed
by `rsync --delete`.
`VPS_SSH_KEY` must be a private key authorized for `VPS_USER` on that VPS.
The VPS must already have Docker Compose, `rsync`, the external `lignin`
network, a nonempty `.env`, and writable data directories. `VPS_USER` also
needs permission to run Docker and write to `VPS_PATH`. Transfer the production
database and uploads before triggering the first deployment: otherwise Strapi
will create a fresh empty SQLite database.

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
