import { sql, tx, File, ValidationError } from "@elements/app";
import { coupleOrThrow } from "#app/shared/services/auth";
import { Photo, loadPhotos } from "#app/shared/services/wedding";

/** Site copy as the form edits it: times as local wall-clock strings. */
export interface SiteForm {
  partnerOne: string;
  partnerTwo: string;
  weddingLocal: string;
  timeZone: string;
  venue: string;
  city: string;
  tagline: string;
  rsvpBy: string;
  storyTitle: string;
  story: string;
  travel: string;
  coverPhotoId: string;
}

export interface EventForm {
  id: string;
  name: string;
  startsLocal: string;
  place: string;
  address: string;
  attire: string;
  details: string;
}

export interface HotelForm {
  id: string;
  name: string;
  address: string;
  url: string;
  details: string;
}

const ALLOWED = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

export function loadSiteForm(): SiteForm {
  return sql<SiteForm>(
    `select partnerOne, partnerTwo,
            to_char(weddingAt at time zone timeZone, 'YYYY-MM-DD"T"HH24:MI') as weddingLocal,
            timeZone, venue, city, tagline,
            coalesce(to_char(rsvpBy, 'YYYY-MM-DD'), '') as rsvpBy,
            storyTitle, story, travel, coalesce(coverPhotoId::text, '') as coverPhotoId
     from site where id = 1`,
  ).firstOrThrow("site row missing");
}

export function loadEventForms(): EventForm[] {
  return sql<EventForm>(
    `select e.id, e.name,
            to_char(e.startsAt at time zone s.timeZone, 'YYYY-MM-DD"T"HH24:MI') as startsLocal,
            e.place, e.address, e.attire, e.details
     from events e, site s
     order by e.startsAt, e.position`,
  ).all();
}

export function loadHotelForms(): HotelForm[] {
  return sql<HotelForm>(
    `select id, name, address, url, details from hotels order by position, createdAt`,
  ).all();
}

function checkLocal(value: string, what: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new ValidationError(`Pick a date and time for ${what}.`);
  }
}

/** @rpc */
export function saveSite(form: SiteForm): SiteForm {
  coupleOrThrow();

  if (!form.partnerOne.trim() || !form.partnerTwo.trim()) {
    throw new ValidationError("Both of your names are needed.");
  }

  checkLocal(form.weddingLocal, "the wedding");

  sql(
    `update site set
       partnerOne = ${form.partnerOne.trim()},
       partnerTwo = ${form.partnerTwo.trim()},
       weddingAt = (${form.weddingLocal}::timestamp at time zone timeZone),
       venue = ${form.venue.trim()},
       city = ${form.city.trim()},
       tagline = ${form.tagline.trim()},
       rsvpBy = ${form.rsvpBy || null}::date,
       storyTitle = ${form.storyTitle.trim()},
       story = ${form.story.trim()},
       travel = ${form.travel.trim()}
     where id = 1`,
  );

  return loadSiteForm();
}

/** @rpc */
export function saveEvent(form: EventForm): EventForm[] {
  coupleOrThrow();

  if (!form.name.trim()) {
    throw new ValidationError("Give the event a name.");
  }

  checkLocal(form.startsLocal, form.name);

  let startsAt = sql.raw(`(${form.startsLocal}::timestamp at time zone (select timeZone from site where id = 1))`);

  if (form.id) {
    sql(
      `update events set name = ${form.name.trim()}, startsAt = ${startsAt}, place = ${form.place.trim()},
         address = ${form.address.trim()}, attire = ${form.attire.trim()}, details = ${form.details.trim()}
       where id = ${form.id}`,
    );
  } else {
    sql(
      `insert into events (name, startsAt, place, address, attire, details)
       values (${form.name.trim()}, ${startsAt}, ${form.place.trim()}, ${form.address.trim()}, ${form.attire.trim()}, ${form.details.trim()})`,
    );
  }

  return loadEventForms();
}

/** @rpc */
export function deleteEvent(id: string): EventForm[] {
  coupleOrThrow();

  sql(`delete from events where id = ${id}`);

  return loadEventForms();
}

/** @rpc */
export function saveHotel(form: HotelForm): HotelForm[] {
  coupleOrThrow();

  if (!form.name.trim()) {
    throw new ValidationError("Give the hotel a name.");
  }

  if (form.id) {
    sql(
      `update hotels set name = ${form.name.trim()}, address = ${form.address.trim()},
         url = ${form.url.trim()}, details = ${form.details.trim()}
       where id = ${form.id}`,
    );
  } else {
    sql(
      `insert into hotels (name, address, url, details, position)
       values (${form.name.trim()}, ${form.address.trim()}, ${form.url.trim()}, ${form.details.trim()},
               (select coalesce(max(position) + 1, 0) from hotels))`,
    );
  }

  return loadHotelForms();
}

/** @rpc */
export function deleteHotel(id: string): HotelForm[] {
  coupleOrThrow();

  sql(`delete from hotels where id = ${id}`);

  return loadHotelForms();
}

/** @rpc */
export function uploadPhotos(files: File[]): Photo[] {
  coupleOrThrow();

  for (let f of files) {
    if (!ALLOWED.has(f.contentType)) {
      throw new ValidationError(`${f.name} isn't a photo we can show. Use JPEG, PNG, GIF or WebP.`);
    }

    if (f.size > MAX_BYTES) {
      throw new ValidationError(`${f.name} is over 8 MB. Try a smaller export.`);
    }
  }

  tx(() => {
    for (let f of files) {
      sql(
        `insert into photos (caption, contentType, data, position)
         values ('', ${f.contentType}, ${f.data}, (select coalesce(max(position) + 1, 0) from photos))`,
      );
    }
  });

  return loadPhotos();
}

/** @rpc */
export function captionPhoto(id: string, caption: string) {
  coupleOrThrow();

  sql(`update photos set caption = ${caption.trim()} where id = ${id}`);
}

/** @rpc */
export function movePhoto(id: string, by: number): Photo[] {
  coupleOrThrow();

  let photos = loadPhotos();
  let from = photos.findIndex((p) => p.id === id);
  let to = from + by;

  if (from < 0 || to < 0 || to >= photos.length) {
    return photos;
  }

  let [moved] = photos.splice(from, 1);
  photos.splice(to, 0, moved);

  tx(() => {
    photos.forEach((p, i) => sql(`update photos set position = ${i} where id = ${p.id}`));
  });

  return loadPhotos();
}

/** @rpc */
export function deletePhoto(id: string): Photo[] {
  coupleOrThrow();

  sql(`delete from photos where id = ${id}`);

  return loadPhotos();
}

/** @rpc */
export function setCover(id: string): SiteForm {
  coupleOrThrow();

  sql(`update site set coverPhotoId = ${id} where id = 1`);

  return loadSiteForm();
}
