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

/* Trigger keys: a macro section name is the virtual-key code of the key that
   starts the macro.

   Source: the vendor's own virtual key code page,
   https://speedercheats.vip/virtual-key-codes/ (evidence: guide). Every named
   key on that page is listed; undefined, reserved and OEM-specific ranges are
   left out. Two things that page corrects, and that are easy to get wrong:

     Shift / Ctrl / Alt   use the LEFT/RIGHT variants, 160-165. The bare
                          codes 16/17/18 are listed as reserved.
     mouse buttons        are valid triggers: 1 left, 2 right, 4 middle,
                          5 X1 side, 6 X2 side, 256 scroll up, 257 scroll down.

   Keys that still need care:
     letters, digits, symbols   the key is swallowed while the macro runs, so
                                they are awkward if you still want to type */
window.A2.TRIGGER_KEYS = [
  { group: "Mouse", keys: [
    { vk: 1, label: "Left mouse" }, { vk: 2, label: "Right mouse" },
    { vk: 4, label: "Middle mouse" }, { vk: 5, label: "Mouse X1 (side)" },
    { vk: 6, label: "Mouse X2 (side)" }, { vk: 256, label: "Scroll up" },
    { vk: 257, label: "Scroll down" }
  ] },
  { group: "Function keys", keys: [
    { vk: 27, label: "Esc" }, { vk: 112, label: "F1" }, { vk: 113, label: "F2" },
    { vk: 114, label: "F3" }, { vk: 115, label: "F4" }, { vk: 116, label: "F5" },
    { vk: 117, label: "F6" }, { vk: 118, label: "F7" }, { vk: 119, label: "F8" },
    { vk: 120, label: "F9" }, { vk: 121, label: "F10" }, { vk: 122, label: "F11" },
    { vk: 123, label: "F12" }, { vk: 124, label: "F13" }, { vk: 125, label: "F14" },
    { vk: 126, label: "F15" }, { vk: 127, label: "F16" }, { vk: 128, label: "F17" },
    { vk: 129, label: "F18" }, { vk: 130, label: "F19" }, { vk: 131, label: "F20" },
    { vk: 132, label: "F21" }, { vk: 133, label: "F22" }, { vk: 134, label: "F23" },
    { vk: 135, label: "F24" }, { vk: 44, label: "PrtSc" }, { vk: 145, label: "ScrLk" },
    { vk: 19, label: "Pause" }
  ] },
  { group: "Digits", keys: [
    { vk: 49, label: "1" }, { vk: 50, label: "2" }, { vk: 51, label: "3" },
    { vk: 52, label: "4" }, { vk: 53, label: "5" }, { vk: 54, label: "6" },
    { vk: 55, label: "7" }, { vk: 56, label: "8" }, { vk: 57, label: "9" },
    { vk: 48, label: "0" }
  ] },
  { group: "Letters", keys: [
    { vk: 81, label: "Q" }, { vk: 87, label: "W" }, { vk: 69, label: "E" },
    { vk: 82, label: "R" }, { vk: 84, label: "T" }, { vk: 89, label: "Y" },
    { vk: 85, label: "U" }, { vk: 73, label: "I" }, { vk: 79, label: "O" },
    { vk: 80, label: "P" }, { vk: 65, label: "A" }, { vk: 83, label: "S" },
    { vk: 68, label: "D" }, { vk: 70, label: "F" }, { vk: 71, label: "G" },
    { vk: 72, label: "H" }, { vk: 74, label: "J" }, { vk: 75, label: "K" },
    { vk: 76, label: "L" }, { vk: 90, label: "Z" }, { vk: 88, label: "X" },
    { vk: 67, label: "C" }, { vk: 86, label: "V" }, { vk: 66, label: "B" },
    { vk: 78, label: "N" }, { vk: 77, label: "M" }
  ] },
  { group: "Symbols", keys: [
    { vk: 192, label: "` ~ (OEM 3)" }, { vk: 189, label: "- _ (OEM Minus)" },
    { vk: 187, label: "+ = (OEM Plus)" }, { vk: 219, label: "[ { (OEM 4)" },
    { vk: 221, label: "] } (OEM 6)" }, { vk: 220, label: "\\ | (OEM 5)" },
    { vk: 186, label: "; : (OEM 1)" }, { vk: 222, label: "Quote (OEM 7)" },
    { vk: 188, label: ", < (OEM Comma)" }, { vk: 190, label: ". > (OEM Period)" },
    { vk: 191, label: "/ ? (OEM 2)" }, { vk: 223, label: "OEM 8" },
    { vk: 226, label: "OEM 102" }
  ] },
  { group: "Control", keys: [
    { vk: 8, label: "Backspace" }, { vk: 9, label: "Tab" }, { vk: 12, label: "Clear" },
    { vk: 13, label: "Enter" }, { vk: 20, label: "Caps" }, { vk: 32, label: "Space" },
    { vk: 3, label: "Cancel (Ctrl+Break)" }, { vk: 41, label: "Select" },
    { vk: 42, label: "Print" }, { vk: 43, label: "Execute" }, { vk: 47, label: "Help" },
    { vk: 95, label: "Sleep" }
  ] },
  { group: "Modifiers", keys: [
    { vk: 160, label: "Left Shift" }, { vk: 161, label: "Right Shift" },
    { vk: 162, label: "Left Ctrl" }, { vk: 163, label: "Right Ctrl" },
    { vk: 164, label: "Left Alt" }, { vk: 165, label: "Right Alt" },
    { vk: 91, label: "Left Win" }, { vk: 92, label: "Right Win" },
    { vk: 93, label: "Menu (Applications)" }
  ] },
  { group: "Navigation", keys: [
    { vk: 33, label: "PgUp" }, { vk: 34, label: "PgDn" }, { vk: 35, label: "End" },
    { vk: 36, label: "Home" }, { vk: 37, label: "Left arrow" }, { vk: 38, label: "Up arrow" },
    { vk: 39, label: "Right arrow" }, { vk: 40, label: "Down arrow" },
    { vk: 45, label: "Ins" }, { vk: 46, label: "Del" }
  ] },
  { group: "Numpad", keys: [
    { vk: 144, label: "NumLk" }, { vk: 96, label: "Numpad 0" }, { vk: 97, label: "Numpad 1" },
    { vk: 98, label: "Numpad 2" }, { vk: 99, label: "Numpad 3" }, { vk: 100, label: "Numpad 4" },
    { vk: 101, label: "Numpad 5" }, { vk: 102, label: "Numpad 6" }, { vk: 103, label: "Numpad 7" },
    { vk: 104, label: "Numpad 8" }, { vk: 105, label: "Numpad 9" }, { vk: 106, label: "Numpad *" },
    { vk: 107, label: "Numpad +" }, { vk: 108, label: "Numpad Separator" },
    { vk: 109, label: "Numpad -" }, { vk: 110, label: "Numpad ." }, { vk: 111, label: "Numpad /" }
  ] },
  { group: "Media and browser", keys: [
    { vk: 166, label: "Browser Back" }, { vk: 167, label: "Browser Forward" },
    { vk: 168, label: "Browser Refresh" }, { vk: 169, label: "Browser Stop" },
    { vk: 170, label: "Browser Search" }, { vk: 171, label: "Browser Favorites" },
    { vk: 172, label: "Browser Home" }, { vk: 173, label: "Volume Mute" },
    { vk: 174, label: "Volume Down" }, { vk: 175, label: "Volume Up" },
    { vk: 176, label: "Next Track" }, { vk: 177, label: "Prev Track" },
    { vk: 178, label: "Stop Media" }, { vk: 179, label: "Play/Pause Media" },
    { vk: 180, label: "Launch Mail" }, { vk: 181, label: "Launch Media Select" },
    { vk: 182, label: "Launch App 1" }, { vk: 183, label: "Launch App 2" }
  ] },
  { group: "IME", keys: [
    { vk: 21, label: "Kana / Hangul" }, { vk: 23, label: "Junja" }, { vk: 24, label: "Final" },
    { vk: 25, label: "Hanja / Kanji" }, { vk: 28, label: "Convert" },
    { vk: 29, label: "NonConvert" }, { vk: 30, label: "Accept" },
    { vk: 31, label: "ModeChange" }, { vk: 229, label: "ProcessKey" }
  ] },
  { group: "Misc", keys: [
    { vk: 231, label: "Packet" }, { vk: 246, label: "Attn" }, { vk: 247, label: "CrSel" },
    { vk: 248, label: "ExSel" }, { vk: 249, label: "Erase EOF" }, { vk: 250, label: "Play" },
    { vk: 251, label: "Zoom" }, { vk: 252, label: "NoName" }, { vk: 253, label: "PA1" },
    { vk: 254, label: "OEM Clear" }
  ] }
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
