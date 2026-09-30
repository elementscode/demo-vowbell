import { sql } from "@elements/app";
import photo01 from "#app/shared/assets/seed/photo-01.jpg";
import photo02 from "#app/shared/assets/seed/photo-02.jpg";
import photo03 from "#app/shared/assets/seed/photo-03.jpg";
import photo04 from "#app/shared/assets/seed/photo-04.jpg";
import photo05 from "#app/shared/assets/seed/photo-05.jpg";
import photo06 from "#app/shared/assets/seed/photo-06.jpg";
import photo07 from "#app/shared/assets/seed/photo-07.jpg";
import photo08 from "#app/shared/assets/seed/photo-08.jpg";
import photo09 from "#app/shared/assets/seed/photo-09.jpg";
import photo10 from "#app/shared/assets/seed/photo-10.jpg";
import photo11 from "#app/shared/assets/seed/photo-11.jpg";
import photo12 from "#app/shared/assets/seed/photo-12.jpg";
import photo13 from "#app/shared/assets/seed/photo-13.jpg";
import photo14 from "#app/shared/assets/seed/photo-14.jpg";
import photo15 from "#app/shared/assets/seed/photo-15.jpg";

export interface Site {
  partnerOne: string;
  partnerTwo: string;
  weddingAt: Date;
  timeZone: string;
  venue: string;
  city: string;
  tagline: string;
  storyTitle: string;
  story: string;
  travel: string;
  rsvpBy: Date | null;
  coverPhotoId: string | null;
}

export interface WeddingEvent {
  id: string;
  position: number;
  name: string;
  startsAt: Date;
  place: string;
  address: string;
  attire: string;
  details: string;
}

export interface Hotel {
  id: string;
  position: number;
  name: string;
  address: string;
  url: string;
  details: string;
}

export interface Photo {
  id: string;
  position: number;
  caption: string;
  asset: string | null;
  hash: string | null;
}

export type Meal = "beef" | "fish" | "veg" | "kids";

export const MEALS: { value: Meal; label: string; note: string }[] = [
  { value: "beef", label: "Braised short rib", note: "cider jus, celery root purée" },
  { value: "fish", label: "Roasted halibut", note: "brown butter, charred leeks" },
  { value: "veg", label: "Wild mushroom risotto", note: "vegetarian, aged parmesan" },
  { value: "kids", label: "Kids' plate", note: "chicken tenders, fries, apple slices" },
];

export function mealLabel(meal: string | null): string {
  return MEALS.find((m) => m.value === meal)?.label ?? "";
}

// Photos shipped with the app, by the name a row's asset column holds.
const ASSETS: Record<string, string> = {
  "photo-01": photo01,
  "photo-02": photo02,
  "photo-03": photo03,
  "photo-04": photo04,
  "photo-05": photo05,
  "photo-06": photo06,
  "photo-07": photo07,
  "photo-08": photo08,
  "photo-09": photo09,
  "photo-10": photo10,
  "photo-11": photo11,
  "photo-12": photo12,
  "photo-13": photo13,
  "photo-14": photo14,
  "photo-15": photo15,
};

/** The URL for a photo. An upload carries its hash, so it caches forever. */
export function photoUrl(p: Photo): string {
  if (p.asset) {
    return ASSETS[p.asset] ?? "";
  }

  return `/photos/${p.id}/${p.hash}`;
}

export function coupleNames(site: Site): string {
  return `${firstName(site.partnerOne)} & ${firstName(site.partnerTwo)}`;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

/** Blank-line separated text as paragraphs. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0);
}

export function formatDate(d: Date, timeZone: string): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone });
}

export function formatTime(d: Date, timeZone: string): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone });
}

export function formatDay(d: Date, timeZone: string): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone });
}

export function loadSite(): Site {
  return sql<Site>(
    `select partnerOne, partnerTwo, weddingAt, timeZone, venue, city, tagline,
            storyTitle, story, travel, rsvpBy, coverPhotoId
     from site where id = 1`,
  ).firstOrThrow("site row missing");
}

export function loadEvents(): WeddingEvent[] {
  return sql<WeddingEvent>(
    `select id, position, name, startsAt, place, address, attire, details
     from events order by startsAt, position`,
  ).all();
}

export function loadHotels(): Hotel[] {
  return sql<Hotel>(
    `select id, position, name, address, url, details from hotels order by position, createdAt`,
  ).all();
}

export function loadPhotos(): Photo[] {
  return sql<Photo>(
    `select id, position, caption, asset, hash from photos order by position, createdAt`,
  ).all();
}
