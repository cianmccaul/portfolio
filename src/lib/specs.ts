/**
 * The logistics a recruiter looks for, as label and value pairs. One list, so
 * the home page, About and the links page can't disagree.
 */
import { currentDegree, resume } from './resume';
import { availabilityLabel, fullYearsSince, graduationLabel, lowerFirst, yearOfStudy, yearOfStudyLabel } from './dates';
import { now } from './site';

const { basics, logistics } = resume;
const study = currentDegree?.durationYears
  ? yearOfStudy(currentDegree.startDate, currentDegree.endDate, currentDegree.durationYears, now)
  : null;

export interface Spec {
  term: string;
  value: string;
}

export const logisticsSpecs: Spec[] = [
  { term: 'Looking for', value: logistics.targetRole },
  {
    term: 'Available',
    value: availabilityLabel(logistics.availableFrom, logistics.availableUntil, now)?.replace(/^Available /, ''),
  },
  {
    term: 'Studying',
    value: [
      study && currentDegree && yearOfStudyLabel(study, currentDegree.durationYears!),
      currentDegree && lowerFirst(graduationLabel(currentDegree.endDate, now)),
    ]
      .filter(Boolean)
      .join(', '),
  },
  { term: 'Based in', value: [basics.location.city, logistics.relocate.open && 'will relocate'].filter(Boolean).join(' · ') },
  { term: 'Work rights', value: logistics.workAuthorization.map((auth) => auth.label).join(', ') },
].filter((spec): spec is Spec => !!spec.value);

/**
 * The proof strip under the hero: three facts, each worked out from
 * resume.json so it can't drift from the rest of the site. The clinic band
 * further down carries the BodyMed Hub's own numbers; these are deliberately
 * different.
 */
export interface Proof {
  value: string;
  unit: string;
  label: string;
  link: { label: string; href: string };
}

const bodymed = resume.work.find((role) => role.company === 'BodyMed Healthcare');
const years = bodymed ? fullYearsSince(bodymed.startDate, now) : 0;
const demos = resume.projects.filter((project) => project.demo);
const firstClass = currentDegree?.notes.find((note) => /^First Class Honours/.test(note));
/** The academic year in brackets in the note, e.g. " (2025–26)". */
const yearsIn = (note: string) => {
  const match = /\(([^)]+)\)/.exec(note);
  return match ? ` (${match[1]})` : '';
};

export const proof: Proof[] = [
  bodymed &&
    years >= 1 && {
      value: String(years),
      unit: years === 1 ? 'year' : 'years',
      label: `at ${bodymed.company}, from admin to building the system the clinic runs on`,
      link: { label: 'Experience', href: '#experience' },
    },
  demos.length > 0 && {
    value: String(demos.length),
    unit: 'live demos',
    label: 'of my projects that you can try in the browser',
    link: { label: 'Selected work', href: '#work' },
  },
  firstClass &&
    currentDegree && {
      value: 'First Class',
      unit: 'Honours',
      label: `in first year at ${currentDegree.shortName ?? currentDegree.institution}${yearsIn(firstClass)}`,
      link: { label: 'Education', href: '#education' },
    },
].filter((item): item is Proof => !!item);
