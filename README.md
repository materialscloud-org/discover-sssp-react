# React Materials Cloud discover app for SSSP

A [React](https://reactjs.org/) app for standard solid-state pseudopotentials (SSSP).

Published to https://materialscloud-org.github.io/discover-sssp-react/

The `src/data` subfolder is populated based on the [discover-sssp-data](https://github.com/materialscloud-org/discover-sssp-data) repository.
The `metadata.json` file is modified by replacing keys with the `short_name` field.

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

To publish the current local version to GitHub pages:

```bash
> npm run deploy
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list