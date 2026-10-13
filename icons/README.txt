Skill icons
===========

285 of the 287 skills across all 8 classes ship with their real in-game icon
(256x256 WebP). The builders pick them up automatically by file name.

    icons/14020000.webp     ->  Snipe        (Ranger)
    icons/15210000.webp     ->  Flame Arrow  (Sorcerer)
    icons/18010000.webp     ->  Onslaught    (Chanter)

The file name is always the skill ID from js/data/skills.js.

Sources
-------
Icons were taken from two public AION 2 databases, matched by skill ID (never by
name), then cross-checked:

  * aion2.app    — the bulk (aion2.app/db-item-icons)
  * questlog.gg  — 3 files aion2.app's CDN was missing (cdn.questlog.gg)

Both sites agree on every icon they share, with no disagreements. The mapping
that was fetched is kept in _icon-map.txt.

Coverage by class
-----------------
    Gladiator     44 / 45
    Templar       32 / 32
    Assassin      38 / 38
    Ranger        39 / 39
    Sorcerer      38 / 38
    Spiritmaster  30 / 31
    Cleric        30 / 30
    Chanter       34 / 34
    ---------------------
    total        285 / 287   (99%)

Skills with no icon anywhere (they fall back to a generated badge):

    11440000  Upward Strike     (Gladiator)
    16020000  Vacuum Explosion  (Spiritmaster)

Brawler is not part of the tool. The client build has no names for that class
either, so neither database publishes icons for it.

Adding more
-----------
Drop a file named after the skill ID into this folder and it is picked up:

    icons/11440000.png      ->  Upward Strike
    icons/16020000.webp     ->  Vacuum Explosion

* Extensions : .png, .webp or .svg  (tried in that order).
* Size       : 40x40 or larger, square, transparent background works best.
  Drawn at 34 px in the library and 28 px in the combo list.
* Partial sets are fine — a missing file just means a badge.

Shared icons
------------
Some skills are common to every class and share one icon. The client names them
with a "CO" prefix:

    ICON_CO_SKILL_001   Dodge        (every class)
    ICON_CO_SKILL_002   Defiance     (every class)
    ICON_CO_SKILL_003   the Assault row (every class)

So icons/11000100.webp, 12000100.webp, ... are all copies of the same Dodge art.

Specialization rows
-------------------
A combo can hold an exact specialization child ID instead of a base skill (see
js/data/classes.js, A2.SPEC_ROWS). No database publishes artwork for those child
rows, and the client shows the skill family's icon for them, so the builder
falls back to the parent skill's file:

    14012350 Deadshot (specs 2+3+5)  ->  shows 14010000.webp (Deadshot)

That reuse is inferred from the icon sharing seen between same-named skills
(e.g. 14230000 and 14360000 both use ICON_RA_SKILL_023), not stated anywhere.

Note
----
The badges drawn when a file is missing are generated locally by the tool
(js/engine.js). They are not game artwork.
