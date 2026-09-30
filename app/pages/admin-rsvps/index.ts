import { Request, Response } from "@elements/app";
import { coupleOrRedirect } from "#app/shared/services/auth";
import { loadSite, coupleNames } from "#app/shared/services/wedding";
import { loadParties, rsvpChannel } from "#app/shared/services/guests";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (!coupleOrRedirect()) {
    return;
  }

  return new html({
    names: coupleNames(loadSite()),
    initial: loadParties(),
    listener: rsvpChannel.listen(),
  });
}
