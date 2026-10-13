/* Hub: list every playable class with a representative skill icon.
   The icon is a real game icon for that class (not a class emblem), chosen as a
   recognisable early skill. Extensions are probed in the same order as the
   builder (.png, .webp, .svg) so it works whichever file is present. */

(function () {
  "use strict";

  var A2 = window.A2;

  var REPRESENTATIVE = {
    gladiator:    11010000,   // Rending Blow
    templar:      12010000,   // Vicious Strike
    assassin:     13010000,   // Quick Slice
    ranger:       14020000,   // Snipe
    sorcerer:     15210000,   // Flame Arrow
    elementalist: 16010000,   // Cold Shock
    cleric:       17010000,   // Earth's Retribution
    chanter:      18010000    // Onslaught
  };

  var grid = document.getElementById("class-grid");
  if (!grid || !A2 || !A2.CLASSES) return;

  function iconEl(id) {
    var img = document.createElement("img");
    img.className = "class-icon";
    img.alt = "";
    img.width = 56;
    img.height = 56;

    var exts = A2.ICON_EXTS.slice();
    (function tryNext(i) {
      if (i >= exts.length) { img.style.visibility = "hidden"; return; }
      img.onerror = function () { tryNext(i + 1); };
      img.src = A2.ICON_DIR + "/" + id + "." + exts[i];
    })(0);

    return img;
  }

  A2.CLASSES.forEach(function (c) {
    var rows = (A2.SKILLS_BY_CLASS[c.key] || []).length;

    var a = document.createElement("a");
    a.href = "classes/" + c.key + ".html";
    a.appendChild(iconEl(REPRESENTATIVE[c.key]));

    var name = document.createElement("span");
    name.className = "class-name";
    name.textContent = c.name;

    var meta = document.createElement("span");
    meta.className = "class-meta";
    meta.textContent = c.weapon + " · " + rows + " skills";

    var go = document.createElement("span");
    go.className = "class-go";
    go.textContent = "Open builder →";

    a.appendChild(name);
    a.appendChild(meta);
    a.appendChild(go);

    var li = document.createElement("li");
    li.className = "class-card";
    li.appendChild(a);
    grid.appendChild(li);
  });
})();
