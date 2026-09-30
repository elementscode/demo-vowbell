import { Request, Response } from "@elements/app";
import { coupleOrThrow } from "#app/shared/services/auth";
import { mealLabel } from "#app/shared/services/wedding";
import { loadParties } from "#app/shared/services/guests";
import { csvRow } from "#app/shared/services/csv";

export function rsvpCsv(): string {
  let lines = [csvRow(["Party", "Code", "Email", "Guest", "Status", "Meal", "Dietary", "Song request", "Note", "Replied at"])];

  for (let p of loadParties()) {
    for (let g of p.guests) {
      let status = g.attending === true ? "Attending" : g.attending === false ? "Declined" : "Waiting";

      lines.push(csvRow([
        p.name,
        p.code,
        p.email,
        g.name,
        status,
        g.attending ? mealLabel(g.meal) : "",
        g.dietary,
        p.song,
        p.message,
        p.respondedAt ? p.respondedAt.toISOString() : "",
      ]));
    }
  }

  return lines.join("\r\n") + "\r\n";
}

export default function route(req: Request, res: Response) {
  coupleOrThrow();

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="rsvps.csv"`);
  res.setHeader("Cache-Control", "no-store");
  res.write(rsvpCsv());
  res.end();
}
