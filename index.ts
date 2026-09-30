import { App } from "@elements/app";
import config from "#config";
import home from "#app/pages/home";
import rsvp from "#app/pages/rsvp";
import signin from "#app/pages/signin";
import adminRsvps from "#app/pages/admin-rsvps";
import adminGuests from "#app/pages/admin-guests";
import adminSite from "#app/pages/admin-site";
import rsvpsCsv from "#app/routes/rsvps-csv";
import servePhoto from "#app/routes/photos";
import notFound from "#app/pages/errors/not-found";
import unhandled from "#app/pages/errors/unhandled";

const app = new App();

app.route("/", home);
app.route("/rsvp", rsvp);
app.route("/signin", signin);
app.route("/admin", adminRsvps);
app.route("/admin/rsvps.csv", rsvpsCsv);
app.route("/admin/guests", adminGuests);
app.route("/admin/site", adminSite);
app.route("/photos/:id/:hash", servePhoto);

app.error((req, res, err) => {
  switch (err.statusCode) {
    case 404:
      return notFound(req, res, err);

    default:
      return unhandled(req, res, err);
  }
});

app.start(config);
