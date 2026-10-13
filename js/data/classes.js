/* ─────────────────────────────────────────────────────────────────────────────
   AION 2 — classes, starters, specializations and icon settings.

   Source: AION 2 client data, build 0.0.4387.0. Evidence tag: data.
   ───────────────────────────────────────────────────────────────────────────── */

window.A2 = window.A2 || {};

/* Icons: drop icons/<skillId>.png (or .webp / .svg) and it is picked up
   automatically. A skill with no file falls back to a generated badge. */
window.A2.ICON_DIR = "icons";
window.A2.ICON_EXTS = ["png", "webp", "svg"];

/* The playable classes, in the client's own order.
   `key` is the client's class key, which is not always the display name:
   Spiritmaster = elementalist.

   Brawler (client key "fighter") is deliberately not listed. This client build
   has no names for it at all — name is null and the description reads "???" —
   and neither public database publishes its icons, so a page for it would be
   mostly IDs and placeholder badges. */
window.A2.CLASSES = [
  { key: "gladiator",    name: "Gladiator",    weapon: "Greatsword", prefix: 11 },
  { key: "templar",      name: "Templar",      weapon: "Sword",      prefix: 12 },
  { key: "assassin",     name: "Assassin",     weapon: "Dagger",     prefix: 13 },
  { key: "ranger",       name: "Ranger",       weapon: "Bow",        prefix: 14 },
  { key: "sorcerer",     name: "Sorcerer",     weapon: "Magicbook",  prefix: 15 },
  { key: "elementalist", name: "Spiritmaster", weapon: "Orb",        prefix: 16 },
  { key: "cleric",       name: "Cleric",       weapon: "Mace",       prefix: 17 },
  { key: "chanter",      name: "Chanter",      weapon: "Staff",      prefix: 18 }
];

/* Trigger keys: macro section names are virtual-key codes.
   F1..F12 = 112..123, numpad 0..9 = 96..105. (evidence: observed) */
window.A2.TRIGGER_KEYS = [
  { vk: 112, label: "F1" }, { vk: 113, label: "F2" }, { vk: 114, label: "F3" },
  { vk: 115, label: "F4" }, { vk: 116, label: "F5" }, { vk: 117, label: "F6" },
  { vk: 118, label: "F7" }, { vk: 119, label: "F8" }, { vk: 120, label: "F9" },
  { vk: 121, label: "F10" }, { vk: 122, label: "F11" }, { vk: 123, label: "F12" },
  { vk: 96, label: "Numpad 0" }, { vk: 97, label: "Numpad 1" }, { vk: 98, label: "Numpad 2" },
  { vk: 99, label: "Numpad 3" }, { vk: 100, label: "Numpad 4" }, { vk: 101, label: "Numpad 5" },
  { vk: 102, label: "Numpad 6" }, { vk: 103, label: "Numpad 7" }, { vk: 104, label: "Numpad 8" },
  { vk: 105, label: "Numpad 9" }
];

/* Specialization rows.
   A character's skill ID is the child row for the specializations it chose.
   The last four digits are the chosen spec numbers, ascending, zero-padded:
   Deadshot specs 2+3+5 -> 14012350. Each row below was verified by ID against
   the client data (evidence: data). */
window.A2.SPEC_ROWS = {
  14012350: { parent: 14010000, specs: [2, 3, 5], cd: 20000, end: 250 },
  14020450: { parent: 14020000, specs: [4, 5],    cd: 0,     end: 550 },
  14050350: { parent: 14050000, specs: [3, 5],    cd: 5000,  end: 500 },
  14070130: { parent: 14070000, specs: [1, 3],    cd: 20000, end: 840 },
  14080340: { parent: 14080000, specs: [3, 4],    cd: 20000, end: 833 },
  14090130: { parent: 14090000, specs: [1, 3],    cd: 10000, end: 680 },
  14113450: { parent: 14110000, specs: [3, 4, 5], cd: 10000, end: 750 },
  14130230: { parent: 14130000, specs: [2, 3],    cd: 15000, end: 500 },
  14170130: { parent: 14170000, specs: [1, 3],    cd: 20000, end: 800 },
  14340350: { parent: 14340000, specs: [3, 5],    cd: 0,     end: 470 }
};

/* Starter combos per class.
   Either `ids` (base skill IDs) or `steps` (explicit rows, for builds that pin
   exact specialization IDs). */
window.A2.STARTERS = {

  /* From the questlog skill builder, by whelps. Its "priority" list is the
     rotation order; exact specialization IDs where the client has that row.
     https://questlog.gg/aion-2/en/skill-builder/X2aYOSzHtbA6?build-id=9025 */
  ranger: [
    { name: "Chain: Snipe → Rapid Fire → Spiral Arrow", ids: [14020000, 14030000, 14040000] },
    { name: "Single-target burst", ids: [14090000, 14050000, 14020000, 14030000, 14040000, 14010000, 14080000] },
    { name: "Crowd-control opener", ids: [14070000, 14130000, 14140000, 14300000, 14150000, 14160000] },
    { name: "Buff up", ids: [14260000, 14220000, 14310000, 14380000] },
    {
      name: "whelps — Ranger 10.08 (priority)",
      source: "questlog.gg · whelps · Ranger updated 10.08",
      steps: [
        { id: 14012350 }, { id: 14113450 }, { id: 14050350 }, { id: 14020450 },
        { id: 14340350 }, { id: 14080340 }, { id: 14310000 }, { id: 14380000 },
        { id: 14220000 }, { id: 14360000 }
      ]
    }
  ],

  /* The others: the longest chain the class has, straight from the data. */
  gladiator: [
    { name: "Chain: Rending Blow → Rupture → Wrathful", ids: [11010000, 11030000, 11040000] },
    { name: "Heavy opener", ids: [11290000, 11050000, 11300000, 11310000, 11240000] }
  ],
  templar: [
    { name: "Chain: Vicious → Decisive → Desperate", ids: [12010000, 12020000, 12030000] },
    { name: "Shield opener", ids: [12130000, 12100000, 12430000, 12300000, 12070000] }
  ],
  assassin: [
    { name: "Chain: Quick → Breaking → Swift Slice", ids: [13010000, 13030000, 13040000] },
    { name: "Burst opener", ids: [13070000, 13060000, 13210000, 13130000, 13270000] }
  ],
  sorcerer: [
    { name: "Chain: Flame Arrow → Burst → Pyroclasm", ids: [15210000, 15030000, 15250000] },
    { name: "Frost opener", ids: [15090000, 15100000, 15150000, 15110000, 15200000] }
  ],
  elementalist: [
    { name: "Chain: Cold Shock → Vacuum → Earth Tremor", ids: [16010000, 16020000, 16030000] },
    { name: "Summon opener", ids: [16100000, 16110000, 16130000, 16120000, 16250000] }
  ],
  cleric: [
    { name: "Chain: Retribution → Thunder → Discharge", ids: [17010000, 17020000, 17030000] },
    { name: "Damage opener", ids: [17040000, 17050000, 17060000, 17280000, 17300000] }
  ],
  chanter: [
    { name: "Chain: Onslaught → Resonance → Bolt Crush", ids: [18010000, 18020000, 18030000] },
    { name: "Support opener", ids: [18060000, 18210000, 18290000, 18330000, 18220000] }
  ]
};
