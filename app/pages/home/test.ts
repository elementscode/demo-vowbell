import { test, equal } from "@elements/app";
import { countdown, scheduleLines } from "./template";
import { WeddingEvent } from "#app/shared/services/wedding";

function event(id: string, iso: string): WeddingEvent {
  return { id, position: 0, name: id, startsAt: new Date(iso), place: "", address: "", attire: "", details: "" };
}

test("home", () => {
  test("countdown splits the time left", () => {
    let c = countdown(new Date("2026-11-14T21:30:00Z"), new Date("2026-11-12T19:25:10Z"));
    equal(c, { days: 2, hours: 2, minutes: 4, seconds: 50, done: false });
  });

  test("countdown stops at zero once the day arrives", () => {
    let c = countdown(new Date("2026-11-14T21:30:00Z"), new Date("2026-11-15T00:00:00Z"));
    equal(c.done, true);
    equal(c.days, 0);
  });

  test("schedule flags the first event of each day in the venue's time zone", () => {
    let lines = scheduleLines([
      event("drinks", "2026-11-14T00:00:00Z"),
      event("ceremony", "2026-11-14T21:30:00Z"),
      event("dinner", "2026-11-14T23:30:00Z"),
    ], "America/New_York");

    equal(lines.map((l) => l.startsDay), [true, true, false]);
    equal(lines[0].day, "Friday, November 13");
  });
});
