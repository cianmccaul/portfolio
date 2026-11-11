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

/** Primary navigation: the three places a recruiter needs. */
export const nav = [
  { label: 'Work', href: '/#work', match: '/work/' },
  { label: 'About', href: '/about/', match: '/about/' },
  { label: 'CV', href: '/cv/', match: '/cv/' },
] as const;

/** The generated one-page CV. Built by scripts/build-cv-pdf.mjs. */
export const cvPdf = (name: string) => `/${name.replace(/\s+/g, '-')}-CV.pdf`;

/** Small inline formatting for strings in resume.json: **bold** only. */
export const inline = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
