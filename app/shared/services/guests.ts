import { Channel, sql } from "@elements/app";
import { Meal } from "#app/shared/services/wedding";

export interface PartyGuest {
  id: string;
  partyId: string;
  position: number;
  name: string;
  attending: boolean | null;
  meal: Meal | null;
  dietary: string;
}

export interface Party {
  id: string;
  name: string;
  code: string;
  email: string;
  song: string;
  message: string;
  respondedAt: Date | null;
  createdAt: Date;
  guests: PartyGuest[];
}

type PartyRow = Omit<Party, "guests">;

/** Every RSVP and every guest list edit notifies here; the tracker listens. */
export const rsvpChannel = new Channel<{ partyId: string }>("rsvps");

// No 0/O or 1/I/L, so a code read off paper types back correctly.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function newCode(): string {
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }

  return code;
}

/** A code no party holds yet. */
export function uniqueCode(): string {
  for (;;) {
    let code = newCode();

    if (sql(`select 1 from parties where code = ${code}`).empty()) {
      return code;
    }
  }
}

function withGuests(rows: PartyRow[]): Party[] {
  if (rows.length === 0) {
    return [];
  }

  let ids = rows.map((r) => r.id);

  let guests = sql<PartyGuest>(
    `select id, partyId, position, name, attending, meal, dietary
     from guests where partyId = any(${ids}::uuid[])
     order by position, createdAt`,
  ).all();

  return rows.map((r) => ({ ...r, guests: guests.filter((g) => g.partyId === r.id) }));
}

export function loadPartyByCode(code: string): Party | undefined {
  let rows = sql<PartyRow>(
    `select id, name, code, email, song, message, respondedAt, createdAt
     from parties where code = ${normalizeCode(code)}`,
  ).all();

  return withGuests(rows)[0];
}

export function loadParties(): Party[] {
  let rows = sql<PartyRow>(
    `select id, name, code, email, song, message, respondedAt, createdAt
     from parties order by name`,
  ).all();

  return withGuests(rows);
}
