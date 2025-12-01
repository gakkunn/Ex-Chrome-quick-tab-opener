# Quick Tab Opener

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Overview

Quick Tab Opener is a Chrome extension that enables you to open single URLs or groups of URLs using fully customizable keyboard shortcuts. Access your favorite websites instantly without manual typing or bookmark navigation.

This is an open-source extension implemented based on Chrome Extension Manifest v3.

---

## Features

- **9 URL Slots**: Store individual URLs that open with single keyboard shortcuts
- **9 URL Groups**: Create groups of up to 10 URLs that open together
- **Fully Customizable Shortcuts**: Configure any keyboard combination via Chrome settings
- **Tab Pinning**: Option to automatically pin opened tabs
- **Smart URL Handling**: Accepts both full URLs and domain names (auto-converts to HTTPS)
- **Settings UI**: Easy-to-use popup interface (default: Ctrl+Shift+0)
- **Badge Notifications**: Visual reminder when shortcuts need configuration
- **Chrome Sync**: Settings automatically sync across your signed-in devices
- **Zero Dependencies**: Lightweight, fast, and secure

---

## Screenshots

_(Screenshots will be added in a future update)_

---

## Installation

> Not yet published to the Chrome Web Store.
> You can use it via "Local Installation (Developer Mode)" below.

### 1. Clone the repository

```bash
git clone https://github.com/gakkunn/Ex-Chrome-quick-tab-opener.git
cd Ex-Chrome-quick-tab-opener
```

### 2. Install dependencies & Build

```bash
npm install
npm run build
```

### 3. Install to Chrome (Developer Mode)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Toggle **"Developer mode"** on in the top right corner
4. Click **"Load unpacked"**
5. Select the **`dist/`** folder from this project

---

## Usage

1. After installing the extension, pin the icon from the Chrome toolbar.
2. Click the icon or press **Ctrl+Shift+0** (or **MacCtrl+Shift+0** on Mac) to open settings.
3. Configure your URL slots and groups:
   - **Slots**: Enter single URLs (e.g., `https://github.com` or just `github.com`)
   - **Groups**: Enter up to 10 URLs per group
4. Go to `chrome://extensions/shortcuts` to set keyboard shortcuts for each slot and group.
5. Recommended shortcuts:
   - **Slots**: Ctrl+1 through Ctrl+9
   - **Groups**: Ctrl+Shift+1 through Ctrl+Shift+9
6. Press your configured shortcuts to instantly open URLs!

**Tips**:
- Enable "Pin tabs by default" to automatically pin all opened tabs
- Domain names (e.g., `example.com`) are automatically converted to HTTPS URLs
- The extension badge shows a red "!" if no shortcuts are configured yet

---

## Development

### Prerequisites

- Node.js >= 18
- npm

### Setup

```bash
git clone https://github.com/gakkunn/Ex-Chrome-quick-tab-opener.git
cd Ex-Chrome-quick-tab-opener

npm install
npm run watch   # For development with auto-rebuild
```

### Build Commands

- `npm run build` - Production build (minified)
- `npm run watch` - Development build with auto-reload
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format with Prettier
- `npm run format:check` - Check formatting
- `npm run check` - Run lint + format checks
- `npm run typecheck` - TypeScript type checking

### Testing Changes

1. Make code changes in the `src/` directory
2. Build updates with `npm run build` (or use `npm run watch` for auto-rebuild)
3. Go to `chrome://extensions/` and click the refresh icon for Quick Tab Opener
4. Test your changes

---

## Project Structure

```text
Ex-Chrome-quick-tab-opener/
  src/                  # Extension source code
    background/         # Service worker (command handling)
      background.ts     # Keyboard command event handling
    popup/              # Settings UI logic
      popup.ts          # Configuration interface
    styles/             # CSS styles
      popup.css         # UI styling
    types/              # TypeScript type definitions
      storage.ts        # Storage type definitions
    utils/              # Utility functions
      storage.ts        # Chrome storage utilities
      url.ts            # URL validation and normalization
  public/               # Static files
    popup.html          # Settings UI HTML
    manifest.json       # Extension manifest (v3)
    icons/              # Extension icons (16, 48, 128px)
  dist/                 # Build output (load this in Chrome)
  package.json          # Dependencies and scripts
  tsconfig.json         # TypeScript configuration
  .eslintrc.cjs         # ESLint configuration
  .prettierrc           # Prettier configuration
```

---

## Contributing

Bug reports, feature suggestions, and pull requests are welcome!

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

Quick steps:

1. Check Issues; create a new one if it doesn't exist
2. Fork the repository
3. Create a branch (e.g., `feat/xxx`, `fix/yyy`)
4. Commit changes and push
5. Create a Pull Request

---

## License

This project is released under the [MIT License](./LICENSE).
