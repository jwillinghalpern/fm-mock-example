# fm-gofer-example

This example shows how to use fm-mock and fm-gofer together to develop fm
webviewer widgets in a browser.

The mocks you define inside the `if (import.meta.env.DEV) {...}` block will be
removed automatically by vite when you do `npm run build` for production. That
means you can develop the UI in your browser, mocking FM scripts and then, when
ready, build for production and test in your fm app.
