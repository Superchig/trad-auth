# trad-auth

This SvelteKit project exists as a toy implementation for authentication.

## Dependencies

- [Just](https://github.com/casey/just)

## Developing

Install Javascript/Typescript dependencies:

```bash
npm install
```

Start a database instance:

```bash
scripts/init-db
```

Then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Database

- Postgres - DBMS
- Docker
- DBMate - Migrations

To set up DBMate properly, create an `.env` file with these contents:

```conf
DATABASE_URL=postgres://postgres:password@localhost:5432/trad-auth?sslmode=disable
```

Rather than using the typical `dbmate` command, use:

```
scripts/dbmate
```

## Environmental Variables

We may need to install dotenv and invoke it before running the built app in
production.

See https://kit.svelte.dev/docs/adapter-node#environment-variables.

## Fundamental Features

- [ ] "Traditional" Authentication
  - [x] Argon2 - password salting and hashing
  - [ ] Routes are protected
    - [x] SvelteKit routes redirect if not authenticated
    - [ ] tRPC routes are protected if not authenticated
- [x] Slonik connection
  - Slonik
- [x] Build process that does not require a running database
- [x] JSON Error Display
  - svelte-json-tree
- [x] Logging
  - Using HTTP logger handle taken from Reddit
- [x] Justfile
- [x] Earthfile
- [ ] Unit tests
  - [x] At least one test deletes all records before starting
  - [x] At least one test trivially interacts with the test database - See
    'accounts.ts' 'uses valid SQL'
  - [ ] At least one test meaningfully interacts with the test database
- [x] Tailwind
