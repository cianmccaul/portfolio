/** Structured data, built from resume.json so it can't drift from the page. */
import { currentDegree, resume } from './resume';
import { status } from './dates';
import { lastUpdated, now } from './site';

const { basics } = resume;
export const origin = basics.url.replace(/\/$/, '');
export const absolute = (path: string) => new URL(path, `${origin}/`).href;

const personId = `${origin}/#person`;

/** The Person behind the site. A current student is affiliated; a graduate is an alumnus. */
export function person() {
  const university = currentDegree && {
    '@type': 'CollegeOrUniversity',
    name: currentDegree.institution,
  };
  const studying = currentDegree && status(currentDegree.startDate, currentDegree.endDate, now) === 'current';
  return {
    '@type': 'Person',
    '@id': personId,
    name: basics.name,
    description: `${basics.label}. ${basics.summary.replace(/\*\*/g, '')}`,
    url: origin,
    address: { '@type': 'PostalAddress', addressLocality: basics.location.city, addressCountry: basics.location.country },
    ...(university ? { [studying ? 'affiliation' : 'alumniOf']: university } : {}),
    knowsAbout: resume.skills.flatMap((group) => group.keywords),
    sameAs: basics.profiles.map((p) => p.url),
  };
}

export const profilePage = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateModified: lastUpdated.toISOString(),
  mainEntity: person(),
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absolute(item.path),
  })),
});

export const article = (title: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url: absolute(path),
  dateModified: lastUpdated.toISOString(),
  author: { '@id': personId },
});
