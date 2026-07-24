// Type declarations for @hanzo/download — the canonical Hanzo download + install
// catalog. Data-first; shapes mirror downloads.json / integrations.json.

export type Platform = "macos" | "windows" | "linux" | "ios" | "android" | "unknown";
export type Arch = "arm64" | "x64";
export type InstallAction = "install" | "connect";

export interface DesktopDownload {
  id: string;
  platform: "macos" | "windows" | "linux";
  arch: Arch;
  label: string;
  ext: string;
  href: string;
  /** Filled by resolveLatest() for display only. */
  version?: string;
  publishedAt?: string;
}

export interface MobileDownload { id: string; platform: "ios" | "android"; label: string; href: string; }
export interface ExtensionDownload { id: string; browser: string; href: string; }
export interface EditorDownload { id: string; editor: string; href: string; }
export interface CommandInstall { id: string; label: string; command: string; }

export interface DownloadCatalog {
  desktop: DesktopDownload[];
  mobile: MobileDownload[];
  extensions: ExtensionDownload[];
  editors: EditorDownload[];
  cli: CommandInstall[];
  sdks: CommandInstall[];
}

export interface IntegrationCategory { id: string; label: string; }
export interface Integration {
  id: string;
  name: string;
  category: string;
  action: InstallAction;
  href: string;
  blurb?: string;
}
export interface IntegrationCatalog {
  categories: IntegrationCategory[];
  items: Integration[];
}

export const downloads: DownloadCatalog;
export const integrations: IntegrationCatalog;
export const desktop: DesktopDownload[];
export const mobile: MobileDownload[];
export const extensions: ExtensionDownload[];
export const editors: EditorDownload[];
export const cli: CommandInstall[];
export const sdks: CommandInstall[];
export const RELEASES_ENDPOINT: string;

export function detectPlatform(ua?: string): Platform;
export function macArch(ua?: string): Arch;
export function primaryDesktop(platform: Platform, ua?: string): DesktopDownload | undefined;
export function integrationsByCategory(categoryId?: string): Integration[];
export function resolveLatest(
  fetchImpl?: typeof fetch,
): Promise<{ version?: string; publishedAt?: string; desktop: DesktopDownload[] }>;
