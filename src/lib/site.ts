import { execSync } from 'node:child_process';

/** The moment this build ran. All date-derived wording is computed against it. */
export const now = new Date();

/** Date of the last commit, for the footer. Falls back to the build date. */
export const lastUpdated: Date = (() => {
  try {
    const iso = execSync('git log -1 --format=%cI', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return iso ? new Date(iso) : now;
  } catch {
    return now;
  }
})();

/**
 * Primary navigation. Only pages that exist are listed: About and CV join when
 * their routes are built.
 */
export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
] as const;

/** Small inline formatting for strings in resume.json: **bold** only. */
export const inline = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
