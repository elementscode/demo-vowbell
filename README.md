![A wedding website with RSVPs, built by Claude Code on Elements: the home page hero with the couple's names, the date and place, and a countdown to the ceremony.](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6/poster?v=5b0b89c94288)

# A wedding website with RSVPs, built by Claude Code on Elements

> Vowbell is a full-stack app built with Claude Code on Elements.

A wedding site with a countdown, RSVPs by invite code with meal choices, CSV guest import, and a live RSVP tracker.

[Run this app on your machine](https://elements.dev/demos/01a0f429-2d0f-7fde-8ea7-775ea6066cd6). Use this demo as inspiration, or as the starting point for your own app. Your agent creates a new app with this one as the scaffold, and you prompt it to add whatever features you want.

## How it's built

Vowbell needed a public wedding site, RSVPs by invite code with a confirmation email, a guest list the couple can import from a spreadsheet, and a tracker that fills in as replies arrive. Each of those is a part of Elements, so the agent spent its 23 minutes on the wedding itself.

- **RSVPs as function calls.** The RSVP page finds a party by its invite code and saves every guest's answer and meal choice in one transaction through an `@rpc` written right in the page's template, then emails a confirmation.

- **A live tracker.** Every RSVP and guest list edit notifies a channel, and the couple's tracker listens on it, so a reply shows up in the counts while they watch. The replies export as CSV.

- **Guest import.** The guests page sends a CSV file to an rpc that reads the rows into parties and gives each one a six-character invite code from an alphabet chosen to read cleanly off paper.

- **Site editing and photos.** The couple edits the story, events, hotels and gallery through rpcs. Photo uploads arrive as `File` values and are served under their content hash, and the seed photos and display font ship as assets.

- **Data from SQL files.** Two migrations define the wedding and seed the couple, their story and gallery, events, hotels, and 40 parties with 80 guests, about half of whom have replied.

- **Sessions.** Every admin rpc and the CSV export check that the signed-in user is one of the couple.

## Why Elements

Elements is an integrated full-stack app framework and a project server. The project server checks the agent's work as it builds: it type-checks the server and browser code, analyzes the program, applies migrations and runs the tests, then reports the results to the agent. A security mistake, such as calling a server-only function from the browser, is a compile error. The agent reads the report and fixes its own mistakes before it tells you a feature is done. The same checks run on every feature you ask for next.
