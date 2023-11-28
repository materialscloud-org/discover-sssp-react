# React Materials Cloud discover app for SSSP

A [React](https://reactjs.org/) app for standard solid-state pseudopotentials (SSSP).

Published to https://materialscloud-org.github.io/discover-sssp-react/

The `src/data` subfolder is populated based on the [discover-sssp-data](https://github.com/materialscloud-org/discover-sssp-data) repository.
The `metadata.json` file is modified by replacing keys with the `short_name` field.

## Development

For local development:

```
> npm install
> npm start
```

To publish a new version to GitHub pages:

```
> npm run deploy
```
