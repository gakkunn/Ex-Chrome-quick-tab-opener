# Contributing

Thank you for your interest in contributing to Quick Tab Opener!
This document explains the basic flow for contributing. Keep it simple and feel free to adjust this file for your project.

---

## How to report bugs and request features

- For **bugs**, please open a new Issue and use the **"Bug report"** template.
- For **feature requests or improvements**, please use the **"Feature request"** template.
- Before creating a new Issue, please check if a similar Issue already exists.

When filing an Issue, try to include:

- A clear and concise summary
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots or console logs, if helpful
- Your environment (OS, Chrome version, extension version)

---

## Development setup

1. **Fork** this repository and **clone** your fork locally:

   ```bash
   git clone https://github.com/your-username/Ex-Chrome-quick-tab-opener.git
   cd Ex-Chrome-quick-tab-opener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Open the project in your editor and make sure you can see the `src/` directory.

---

## Running the extension locally in Chrome

1. Build the extension:

   ```bash
   npm run build
   ```

   For development with auto-rebuild on file changes:

   ```bash
   npm run watch
   ```

2. Open the extensions page in Chrome:

   - Enter `chrome://extensions/` in the address bar
   - Toggle **"Developer mode"** on in the top right corner
   - Click **"Load unpacked"**

3. Select the **`dist/`** folder of this repository.

4. When you change the code, the `watch` command will auto-rebuild. Press **"Update"** (or the refresh icon) on the extensions page to reload the extension and verify the behavior.

---

## Coding style & guidelines

- Follow the existing code style (indentation, naming, file structure, etc.).
- This project uses ESLint and Prettier. Before committing, please run:

  ```bash
  npm run check
  ```

  This will run both linting and format checks. To auto-fix issues:

  ```bash
  npm run lint:fix
  npm run format
  ```

- Aim for small and clear commit messages.

Example:

```bash
git commit -m "Fix: handle null tab in background script"
```

---

## Making changes

1. Create a branch from `main`:

   ```bash
   git switch -c feature/update-popup-ui
   ```

2. Make necessary changes under `src/`. Run tests or type checks as needed:

   ```bash
   npm run typecheck
   npm run check
   ```

3. Commit with a message explaining your changes.

4. Push to your GitHub repository:

   ```bash
   git push origin feature/update-popup-ui
   ```

---

## How to submit a Pull Request

1. Create a **Pull Request (PR)** on GitHub from your branch to the `main` branch of this repository.
2. In the PR body, fill it out according to the provided **Pull Request Template**:
   - Summary of changes
   - Key changes
   - Related Issues (e.g., `Closes #123`)
   - Details of tests or manual verification performed
3. If you receive review comments, make necessary corrections and push to the same branch. The PR will be updated automatically.

---

## Thank you

Thank you for considering contributing to Quick Tab Opener!
Bug reports, suggestions, document fixes, and any small contributions are welcome.
