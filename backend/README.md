# Backend Notes

This backend supports both SQLite (local dev) and Postgres (production / Supabase) via `DATABASE_URL`.

Quick setup:

- For local dev (default): use `DB_PATH=./database/dev.sqlite` in `.env`.
- For Supabase / Postgres: set `DATABASE_URL` in `.env` to your Postgres connection string. If your DB requires SSL, set `DB_SSL=true`.

Server-side token transfers

- If you want the backend to send tokens (custodial reward distribution), set `RPC_URL`, `PRIVATE_KEY`, and `TOKEN_ADDRESS` in env. Keep `PRIVATE_KEY` secret.
- If those env vars are not set, the backend will return a fake tx hash so flows keep working in dev.

Database migrations

- This project currently relies on `sequelize.sync()` to create tables on startup. For production, add proper migrations using `sequelize-cli` or umzug.
