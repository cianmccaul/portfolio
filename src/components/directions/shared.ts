/** Content shared by the three mockups, all read from resume.json. */
import { currentDegree, project, resume } from '../../lib/resume';
import { availabilityLabel, graduationLabel, yearOfStudy, yearOfStudyLabel } from '../../lib/dates';
import { now } from '../../lib/site';

const { basics, logistics } = resume;
const study = currentDegree?.durationYears
  ? yearOfStudy(currentDegree.startDate, currentDegree.endDate, currentDegree.durationYears, now)
  : null;

export const chips = [
  logistics.targetRole,
  study && currentDegree && yearOfStudyLabel(study, currentDegree.durationYears!),
  availabilityLabel(logistics.availableFrom, logistics.availableUntil, now),
  currentDegree && graduationLabel(currentDegree.endDate, now),
  basics.location.city,
  logistics.relocate.open && 'Will relocate',
  ...logistics.workAuthorization.map((a) => a.label),
].filter(Boolean) as string[];

/** The same facts as label and value pairs, for the spec-sheet layout. */
export const specs = [
  { term: 'Looking for', value: logistics.targetRole },
  { term: 'Available', value: availabilityLabel(logistics.availableFrom, logistics.availableUntil, now)?.replace('Available ', '') },
  { term: 'Studying', value: [study && currentDegree && yearOfStudyLabel(study, currentDegree.durationYears!), currentDegree && graduationLabel(currentDegree.endDate, now).toLowerCase()].filter(Boolean).join(', ') },
  { term: 'Based in', value: `${basics.location.city} · will relocate` },
  { term: 'Work rights', value: logistics.workAuthorization.map((a) => a.label).join(', ') },
].filter((s) => s.value) as { term: string; value: string }[];

export const figures = resume.metrics.filter((m) => m.status === 'ready');
export const platform = project('clinic-platform');
export const triage = project('email-triage');
export const chatbot = project('clinic-chatbot');
export const suite = resume.suites[0]!;
export { basics };
