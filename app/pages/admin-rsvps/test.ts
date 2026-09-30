import { test, equal, assert, session, sql } from "@elements/app";
import { trackerStats, partyStatus, visibleParties, fetchParties } from "./template";
import { Party } from "#app/shared/services/guests";

function party(name: string, respondedAt: Date | null, guests: [boolean | null, string | null][]): Party {
  return {
    id: name,
    name,
    code: name.toUpperCase(),
    email: "",
    song: respondedAt ? `${name} song` : "",
    message: "",
    respondedAt,
    createdAt: new Date(),
    guests: guests.map(([attending, meal], i) => ({
      id: `${name}-${i}`, partyId: name, position: i, name: `${name} ${i}`, attending, meal: meal as any, dietary: i === 0 && attending ? "gluten free" : "",
    })),
  };
}

const parties = [
  party("ames", new Date("2026-09-20"), [[true, "beef"], [true, "fish"]]),
  party("bell", new Date("2026-09-22"), [[false, null]]),
  party("cho", null, [[null, null], [null, null]]),
];

test("rsvp tracker", () => {
  test("counts guests by answer and meal", () => {
    let s = trackerStats(parties);
    equal([s.invited, s.attending, s.declined, s.waiting], [5, 2, 1, 2]);
    equal([s.partiesReplied, s.parties], [2, 3]);
    equal(s.meals.map((m) => m.count), [1, 1, 0, 0]);
    equal(s.dietary, [{ who: "ames 0", note: "gluten free" }]);
    equal(s.songs.length, 2);
  });

  test("status and filtering", () => {
    equal(parties.map(partyStatus), ["attending", "declined", "waiting"]);
    equal(visibleParties({ parties, filter: "waiting", search: "", fresh: "" }).map((p) => p.name), ["cho"]);
    equal(visibleParties({ parties, filter: "all", search: "BELL", fresh: "" }).map((p) => p.name), ["bell"]);
    equal(visibleParties({ parties, filter: "all", search: "", fresh: "" })[0].name, "bell");
  });

  test("the rpc is for the couple only", () => {
    try {
      fetchParties();
      assert(false, "expected an AuthError");
    } catch (err: any) {
      equal(err.statusCode, 401);
    }

    let u = sql<{ id: string }>(`insert into users (email, name, passwordHash) values ('c@x.com', 'C', 'x') returning id`).firstOrThrow();
    session.login({ userId: u.id, userName: "C" });
    assert(Array.isArray(fetchParties()));
  });
});
