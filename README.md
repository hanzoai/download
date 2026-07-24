# @hanzo/download

The **canonical Hanzo download + install catalog** — the ONE source of truth for
every download link (desktop, mobile, browser extensions, editors, CLI, SDKs) and
every third-party integration (the `/install` catalog).

Data-first and framework-agnostic (same pattern as `@hanzo/plans`), so
**hanzo.chat**, **hanzo.app**, **hanzo.ai** and any Hanzo surface render the SAME
links — no per-app drift. Static hrefs point at the always-current
`releases/latest` assets, so a page is correct with zero network;
`resolveLatest()` optionally decorates them with the live version from
`api.hanzo.ai/v1/releases`.

```ts
import {
  downloads, integrations, desktop, mobile, extensions, cli, sdks,
  detectPlatform, primaryDesktop, integrationsByCategory, resolveLatest,
} from "@hanzo/download";

// Feature the right button for the visitor's OS:
const os = detectPlatform(navigator.userAgent);   // "macos" | "windows" | …
const main = primaryDesktop(os, navigator.userAgent); // the matching desktop asset

// Live version for display (fails soft to static):
const { version, desktop } = await resolveLatest();
```

## Exports

| Export | What |
|---|---|
| `downloads` | full first-party catalog `{ desktop, mobile, extensions, editors, cli, sdks }` |
| `integrations` | install catalog `{ categories, items }` |
| `desktop` / `mobile` / `extensions` / `editors` / `cli` / `sdks` | direct arrays |
| `detectPlatform(ua)` | OS from a UA string |
| `primaryDesktop(platform, ua)` | the one desktop asset to feature |
| `integrationsByCategory(id?)` | install items for a category |
| `resolveLatest(fetch?)` | decorate desktop with live `api.hanzo.ai` version |

Raw JSON is also importable: `@hanzo/download/downloads.json`,
`@hanzo/download/integrations.json`.

## Rendering

The designed **`<HanzoDownload>`** and **`<HanzoInstall>`** pages live in
`@hanzogui/shell` and consume this data, so every property mounts the same
polished page at `/download` and `/install`. This package is data only.
