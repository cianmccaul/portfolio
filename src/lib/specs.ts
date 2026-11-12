/**
 * The logistics a recruiter looks for, as label and value pairs. One list, so
 * the home page, About and the links page can't disagree.
 */
import { currentDegree, resume } from './resume';
import { availabilityLabel, graduationLabel, lowerFirst, yearOfStudy, yearOfStudyLabel } from './dates';
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
