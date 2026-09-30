-- demo couple, site content, photos and guests
/** @env development */

insert into users (email, name, passwordHash) values
  ('couple@vowbell.dev', 'Maya & Theo', crypt('vowbell2026', genSalt('bf', 12)));

insert into photos (position, caption, asset) values
  (0, 'The aisle, waiting for us', 'photo-01'),
  (1, 'The long way home, the day we got engaged', 'photo-02'),
  (2, 'Chapter one', 'photo-03'),
  (3, 'Hands, rings, roses', 'photo-04'),
  (4, 'The road up to Glenmere', 'photo-05'),
  (5, 'Farm stand peonies', 'photo-06'),
  (6, 'Windfalls, our first date', 'photo-07'),
  (7, 'The Long Barn, set for dinner', 'photo-08'),
  (8, 'Our walk after the proposal', 'photo-09'),
  (9, 'Choose your shoes kindly', 'photo-10'),
  (10, 'Apple blossoms in May', 'photo-11'),
  (11, 'The bouquet, take two', 'photo-12'),
  (12, 'Flowers for the tables', 'photo-13'),
  (13, 'Golden hour in the meadow', 'photo-14'),
  (14, 'Two bands, one promise', 'photo-15');

update site set
  partnerOne = 'Maya Castellanos',
  partnerTwo = 'Theo Whitaker',
  weddingAt = '2026-11-14 16:30:00-05',
  timeZone = 'America/New_York',
  venue = 'Glenmere Orchard',
  city = 'Hudson, New York',
  tagline = 'Join us in the orchard where it all began.',
  storyTitle = 'How we got here',
  story = 'We met on a rainy Tuesday in the fall of 2019, both reaching for the last copy of the same paperback at a bookshop on Warren Street. Theo let Maya have it. Maya insisted he borrow it when she was done. It took her four months to finish, mostly on purpose.

Our first real date was apple picking at an orchard just outside Hudson, where Theo confidently led us into the wrong field and we spent an hour eating windfalls in the grass. We have gone back every October since, and it has become the place where the big things happen.

So when Theo proposed there last fall, under the same crooked tree, Maya said yes before he finished the question. We cannot imagine celebrating anywhere else, or with anyone other than the people who have cheered us on the whole way. Thank you for being one of them.',
  travel = 'The closest airport is Albany International (ALB), about 45 minutes north of Hudson. New York''s JFK, LaGuardia and Newark are all about two and a half hours away by car.

Amtrak''s Empire Service runs from Penn Station to Hudson in two hours, and the station is a short walk from Warren Street. It is the easiest way up from the city, and the views along the river are worth the trip.

On Saturday a shuttle will loop between the three hotels below and Glenmere Orchard, leaving from 3:30 pm and running back until midnight. Please leave the car behind and let us drive.',
  rsvpBy = '2026-10-17',
  coverPhotoId = (select id from photos where asset = 'photo-01')
where id = 1;

insert into events (position, name, startsAt, place, address, attire, details) values
  (0, 'Welcome drinks', '2026-11-13 19:00:00-05', 'The Hudson Tavern', '302 Warren Street, Hudson, NY', 'Come as you are', 'Arriving Friday? Come find us for a drink and a bite. No speeches, we promise.'),
  (1, 'Ceremony', '2026-11-14 16:30:00-05', 'The Orchard Meadow', 'Glenmere Orchard, 41 Glenmere Road, Hudson, NY', 'Cocktail attire', 'Outdoors under the old apple trees. The meadow is grass, so choose your shoes kindly, and bring a layer for when the sun goes down.'),
  (2, 'Cocktail hour', '2026-11-14 17:15:00-05', 'The Cider Barn', 'Glenmere Orchard', 'Cocktail attire', 'Hot cider, orchard cocktails, and a fire pit on the terrace.'),
  (3, 'Dinner & dancing', '2026-11-14 18:30:00-05', 'The Long Barn', 'Glenmere Orchard', 'Cocktail attire', 'A family-style dinner, a few toasts, and a band that knows every song you requested.'),
  (4, 'Farewell brunch', '2026-11-15 10:30:00-05', 'The Warren House', '118 Warren Street, Hudson, NY', 'Casual', 'Coffee, pastries and one last hug before the drive home. Drop in any time until 1 pm.');

insert into hotels (position, name, address, url, details) values
  (0, 'The Warren House', '118 Warren Street, Hudson, NY', 'https://example.com/warren-house', 'Our room block: mention Castellanos-Whitaker for $219 a night. Book by October 14.'),
  (1, 'The Orchard Inn', '9 Glenmere Road, Hudson, NY', 'https://example.com/orchard-inn', 'A five-minute walk from the ceremony. Twelve rooms, so book early.'),
  (2, 'Riverside Motor Lodge', '770 Front Street, Catskill, NY', 'https://example.com/riverside-lodge', 'Just across the river, with a shuttle stop out front. Use code VOWBELL for 15% off.');

