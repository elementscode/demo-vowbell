import { Request, Response, redirect, session } from "@elements/app";
import { loadSite } from "#app/shared/services/wedding";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (session.isLoggedIn()) {
    redirect("/admin");
    return;
  }

  return new html({ site: loadSite() });
}
