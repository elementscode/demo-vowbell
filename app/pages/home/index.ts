import { Request, Response } from "@elements/app";
import { loadSite, loadEvents, loadHotels, loadPhotos } from "#app/shared/services/wedding";
import html from "./template";

export default function route(req: Request, res: Response) {
  return new html({
    site: loadSite(),
    events: loadEvents(),
    hotels: loadHotels(),
    photos: loadPhotos(),
  });
}
