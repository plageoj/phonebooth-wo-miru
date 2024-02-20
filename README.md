# ts-crx

Chrome extension template with TypeScript

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Development

### Environment requirements

- Node.js 18+
- Latest Chrome / Edge

### Setting up

```bash
git clone git@github.com:plageoj/ts-crx.git
cd ts-crx
npm install
```

### Build

Run this command to build the extension in local dist folder.

```bash
npm run build
```

### Registering debug extension

By running build command, `/dist` folder is created under the project root.
Open [chrome://extensions](chrome://extensions), enable developer mode,
then press [Load unpacked] button and select the `dist` folder.
Your extension will be ready as an unpacked extension.

### Watch mode

This command detects the changes of source code and re-build the extension automatically.

```bash
npm run dev
```

Press the reload button on the extension page to apply the changes.

## Deployment

This template has a GitHub Actions script to deploy the extension automatically to the Chrome Web Store.

### Short instructions

1. Enable [Chrome Web Store Publish API](https://developer.chrome.com/docs/webstore/using-api).
1. Follow the README of [cardinalby/webext-buildtools-chrome-webstore-action](https://github.com/cardinalby/webext-buildtools-chrome-webstore-upload-action) and set `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` secrets.
1. Push a tag named like `v0.0.0`.
