import { test, equal, assert, errorf, sql } from "@elements/app";
import { findInvitation, submitRsvp, replyFor, RsvpReply } from "./template";

function seedParty(): string {
  let p = sql<{ id: string }>(
    `insert into parties (name, code, email) values ('The Testers', 'TEST42', 'old@example.com') returning id`,
  ).firstOrThrow();

  sql(`insert into guests (partyId, position, name) values (${p.id}, 0, 'Ada Tester'), (${p.id}, 1, 'Bo Tester')`);

  return p.id;
}

function replyError(reply: RsvpReply): string {
  try {
    submitRsvp(reply);
    return "";
  } catch (err: any) {
    return err.message;
  }
}

test("rsvp", () => {
  test("finds a party by code, ignoring case and spacing", () => {
    seedParty();
    let party = findInvitation(" test-42 ");
    equal(party.name, "The Testers");
    equal(party.guests.map((g) => g.name), ["Ada Tester", "Bo Tester"]);
  });

  test("an unknown code is a friendly not found", () => {
    try {
      findInvitation("NOPE99");
      errorf("expected a not found error");
    } catch (err: any) {
      equal(err.statusCode, 404);
      assert(/couldn't find that code/.test(err.message), err.message);
    }
  });

  test("every guest needs an answer, and attending guests a meal", () => {
    seedParty();
    let reply = replyFor(findInvitation("TEST42"));
    reply.guests[0].attending = true;
    reply.guests[0].meal = "fish";
    equal(replyError(reply), "Let us know whether Bo Tester can come.");

    reply.guests[1].attending = true;
    equal(replyError(reply), "Choose a dinner for Bo Tester.");
  });

  test("saves the reply and marks the party responded", () => {
    let id = seedParty();
    let reply = replyFor(findInvitation("TEST42"));
    reply.email = "New@Example.com";
    reply.song = "Dreams";
    reply.guests[0] = { ...reply.guests[0], attending: true, meal: "veg", dietary: "No nuts" };
    reply.guests[1] = { ...reply.guests[1], attending: false, meal: "beef", dietary: "ignored" };

    let saved = submitRsvp(reply);

    equal(saved.email, "new@example.com");
    equal(saved.song, "Dreams");
    assert(saved.respondedAt !== null, "respondedAt should be set");
    equal(saved.guests.map((g) => [g.attending, g.meal, g.dietary]), [[true, "veg", "No nuts"], [false, null, ""]]);

    let row = sql<{ n: number }>(`select count(*)::int as n from guests where partyId = ${id} and attending is not null`).firstOrThrow();
    equal(row.n, 2);
  });
});
