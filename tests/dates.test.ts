import { describe, expect, it } from 'vitest';
import { availabilityLabel, byRecency, formatDate, formatRange, graduationLabel, status, yearOfStudy, yearOfStudyLabel } from '../src/lib/dates';

const at = (iso: string) => new Date(`${iso}T12:00:00`);
const plain = (s: string | null) => s?.replace(/ /g, ' ');

describe('status', () => {
  it('is current for an open-ended role that has started', () => {
    expect(status('2024-08', null, at('2026-11-11'))).toBe('current');
  });
  it('is upcoming before the start month', () => {
    expect(status('2028-01', '2028-08', at('2027-12-31'))).toBe('upcoming');
  });
  it('is past after the end month', () => {
    expect(status('2028-01', '2028-08', at('2028-09-01'))).toBe('past');
  });
  it('treats a year-only end as lasting the whole year', () => {
    expect(status('2025-09', '2029', at('2029-06-01'))).toBe('current');
    expect(status('2025-09', '2029', at('2030-01-01'))).toBe('past');
  });
});

describe('formatRange', () => {
  const now = at('2026-11-11');
  it('ends an ongoing role in Present', () => {
    expect(plain(formatRange('2024-08', null, now))).toBe('Aug 2024 – Present');
  });
  it('never says Present for a role that has not started', () => {
    expect(plain(formatRange('2028-01', null, now))).toBe('From Jan 2028');
  });
  it('shortens an academic year', () => {
    expect(formatRange('2022', '2023', now)).toBe('2022–23');
  });
  it('keeps both years for longer spans', () => {
    expect(formatRange('2019', '2023', now)).toBe('2019–2023');
  });
  it('shares the year inside one calendar year', () => {
    expect(plain(formatRange('2028-01', '2028-09', now))).toBe('Jan–Sep 2028');
  });
  it('can drop months so a list of mixed precision lines up', () => {
    expect(formatRange('2025-09', '2029', now, 'year')).toBe('2025–2029');
  });
  it('rejects malformed dates', () => {
    expect(() => formatDate('Aug 2024')).toThrow();
  });
});

describe('year of study', () => {
  it('is year 2 in November of the second academic year', () => {
    expect(yearOfStudy('2025-09', '2029', 4, at('2026-11-11'))).toBe(2);
  });
  it('rolls over in September, not January', () => {
    expect(yearOfStudy('2025-09', '2029', 4, at('2027-08-31'))).toBe(2);
    expect(yearOfStudy('2025-09', '2029', 4, at('2027-09-01'))).toBe(3);
  });
  it('is null after graduation', () => {
    expect(yearOfStudy('2025-09', '2029', 4, at('2030-02-01'))).toBeNull();
  });
  it('names the years recruiters ask for', () => {
    expect(plain(yearOfStudyLabel(2, 4))).toBe('Year 2 of 4');
    expect(yearOfStudyLabel(3, 4)).toBe('Penultimate year');
    expect(yearOfStudyLabel(4, 4)).toBe('Final year');
  });
});

describe('labels that change with time', () => {
  it('switches from Graduating to Graduated', () => {
    expect(plain(graduationLabel('2029', at('2026-11-11')))).toBe('Graduating 2029');
    expect(plain(graduationLabel('2029', at('2030-01-01')))).toBe('Graduated 2029');
  });
  it('describes the availability window before, during and after', () => {
    expect(plain(availabilityLabel('2028-01', '2028-09', at('2026-11-11')))).toBe('Available Jan–Sep 2028');
    expect(plain(availabilityLabel('2028-01', '2028-09', at('2028-03-01')))).toBe('Available now, until Sep 2028');
    expect(availabilityLabel('2028-01', '2028-09', at('2028-10-01'))).toBeNull();
  });
});

describe('byRecency', () => {
  it('puts the ongoing role first and keeps the rest newest first', () => {
    const roles = [
      { id: 'ty', startDate: '2022', endDate: '2023' },
      { id: 'now', startDate: '2024-08', endDate: null },
      { id: 'old', startDate: '2019', endDate: '2020' },
    ];
    expect(roles.sort(byRecency).map((r) => r.id)).toEqual(['now', 'ty', 'old']);
  });
});
