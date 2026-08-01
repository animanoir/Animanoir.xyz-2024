import { execSync } from "node:child_process";

/**
 * Build-time version string: the short git commit hash (honest, traceable),
 * falling back to a build-date stamp when git isn't available. Shared by the
 * page frame (desktop) and the footer colophon (mobile).
 */
export function buildVersion(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    const now = new Date();
    return `v.${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}
