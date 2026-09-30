import { Request, Response } from "@elements/app";
import { coupleOrRedirect } from "#app/shared/services/auth";
import { loadSite, loadPhotos, coupleNames } from "#app/shared/services/wedding";
import { loadSiteForm, loadEventForms, loadHotelForms } from "./services";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (!coupleOrRedirect()) {
    return;
  }

  return new html({
    names: coupleNames(loadSite()),
    site: loadSiteForm(),
    events: loadEventForms(),
    hotels: loadHotelForms(),
    photos: loadPhotos(),
  });
}
