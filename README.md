# fm-mock-example

This example shows how to use fm-mock and fm-gofer together to develop fm
webviewer widgets in a browser.

The mocks you define inside the `if (import.meta.env.DEV) {...}` block will be
removed automatically by vite when you do `npm run build` for production. That
means you can develop the UI in your browser, mocking FM scripts and then, when
ready, build for production and test in your fm app.

![fm-mock-example](./readme-files/fm-mock-example.png)

## Install deps

```bash
npm install
```

## DEV in browser

```bash
npm run dev
```

## Build single html file for production

```bash
npm run build
```

then check the 'dist' folder for the single html file.
