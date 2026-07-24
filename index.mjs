// @hanzo/download — the canonical Hanzo download + install catalog.
//
// ONE source of truth for every download link (desktop, mobile, browser
// extensions, editors, CLI, SDKs) and every third-party integration (the /install
// catalog). Data-first + framework-agnostic (like @hanzo/plans), so hanzo.chat,
// hanzo.app, hanzo.ai and any surface render the SAME links — no per-app drift.
//
// Static hrefs point at the always-current `releases/latest` assets, so a page is
// correct with zero network. `resolveLatest()` optionally decorates them with the
// live version/date from api.hanzo.ai for display ("v2.4.1 · Jul 24").

import _downloads from './downloads.json' with { type: 'json' }
import _integrations from './integrations.json' with { type: 'json' }

/** The full download catalog: { desktop, mobile, extensions, editors, cli, sdks }. */
export const downloads = _downloads
/** The install/integrations catalog: { categories, items }. */
export const integrations = _integrations

export const desktop = _downloads.desktop
export const mobile = _downloads.mobile
export const extensions = _downloads.extensions
export const editors = _downloads.editors
export const cli = _downloads.cli
export const sdks = _downloads.sdks

/** The canonical release API — where resolveLatest() reads live version metadata. */
export const RELEASES_ENDPOINT = 'https://api.hanzo.ai/v1/releases'

/**
 * Detect the visitor's OS from a UA string (pass navigator.userAgent in the
 * browser). Returns one of macos | windows | linux | ios | android | unknown —
 * used to feature the right primary download button.
 */
export function detectPlatform(ua = '') {
  const s = String(ua).toLowerCase()
  if (/iphone|ipad|ipod/.test(s)) return 'ios'
  if (/android/.test(s)) return 'android'
  if (/mac os x|macintosh/.test(s)) return 'macos'
  if (/windows|win32|win64/.test(s)) return 'windows'
  if (/linux|x11/.test(s)) return 'linux'
  return 'unknown'
}

/** Detect Apple Silicon vs Intel (best-effort; defaults to arm64 on modern Macs). */
export function macArch(ua = '') {
  return /intel/i.test(String(ua)) ? 'x64' : 'arm64'
}

/**
 * The single download to feature for a platform — the desktop entry matching
 * (platform, arch); on macOS, arch defaults from the UA. Returns undefined for
 * mobile (use the store link) or unknown.
 */
export function primaryDesktop(platform, ua = '') {
  if (platform === 'macos') {
    const arch = macArch(ua)
    return _downloads.desktop.find((d) => d.platform === 'macos' && d.arch === arch)
  }
  return _downloads.desktop.find((d) => d.platform === platform)
}

/** Integration items for a category id (or all when omitted). */
export function integrationsByCategory(categoryId) {
  if (!categoryId) return _integrations.items
  return _integrations.items.filter((i) => i.category === categoryId)
}

/**
 * Decorate desktop entries with the live version/publishedAt from
 * api.hanzo.ai/v1/releases (for display only — the hrefs already resolve to
 * `latest`). Fails soft: returns the static catalog unchanged on any error, so a
 * download page is NEVER blocked on the network.
 *
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{version?:string, publishedAt?:string, desktop:typeof desktop}>}
 */
export async function resolveLatest(fetchImpl) {
  const f = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null)
  if (!f) return { desktop }
  try {
    const res = await f(`${RELEASES_ENDPOINT}/desktop/latest`, { headers: { accept: 'application/json' } })
    if (!res.ok) return { desktop }
    const j = await res.json()
    const version = j.version || j.tag || j.tag_name
    const publishedAt = j.publishedAt || j.published_at || j.date
    return {
      version,
      publishedAt,
      desktop: desktop.map((d) => ({ ...d, version, publishedAt })),
    }
  } catch {
    return { desktop }
  }
}
