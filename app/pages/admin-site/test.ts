import { test, equal, session, sql } from "@elements/app";
import { saveSite, loadSiteForm, saveEvent } from "./services";
import { loadSite } from "#app/shared/services/wedding";

function signIn() {
  let u = sql<{ id: string }>(`insert into users (email, name, passwordHash) values ('c@x.com', 'C', 'x') returning id`).firstOrThrow();
  session.login({ userId: u.id, userName: "C" });
}

test("site editor", () => {
  test("wedding time is entered in the venue's time zone", () => {
    signIn();
    let form = loadSiteForm();
    form.partnerOne = "Maya";
    form.partnerTwo = "Theo";
    form.weddingLocal = "2026-11-14T16:30";
    saveSite(form);

    equal(loadSite().weddingAt.toISOString(), "2026-11-14T21:30:00.000Z");
    equal(loadSiteForm().weddingLocal, "2026-11-14T16:30");
  });

  test("events save and list in time order", () => {
    signIn();
    // The list is asserted whole, so start from an empty events table. The transaction rolls back.
    sql(`delete from events`);
    saveEvent({ id: "", name: "Brunch", startsLocal: "2026-11-15T10:30", place: "", address: "", attire: "", details: "" });
    let events = saveEvent({ id: "", name: "Drinks", startsLocal: "2026-11-13T19:00", place: "", address: "", attire: "", details: "" });
    equal(events.map((e) => e.name), ["Drinks", "Brunch"]);
  });
});
