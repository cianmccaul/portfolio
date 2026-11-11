/**
 * Date-derived wording. Nothing on the site hard-codes "currently", "incoming"
 * or a year: it is all worked out from the dates in content/resume.json against
 * the build date, and a scheduled rebuild keeps it true.
 *
 * Dates are partial ISO strings: "2029", "2028-01" or "2028-01-15".
 */

export type PartialDate = string;
export type Status = 'upcoming' | 'current' | 'past';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NBSP = ' ';
const EN_DASH = '–';

interface Parts {
  year: number;
  month?: number; // 1–12
  day?: number;
}

export function parse(date: PartialDate): Parts {
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(date);
  if (!match) throw new Error(`Bad date "${date}": use YYYY, YYYY-MM or YYYY-MM-DD`);
  return {
    year: Number(match[1]),
    month: match[2] ? Number(match[2]) : undefined,
    day: match[3] ? Number(match[3]) : undefined,
  };
}

/** Months since year 0, taking the earliest month a partial date could mean. */
const floor = (d: Parts) => d.year * 12 + ((d.month ?? 1) - 1);
/** …and the latest month it could mean. */
const ceil = (d: Parts) => d.year * 12 + ((d.month ?? 12) - 1);
const monthIndex = (now: Date) => now.getFullYear() * 12 + now.getMonth();

/** Where a start/end pair sits relative to now. A missing end means ongoing. */
export function status(start: PartialDate, end: PartialDate | null | undefined, now: Date): Status {
  const today = monthIndex(now);
  if (floor(parse(start)) > today) return 'upcoming';
  if (end && ceil(parse(end)) < today) return 'past';
  return 'current';
}

/** "Aug 2024", "30 Oct 2026", or "2024" when only the year is known. */
export function formatDate(date: PartialDate, style: 'short' | 'long' = 'short'): string {
  const { year, month, day } = parse(date);
  if (!month) return String(year);
  const name = (style === 'long' ? MONTHS_LONG : MONTHS)[month - 1];
  return day ? `${day}${NBSP}${name}${NBSP}${year}` : `${name}${NBSP}${year}`;
}

/** Lower-cases only the first letter, for a label that continues a sentence. */
export const lowerFirst = (text: string): string => text.charAt(0).toLowerCase() + text.slice(1);

/**
 * "Aug 2024 – Present", "Jan–Sep 2028", "2022–23", "2023–2025".
 * An open range ends in "Present" only once it has started. Pass 'year' to
 * drop months, for lists where only some entries have them.
 */
export function formatRange(
  start: PartialDate,
  end: PartialDate | null | undefined,
  now: Date,
  precision: 'month' | 'year' = 'month',
): string {
  if (precision === 'year') {
    return formatRange(start.slice(0, 4), end ? end.slice(0, 4) : end, now);
  }
  const s = parse(start);
  if (!end) {
    return status(start, end, now) === 'upcoming'
      ? `From${NBSP}${formatDate(start)}`
      : `${formatDate(start)} ${EN_DASH} Present`;
  }
  const e = parse(end);
  if (!s.month && !e.month) {
    if (s.year === e.year) return String(s.year);
    // Academic or single-season spans read best as 2022–23.
    return e.year - s.year === 1
      ? `${s.year}${EN_DASH}${String(e.year).slice(2)}`
      : `${s.year}${EN_DASH}${e.year}`;
  }
  if (s.month && e.month && s.year === e.year) {
    if (s.month === e.month) return formatDate(start);
    return `${MONTHS[s.month - 1]}${EN_DASH}${MONTHS[e.month - 1]}${NBSP}${s.year}`;
  }
  return `${formatDate(start)} ${EN_DASH} ${formatDate(end)}`;
}

/**
 * Which year of a course someone is in, counting academic years from the
 * month the course started. Null before it starts or after it ends.
 */
export function yearOfStudy(start: PartialDate, end: PartialDate, durationYears: number, now: Date): number | null {
  if (status(start, end, now) !== 'current') return null;
  const s = parse(start);
  const startMonth = s.month ?? 9;
  const year = now.getFullYear() - s.year + (now.getMonth() + 1 >= startMonth ? 1 : 0);
  return Math.min(Math.max(year, 1), durationYears);
}

/** "Year 2 of 4", "Penultimate year" (what internship postings ask for), "Final year". */
export function yearOfStudyLabel(year: number, durationYears: number): string {
  if (year === durationYears) return 'Final year';
  if (year === durationYears - 1) return 'Penultimate year';
  return `Year${NBSP}${year} of${NBSP}${durationYears}`;
}

/** "Graduating 2029" until the end date passes, then "Graduated 2029". */
export function graduationLabel(end: PartialDate, now: Date): string {
  const done = ceil(parse(end)) < monthIndex(now);
  return `${done ? 'Graduated' : 'Graduating'}${NBSP}${formatDate(end)}`;
}

/**
 * Availability window for the hero chip. Null once the window has closed, so a
 * stale chip disappears instead of lying.
 */
export function availabilityLabel(from: PartialDate, until: PartialDate | null | undefined, now: Date): string | null {
  const state = status(from, until, now);
  if (state === 'past') return null;
  if (state === 'upcoming') return `Available ${until ? formatRange(from, until, now) : `from${NBSP}${formatDate(from)}`}`;
  return until ? `Available now, until${NBSP}${formatDate(until)}` : 'Available now';
}

/** Newest first; ongoing roles before finished ones that started the same year. */
export function byRecency<T extends { startDate: PartialDate; endDate?: PartialDate | null }>(a: T, b: T): number {
  const end = (x: T) => (x.endDate ? ceil(parse(x.endDate)) : Number.POSITIVE_INFINITY);
  return end(b) - end(a) || floor(parse(b.startDate)) - floor(parse(a.startDate));
}
