![Vowbell, a wedding website built with Elements: the home page hero with the couple's names, the date and place, and a countdown to the ceremony.](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6/poster?v=5b0b89c94288)

# Vowbell

> A demo app built with [Elements](https://elements.dev).

A wedding site with a countdown, RSVPs by invite code with meal choices, CSV guest import, and a live RSVP tracker.

**Demo:** [Vowbell](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6)

## Agent specs

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 23 min
- **Cost:** $7.87 at API rates, September 2026

## Get started

```bash
elements create vowbell -scaffold=elementscode/demo-vowbell
```

## How it's built

Vowbell needed a public wedding site, RSVPs by invite code with a confirmation email, a guest list the couple can import from a spreadsheet, and a tracker that fills in as replies arrive. Each of those is a part of Elements, so the agent spent its 23 minutes on the wedding itself.

### What Elements gave the app

- **RSVPs as function calls.** The RSVP page finds a party by its invite code and saves every guest's answer and meal choice in one transaction through an `@rpc` written right in the page's template, then emails a confirmation.

- **A live tracker.** Every RSVP and guest list edit notifies a channel, and the couple's tracker listens on it, so a reply shows up in the counts while they watch. The replies export as CSV.

- **Guest import.** The guests page sends a CSV file to an rpc that reads the rows into parties and gives each one a six-character invite code from an alphabet chosen to read cleanly off paper.

- **Site editing and photos.** The couple edits the story, events, hotels and gallery through rpcs. Photo uploads arrive as `File` values and are served under their content hash, and the seed photos and display font ship as assets.

- **Data from SQL files.** Two migrations define the wedding and seed the couple, their story and gallery, events, hotels, and 40 parties with 80 guests, about half of whom have replied.

- **Sessions.** Every admin rpc and the CSV export check that the signed-in user is one of the couple.

### What the project server gave the agent

The project server runs alongside the agent and answers as soon as a file is saved: it type-checks the templates, TypeScript and SQL, applies migrations and reruns the tests, so every question came back right away and the agent kept building.

### What shipped

The app type-checks with zero errors and all 18 tests pass. Every page works on desktop and phone, and a guest's RSVP shows up on the couple's tracker as it arrives.

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

**Demo:** [Vowbell](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6)

## License

MIT. See [LICENSE](LICENSE).
