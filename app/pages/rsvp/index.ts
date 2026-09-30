import { Request, Response } from "@elements/app";
import { loadSite } from "#app/shared/services/wedding";
import { loadPartyByCode } from "#app/shared/services/guests";
import html from "./template";

export default function route(req: Request, res: Response) {
  let code = typeof req.query.code === "string" ? req.query.code : "";

  return new html({
    site: loadSite(),
    initial: code ? loadPartyByCode(code) ?? null : null,
    initialCode: code,
  });
}
