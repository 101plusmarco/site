/* ==========================================================
   content.js
   everything you actually want to edit lives here.
   the html/css/js files are the furniture; this is the stuff in it.
   ========================================================== */

/* basic details, weather location and contact */
const siteConfig = {
  handle: 'fiskal',
  city: 'London',
  // used for the live weather line in the footer (open-meteo, no key needed)
  latitude: 51.5072,
  longitude: -0.1276,

  pfpImage: 'pfp.png',
  pfpAlt: "fiskal's profile picture",

  discord: 'fiscalyear'
};

const commitLog = [
  { hash: 'JE-0001', date: '2018', message: 'cr: first bank account, balance very messy' },
  { hash: 'JE-0002', date: '2019', message: 'adj: stopped paying in cash (finally)' },
  { hash: 'JE-0003', date: '2023', message: 'dr: software engineering is not for me' },
  { hash: 'JE-0004', date: '2025', message: "cr: accounting instead (a much better decision)" },
  { hash: 'JE-0005', date: '2026', message: 'bal: unemployed. lots of free time, probably way too much' },
];

const skillList = [
  { name: 'Excel', note: 'lowk elite', level: 62 },
  { name: 'Bank reconciliations', note: 'boxes inside boxes, all matched', level: 83 },
  { name: 'Tax returns', note: "yay... taxes", level: 84 },
  { name: 'Xero & QuickBooks', note: 'enough to be dangerous', level: 71 },
  { name: 'IFRS & Swiss GAAP FER', note: 'at least i know where the decimal points go', level: 75 },
];

const heroGreetings = [
  "hiya, i'm ",
  "oi mate, i'm ",
  "alright, i'm ",
  "wotcha, i'm ",
  "ay up, i'm ",
  "evening, i'm ",
  "right then, i'm ",
  "cheers, i'm "
];

const pfpLines = [
  "alright, you've found me.",
  'mind the gap, i\'m not moving.',
  "it's bloody parky in here, isn't it.",
  'put the kettle on, then we can talk.',
  'there is a queue for the loo. do not ask.',
  "that's a proper British drizzle out there.",
  'sorry, i\'m in a queue. the queue is also me.',
  "i'm not hungry, i'm peckish.",
  'greggs or nothing, mate.',
  'cheers. genuinely. you\'re a legend.',
  "the rail replacement bus is 20 minutes late, of course it is.",
  "mate, that's a bit much. have a brew.",
  'the weather is grey and so am i, lovely.',
  "i'd tell you the time but the bus has already gone.",
  'right, that\'s me done for the day. ta-ra.'
];

