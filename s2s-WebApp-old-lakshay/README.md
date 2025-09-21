# Fullstack TypeScript Project

A fullstack example of a pnpm workspace with TypeScript code.

There are separate projects for the frontend and backend and a sub-project for validation that is shared between frontend and backend.

## Project layout

```

└───typescript
    │   package.json        Root project metadata.
    │    pnpm-lock.yaml      Dependencies lockfile.
    │   pnpm-workspace.yaml Pnpm workspace configuration.
    │
    ├───frontend            The frontend admin/client project.
    │   └───src                    Source code.
    └───packages
        └───authorization      A sub-package for FGA CRUD operations that
            └───src            is shared between frontend and backend.
        └───embeddings         A sub-package for generating embeddings
            └───src            is shared between frontend and backend.
        └───elasticsearch      A sub-package for fetching data from elastic.
            └───src            is shared between frontend and backend.
        
```

## Setup

Install dependencies:

```bash
cd typescript
pnpm install
```

## Build the code

Build all packages:

```bash
pnpm run build
```

## Clean generated files

```bash
pnpm run clean
```

## Run in production

Run the fullstack application in production mode (well, simulating production):

```bash
pnpm start
```

## Run in development

Run the fullstack application in development mode (with live reload enabled in the backend):

```bash
pnpm run start:dev
```

Point your browser at http://localhost:1234 to see the frontend.

Use `./backend/test/backend.http` to try out HTTP requests against the backend REST API.
