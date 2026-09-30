-- add wedding schema

-- Auto-update updatedAt on row changes.
create or replace function touchUpdatedAt()
returns trigger
language plpgsql
as $$
begin
  new.updatedAt = now();
  return new;
end;
$$;

-- The couple's admin accounts.
create table users (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  email text not null unique,
  name text not null,
  passwordHash text not null
);

create trigger usersTouchUpdatedAt
  before update on users
  for each row execute function touchUpdatedAt();

-- One row of editable site copy.
create table site (
  id integer primary key default 1 check (id = 1),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  partnerOne text not null default '',
  partnerTwo text not null default '',
  weddingAt timestamptz not null default now(),
  timeZone text not null default 'America/New_York',
  venue text not null default '',
  city text not null default '',
  tagline text not null default '',
  storyTitle text not null default 'Our story',
  story text not null default '',
  travel text not null default '',
  rsvpBy date,
  coverPhotoId uuid
);

create trigger siteTouchUpdatedAt
  before update on site
  for each row execute function touchUpdatedAt();

insert into site (id) values (1);

create table events (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  position integer not null default 0,
  name text not null,
  startsAt timestamptz not null,
  place text not null default '',
  address text not null default '',
  attire text not null default '',
  details text not null default ''
);

create trigger eventsTouchUpdatedAt
  before update on events
  for each row execute function touchUpdatedAt();

create table hotels (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  position integer not null default 0,
  name text not null,
  address text not null default '',
  url text not null default '',
  details text not null default ''
);

create trigger hotelsTouchUpdatedAt
  before update on hotels
  for each row execute function touchUpdatedAt();

-- A gallery photo is either an upload (data) or a file shipped with the app
-- (asset), which is how the seed photos arrive.
create table photos (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  position integer not null default 0,
  caption text not null default '',
  asset text,
  contentType text,
  data bytea,
  hash text generated always as (encode(sha256(data), 'hex')) stored,
  check (asset is not null or data is not null)
);

create trigger photosTouchUpdatedAt
  before update on photos
  for each row execute function touchUpdatedAt();

alter table site
  add foreign key (coverPhotoId) references photos(id) on delete set null;

-- A party is one invitation: its code opens the RSVP for everyone on it.
create table parties (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  name text not null,
  code text not null unique,
  email text not null default '',
  song text not null default '',
  message text not null default '',
  respondedAt timestamptz
);

create trigger partiesTouchUpdatedAt
  before update on parties
  for each row execute function touchUpdatedAt();

create table guests (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  partyId uuid not null references parties(id) on delete cascade,
  position integer not null default 0,
  name text not null,
  attending boolean,
  meal text check (meal in ('beef', 'fish', 'veg', 'kids')),
  dietary text not null default ''
);

create index guestsPartyIdx on guests (partyId, position);

create trigger guestsTouchUpdatedAt
  before update on guests
  for each row execute function touchUpdatedAt();
