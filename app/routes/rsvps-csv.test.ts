import { test, equal, sql } from "@elements/app";
import { rsvpCsv } from "./rsvps-csv";

test("rsvp csv export", () => {
  let p = sql<{ id: string }>(
    `insert into parties (name, code, song, respondedAt) values ('Lee, Sam', 'LEE111', 'Say "yes"', '2026-09-01T12:00:00Z') returning id`,
  ).firstOrThrow();
  sql(`insert into guests (partyId, name, attending, meal) values (${p.id}, 'Sam Lee', true, 'fish')`);

  let lines = rsvpCsv().trim().split("\r\n");
  equal(lines[0], "Party,Code,Email,Guest,Status,Meal,Dietary,Song request,Note,Replied at");
  equal(lines[1], `"Lee, Sam",LEE111,,Sam Lee,Attending,Roasted halibut,,"Say ""yes""",,2026-09-01T12:00:00.000Z`);
});
