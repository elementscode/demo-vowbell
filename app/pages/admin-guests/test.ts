import { test, equal, session, sql } from "@elements/app";
import { importCsv, addParty } from "./template";
import { parseCsv } from "#app/shared/services/csv";
import { loadParties } from "#app/shared/services/guests";

test("guest list", () => {
  test("parses quoted csv fields", () => {
    equal(parseCsv('a,"b, c","say ""hi"""\r\n\r\nd,e,f\n'), [["a", "b, c", 'say "hi"'], ["d", "e", "f"]]);
  });

  test("import groups rows into parties, skips bad rows, and gives each a code", () => {
    let result = importCsv("party,guest,email\nThe Okoros,Chidi Okoro,CHIDI@x.com\nThe Okoros,Ngozi Okoro,\nSam Lee,Sam Lee,\n,No Party,\n");
    equal(result, { parties: 2, guests: 3, skipped: 1 });

    let okoros = loadParties().find((p) => p.name === "The Okoros")!;
    equal(okoros.guests.map((g) => g.name), ["Chidi Okoro", "Ngozi Okoro"]);
    equal(okoros.email, "chidi@x.com");
    equal(okoros.code.length, 6);
  });

  test("importing a name already on the list adds to that party", () => {
    importCsv("The Okoros,Chidi Okoro\n");
    importCsv("the okoros,Baby Okoro\n");
    let okoros = loadParties().filter((p) => p.name === "The Okoros");
    equal(okoros.length, 1);
    equal(okoros[0].guests.map((g) => g.name), ["Chidi Okoro", "Baby Okoro"]);
  });

  test("adding a party needs the couple signed in", () => {
    try {
      addParty("X", "", "Y");
      equal("no error", "AuthError");
    } catch (err: any) {
      equal(err.statusCode, 401);
    }

    let u = sql<{ id: string }>(`insert into users (email, name, passwordHash) values ('c@x.com', 'C', 'x') returning id`).firstOrThrow();
    session.login({ userId: u.id, userName: "C" });
    let parties = addParty("Grandma Rosa", "", "Rosa\n\n");
    equal(parties.find((p) => p.name === "Grandma Rosa")?.guests.length, 1);
  });
});
