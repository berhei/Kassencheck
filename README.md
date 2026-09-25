# Kassencheck

Kassencheck is a browser-based tool for counting the full physical contents of one euro cash register. It totals coins from 10 cents to 2 euros and banknotes from 5 to 200 euros. An optional manually entered expected balance shows the signed difference; the app does not calculate balances from transactions.

![Test and deploy status](https://github.com/berhei/Kassencheck/actions/workflows/deploy.yml/badge.svg)

## Use

Open the [GitHub Pages site](https://berhei.github.io/Kassencheck/), enter the quantities per denomination using the numeric keyboard or plus/minus controls, and optionally enter a register label, counter name, and expected balance. The counter name and register label are not required. The interface defaults to German and can be switched to English. The moon/sun button toggles dark mode; the first visit follows the device setting, and your choice is remembered in this browser. The image record remains light for readability. Money, dates, and the exported image follow the selected language.

The total and, when an expected balance is provided, the difference update immediately. All eleven denominations appear in the image record, including quantities of zero. The record has a creation timestamp and contains no input controls. Use **Share** to send the PNG through a supported browser's native share sheet (including compatible iOS browsers), or **Save PNG** to download it. If file sharing is unavailable, use the download button.

One draft is kept in this browser's local storage and survives a reload. **New count** asks before replacing it; **Delete draft** asks before clearing it. Exporting does not remove the draft. This is not an audit-proof record or a stored history: download or share the image if you need to keep it. Anyone with access to the same browser profile can see the draft, including an optional counter name. The application has no accounts, server storage, or backend. A network connection is needed to load the site; offline startup is not provided.

## Development

Requires Node.js 22 or later. From the project root:

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run dev` starts Vite locally. `npm test` runs the Vitest calculation and draft-validation tests. `npm run build` typechecks the code and generates the static site in `dist/`. Vite uses relative asset paths so the result also works under a GitHub Pages project subpath. No backend or environment variables are needed.

## Deployment

1. Push the repository to GitHub with `main` as the default branch.
2. In **Settings > Pages > Build and deployment**, select **GitHub Actions** as the source.
3. The status badge above will start reporting results after the first workflow run.

The [Test and deploy workflow](.github/workflows/deploy.yml) runs on pull requests, pushes to `main`, and manual dispatch. It installs dependencies from the lockfile, runs tests, then typechecks and builds. A push or manual run deploys to GitHub Pages only if those checks succeed. Pull requests are checked but never deployed. The badge reports the workflow status; a failed test or build prevents publication.
