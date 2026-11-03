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

/*
  projects
  status is one of:
  - 'shipped'
  - 'shipped (bugs included)'
  - 'abandoned but cool'
  - 'works on my machine'
  the badge colour is picked automatically from the status text.
*/
const projectList = [
  {
    title: 'modular round & ability system',
    summary: 'a scalable round-based system with an integrated ability framework. built for clean extensibility and structured client-server communication.',
    stack: ['Roblox Lua', 'RemoteEvents', 'Modular architecture', 'State management'],
    status: 'shipped',
    note: 'for sale (ask nicely)',
    url: 'https://fbrand.uk/other/round_system_docs',
    linkLabel: 'read the docs'
  },
  {
    title: 'modular rng case system',
    summary: 'weighted tier rolling, a pity system, inventory management, global events and secure datastore saving. the case opening is the easy part. the pity system is where i lost a weekend.',
    stack: ['Roblox Lua', 'Weighted RNG', 'DataStore', 'Modular'],
    status: 'shipped',
    note: 'for sale',
    url: 'https://fbrand.uk/other/rng_system_docs',
    linkLabel: 'read the docs'
  }
];

const commitLog = [
  { hash: 'a1f3c9e', date: '2018', message: 'feat: first website, made from a tutorial and very messy' },
  { hash: 'b72d10a', date: '2019', message: 'fix: stopped using var (finally)' },
  { hash: 'c0ffee1', date: '2021', message: 'feat: software engineering is not for me' },
  { hash: 'c0ffee1', date: '2025', message: 'feat: let\'s do accounting instead' },
  { hash: 'e9a8b7c', date: '2026', message: 'feat: unemployed. lots of free time, probably way too much' },
];

const skillList = [
  { name: 'Lua (Roblox)', note: 'lowk elite', level: 26 },
  { name: 'Modular architecture', note: 'boxes inside boxes, all labelled', level: 63 },
  { name: 'JavaScript', note: "it's giving centred div", level: 52 },
  { name: 'Accounting', note: 'the spreadsheets are on me', level: 100 },
  { name: 'React & SQL', note: 'enough to be dangerous', level: 39 },
  { name: 'Java / C++', note: 'at least i know where the semicolons go', level: 32 },
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

const terminalAbout = [
  'fiskal: unemployed asl.',
  'i\'m an accountant. i work with money, yeah. no, it\'s not just math.'
];