-- 40 parties, 80 guests. About half have responded.
with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Sofia & Noah Moreau', 'ROSE26', 'sofia.moreau@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Sofia Moreau', null, null, ''), ((select id from p), 1, 'Noah Moreau', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Hannah Dubois', 'BS7K7G', 'hannah.dubois@example.com', '', 'We would not miss it for the world.', now() - interval '20 days 23 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Hannah Dubois', true, 'beef', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Talia & Zoe Brennan', 'ZDYT62', 'talia.brennan@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Talia Brennan', null, null, ''), ((select id from p), 1, 'Zoe Brennan', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Wes & Isabel Rossi', 'A88R63', 'wes.rossi@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Wes Rossi', null, null, ''), ((select id from p), 1, 'Isabel Rossi', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Arlo & Ruby Haddad', 'CB89C4', 'arlo.haddad@example.com', 'Sweet Caroline - Neil Diamond', '', now() - interval '14 days 7 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Arlo Haddad', false, null, ''), ((select id from p), 1, 'Ruby Haddad', true, 'beef', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Kowalski Family', 'AEUUSV', 'ava.kowalski@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Ava Kowalski', null, null, ''), ((select id from p), 1, 'Elias Kowalski', null, null, ''), ((select id from p), 2, 'Jude Kowalski', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Daniel & Kenji Bennett', '7TQZY8', 'daniel.bennett@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Daniel Bennett', null, null, ''), ((select id from p), 1, 'Kenji Bennett', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Carter Family', '77BMG5', 'jonah.carter@example.com', 'This Will Be (An Everlasting Love) - Natalie Cole', 'Save us a spot on the dance floor.', now() - interval '12 days 22 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Jonah Carter', true, 'fish', ''), ((select id from p), 1, 'Caleb Carter', true, 'fish', 'Dairy free'), ((select id from p), 2, 'Lola Carter', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Marcus & Olivia Abara', 'U62Y47', 'marcus.abara@example.com', 'I Wanna Dance with Somebody - Whitney Houston', 'So sorry we cannot make it. Sending all our love.', now() - interval '8 days 9 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Marcus Abara', false, null, ''), ((select id from p), 1, 'Olivia Abara', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Mensah Family', 'YJAP5P', 'naomi.mensah@example.com', '', 'Save us a spot on the dance floor.', now() - interval '8 days 12 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Naomi Mensah', true, 'veg', 'Vegan if possible'), ((select id from p), 1, 'James Mensah', true, 'veg', ''), ((select id from p), 2, 'Milo Mensah', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Novak Family', '37UUYJ', 'lucas.novak@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Lucas Novak', null, null, ''), ((select id from p), 1, 'Harper Novak', null, null, ''), ((select id from p), 2, 'Bea Novak', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Chloe & Grace Hernandez', 'YPG5FZ', 'chloe.hernandez@example.com', 'Mr. Brightside - The Killers', 'We would not miss it for the world.', now() - interval '5 days 18 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Chloe Hernandez', true, 'veg', ''), ((select id from p), 1, 'Grace Hernandez', true, 'veg', 'No shellfish, please');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Ethan & June Reyes', 'DF5EFB', 'ethan.reyes@example.com', '', 'Cannot wait to celebrate you two!', now() - interval '20 days 14 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Ethan Reyes', true, 'veg', 'Gluten free'), ((select id from p), 1, 'June Reyes', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Ines & Diego Okafor', '6FVZQB', 'ines.okafor@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Ines Okafor', null, null, ''), ((select id from p), 1, 'Diego Okafor', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Rhys & Freya Schmidt', 'KF5TW9', 'rhys.schmidt@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Rhys Schmidt', null, null, ''), ((select id from p), 1, 'Freya Schmidt', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Murphy Family', '8UTZH5', 'esme.murphy@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Esme Murphy', null, null, ''), ((select id from p), 1, 'Maren Murphy', null, null, ''), ((select id from p), 2, 'Jude Murphy', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Priya Nguyen', 'CWQD4F', 'priya.nguyen@example.com', '', '', now() - interval '6 days 9 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Priya Nguyen', true, 'veg', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Iris Lindqvist', 'EW3HMB', 'iris.lindqvist@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Iris Lindqvist', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Julian Ferreira', '9WB58N', 'julian.ferreira@example.com', 'Golden Hour - JVKE', 'Save us a spot on the dance floor.', now() - interval '6 days 18 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Julian Ferreira', true, 'beef', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Ivan & Mia Alvarez', '9R8PCS', 'ivan.alvarez@example.com', '', 'Congratulations! See you in the orchard.', now() - interval '11 days 11 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Ivan Alvarez', true, 'veg', 'Dairy free'), ((select id from p), 1, 'Mia Alvarez', true, 'fish', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Tomas Sullivan', '5HRYGX', 'tomas.sullivan@example.com', 'Harvest Moon - Neil Young', 'Congratulations! See you in the orchard.', now() - interval '7 days 15 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Tomas Sullivan', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Yara & Amara Silva', 'DKA5DT', 'yara.silva@example.com', 'Harvest Moon - Neil Young', 'Cannot wait to celebrate you two!', now() - interval '15 days 4 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Yara Silva', true, 'beef', 'No shellfish, please'), ((select id from p), 1, 'Amara Silva', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Aiko & Hugo Kim', 'A586Q7', 'aiko.kim@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Aiko Kim', null, null, ''), ((select id from p), 1, 'Hugo Kim', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Duarte Family', 'JPRRNY', 'elena.duarte@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Elena Duarte', null, null, ''), ((select id from p), 1, 'Arjun Duarte', null, null, ''), ((select id from p), 2, 'Milo Duarte', null, null, ''), ((select id from p), 3, 'Jude Duarte', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Theo Laurent', 'SFWJZJ', 'theo.laurent@example.com', '', 'We would not miss it for the world.', now() - interval '7 days 10 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Theo Laurent', true, 'beef', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Mateo O''Brien', '7HRW5U', 'mateo.obrien@example.com', '', 'Congratulations! See you in the orchard.', now() - interval '9 days 18 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Mateo O''Brien', true, 'veg', '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Clara & Sadie Park', '35JUQR', 'clara.park@example.com', 'Golden Hour - JVKE', 'We would not miss it for the world.', now() - interval '11 days 22 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Clara Park', true, 'veg', ''), ((select id from p), 1, 'Sadie Park', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Benjamin Walsh', 'N7ZZF2', 'benjamin.walsh@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Benjamin Walsh', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Oscar & Liam Tanaka', 'RN3N8M', 'oscar.tanaka@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Oscar Tanaka', null, null, ''), ((select id from p), 1, 'Liam Tanaka', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Felix & Maya Adeyemi', '9S9W6T', 'felix.adeyemi@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Felix Adeyemi', null, null, ''), ((select id from p), 1, 'Maya Adeyemi', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Owen Fischer', 'UQT4T4', 'owen.fischer@example.com', 'This Will Be (An Everlasting Love) - Natalie Cole', 'We would not miss it for the world.', now() - interval '12 days 4 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Owen Fischer', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Omar & Lena Yamamoto', 'DJ3QDA', 'omar.yamamoto@example.com', 'Dreams - Fleetwood Mac', 'So sorry we cannot make it. Sending all our love.', now() - interval '10 days 8 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Omar Yamamoto', false, null, ''), ((select id from p), 1, 'Lena Yamamoto', false, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Nora & Leah Castellanos', 'YETXEQ', 'nora.castellanos@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Nora Castellanos', null, null, ''), ((select id from p), 1, 'Leah Castellanos', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Patel Family', 'Z7JC2Y', 'rafael.patel@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Rafael Patel', null, null, ''), ((select id from p), 1, 'Samuel Patel', null, null, ''), ((select id from p), 2, 'Jude Patel', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Kofi Cohen', 'UCHB7S', 'kofi.cohen@example.com', '', 'Congratulations! See you in the orchard.', now() - interval '11 days 3 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Kofi Cohen', true, 'beef', 'No shellfish, please');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Sofia & Ines Hughes', '4M3UG6', 'sofia.hughes@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Sofia Hughes', null, null, ''), ((select id from p), 1, 'Ines Hughes', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Esme & Elena Singh', 'QJABYC', 'esme.singh@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Esme Singh', null, null, ''), ((select id from p), 1, 'Elena Singh', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('The Byrne Family', 'QBRQJH', 'jonah.byrne@example.com', 'Sweet Caroline - Neil Diamond', 'Save us a spot on the dance floor.', now() - interval '6 days 9 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Jonah Byrne', false, null, ''), ((select id from p), 1, 'Iris Byrne', true, 'beef', ''), ((select id from p), 2, 'Lola Byrne', true, 'kids', ''), ((select id from p), 3, 'Finn Byrne', true, 'kids', 'Dairy free');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Ines & Sofia Whitaker', 'TQDWWJ', 'ines.whitaker@example.com', '', '', null) returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Ines Whitaker', null, null, ''), ((select id from p), 1, 'Sofia Whitaker', null, null, '');

with p as (insert into parties (name, code, email, song, message, respondedAt) values ('Oscar & Lena Chen', 'UZFXDE', 'oscar.chen@example.com', '', 'Cannot wait to celebrate you two!', now() - interval '21 days 4 hours') returning id)
insert into guests (partyId, position, name, attending, meal, dietary) values ((select id from p), 0, 'Oscar Chen', true, 'veg', ''), ((select id from p), 1, 'Lena Chen', false, null, '');

