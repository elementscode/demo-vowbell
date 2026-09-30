![Vowbell, a wedding website built with Elements: the home page hero with the couple's names, the date and place, and a countdown to the ceremony.](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6/poster?v=5b0b89c94288)

# Vowbell

> A demo app built with [Elements](https://elements.dev).

A wedding site with a countdown, RSVPs by invite code with meal choices, CSV guest import, and a live RSVP tracker.

**Demo:** [Vowbell](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6)

## Agent specs

What one run of the prompt below took, from an empty Elements project to this
app.

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 23 min
- **Cost:** $7.87 at API rates, September 2026

## Get started

```bash
elements create vowbell -scaffold=elementscode/demo-vowbell
```

## What's built

- **Home page (`/`):** the couple's names, date and place over a cover photo, a
  countdown that ticks every second, the story, the weekend schedule, travel
  notes and hotels, and a photo gallery that opens full screen.
- **RSVP (`/rsvp`):** guests enter the code from their invitation. Each person
  in the party accepts or declines and picks a dinner, with dietary notes, plus
  a song request and a note for the couple. A confirmation email follows, and
  the same code changes the reply later.
- **RSVP tracker (`/admin`):** invited, attending, declined and waiting counts,
  meal totals, dietary notes and song requests, and a searchable list of
  parties. It updates live as replies come in. Export CSV writes one row per
  guest.
- **Guest list (`/admin/guests`):** parties with their invite codes and RSVP
  links, and a CSV import (party, guest, email).
- **Site & photos (`/admin/site`):** edit the names, date, venue, story,
  schedule, travel notes and hotels, and upload, caption, reorder and pick the
  cover photo.

## Seed data and demo account

The seed is Maya Castellanos and Theo Whitaker's wedding on Saturday,
November 14, 2026 in Hudson, New York: five events, three hotels, fifteen
photos, and 80 guests in 40 parties, half of which have replied. Party code
`ROSE26` has not replied yet, so it is ready for a test RSVP.

| Email                | Password      | Role   |
| -------------------- | ------------- | ------ |
| couple@vowbell.dev   | `vowbell2026` | couple |

The sign-in page at `/signin` shows this login. In development, confirmation
emails are written to the server log instead of being sent.

The seed photos are CC0 images from Wikimedia Commons.

## The prompt

```text
Build a wedding website named vowbell.

GUEST
- A beautiful home page: the couple's names, date, a countdown, the story,
  schedule of events, travel and hotel info, and a photo gallery.
- RSVP with a code from the invitation: attending or not for each person in
  the party, meal choice, dietary notes, and a song request.
- A confirmation email.

COUPLE (admin account)
- Edit the site's content and photos.
- Guest list with parties and invite codes; import from CSV.
- RSVP tracker: attending, declined, waiting, meal counts, and a CSV export.

Seed the couple, the site content with photos, and eighty guests in forty
parties, about half responded. Show the admin login on the sign-in page.

The RSVP tracker updates in real time.
```

## License

MIT. See [LICENSE](LICENSE).
