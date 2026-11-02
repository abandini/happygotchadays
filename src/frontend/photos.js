// Public-domain photographs from one shelter adoption event (Camp Pendleton Animal Shelter, California,
// July 26, 2014), by Sgt. Valerie Eppler, U.S. Marine Corps, via DVIDS and Wikimedia Commons.
// Captions have four parts: story (our own words, only what is visible), archive (the record's description,
// quoted verbatim; names of children are left out by quoting from after them), credit, where.
// Rights basis per file: docs/image-rights.md.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CREDIT = 'Sgt. Valerie Eppler, U.S. Marine Corps';
const RIGHTS = 'public domain (U.S. government work)';
const WHERE = 'Camp Pendleton Animal Shelter, California, July 26, 2014.';

export const PHOTOS = {
  bulldog: {
    file: 'adoption-day-bulldog-camp-pendleton-usmc.webp', w: 1700, h: 1133,
    alt: 'A man in a blue T-shirt crouches on a shelter floor, face to face with a brown-and-white English bulldog in a bandanna that leans in close to him.',
    story: 'Adoption day: a new owner crouches on the shelter floor as the bulldog he just adopted leans in.',
    archive: 'is greeted by his newly adopted family member, English Bulldog Pinkerton at the Camp Pendleton Animal Shelter during the annual adoption event July 26.',
    src: 'https://www.dvidshub.net/image/1471006', commons: 'https://commons.wikimedia.org/wiki/File:Families_find_new_furry_friends_at_adoption_event_140726-M-DN141-001.jpg'
  },
  brothers: {
    file: 'adoption-day-brothers-new-dog-usmc.webp', w: 1000, h: 666,
    alt: 'Three brothers outdoors beside a white dog in a bandanna; the oldest crouches holding a bag of pet supplies, the youngest sits on an older brother’s knee.',
    story: 'Three brothers, one white dog in a bandanna, and a bag of pet supplies to take home.',
    archive: 'whom they named Obi Wan Kenobi, at the Camp Pendleton Animal Shelter during the annual adoption event July 26.',
    src: 'https://www.dvidshub.net/image/1471028', commons: 'https://commons.wikimedia.org/wiki/File:Families_find_new_furry_friends_at_adoption_event_140726-M-DN141-006.jpg'
  },
  kitten: {
    file: 'adoption-day-kitten-play-usmc.webp', w: 1000, h: 666,
    alt: 'A young boy kneels on grass holding a string toy over an orange kitten in a pink harness.',
    story: 'A boy, a string toy and an orange kitten in a pink harness, on the grass outside the shelter.',
    archive: 'plays with the kittens at the Camp Pendleton Animal Shelter during the annual adoption event July 26.',
    src: 'https://www.dvidshub.net/image/1471020', commons: 'https://commons.wikimedia.org/wiki/File:Families_find_new_furry_friends_at_adoption_event_140726-M-DN141-004.jpg'
  },
  toddler: {
    file: 'adoption-day-toddler-new-puppy-usmc.webp', w: 1000, h: 666,
    alt: 'A curly-haired toddler looks up open-mouthed as a black dog in a red bandanna leans in toward her face.',
    story: 'A toddler, wide-eyed, as the family’s new black dog in a red bandanna leans in.',
    archive: 'plays with new family member Titan at the Camp Pendleton Animal Shelter during the annual adoption event July 26.',
    src: 'https://www.dvidshub.net/image/1471007', commons: 'https://commons.wikimedia.org/wiki/File:Families_find_new_furry_friends_at_adoption_event_140726-M-DN141-002.jpg'
  }
};

export function photoCaption(p) {
  return `<span class="story">${esc(p.story)}</span>`
    + `From the record: <q>…${esc(p.archive)}</q> `
    + `Photo: ${esc(CREDIT)}, ${esc(RIGHTS)} (<a href="${esc(p.src)}" rel="noopener">DVIDS record</a>). ${esc(WHERE)}`;
}

export function photoImg(p, { lazy = true } = {}) {
  return `<img src="/img/${p.file}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;
}
