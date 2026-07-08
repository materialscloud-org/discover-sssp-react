# React Materials Cloud discover app for SSSP

A [React](https://reactjs.org/) app for standard solid-state pseudopotentials (SSSP).

## Development

For local development:

```bash
> npm install
> npm start
```

To build locally and preview (e.g. before deploying), use

```bash
> npm run build
> npm run preview
```

## Deployment

Cloudflare is used to automatically deploy:

- Production (`main` branch) to
  - https://discover-sssp-react.pages.dev

- Development (`develop` branch) to
  - https://develop.discover-sssp-react.pages.dev

And any other branch will be deployed as (note that symbols like `_` and `/` get replaced by `-`):

- e.g. `branch_name/1` -> `https://branch-name-1.discover-sssp-react.pages.dev`
