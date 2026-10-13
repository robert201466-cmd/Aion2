/* ─────────────────────────────────────────────────────────────────────────────
   AION 2 — combo builder engine (class-aware).

   A page sets window.A2_CLASS_KEY before loading this file, then this reads
   that class's rows from window.A2.SKILLS_BY_CLASS (see js/data/skills.js).

   Everything claimed about a skill comes from the client data, build 0.0.4387.0.
   Nothing here has been run in game.
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var A2 = window.A2;

  /* ── which class is this page? ────────────────────────────────────────── */

  var CLASSES = A2.CLASSES || [];
  var KEY = window.A2_CLASS_KEY || (CLASSES[0] && CLASSES[0].key);
  var CLS = CLASSES.filter(function (c) { return c.key === KEY; })[0] || CLASSES[0] || { key: KEY, name: KEY, weapon: "" };

  /* ── build the skill objects from the compact rows ────────────────────── */

  function derivedTags(s) {
    var t = [];
    if (s.chainFrom) t.push("chain");
    if (s.cc) t.push("cc");
    if (s.buffs) t.push("buff");
    if (s.range > 0 && s.end > 0) t.push("damage");
    if (!t.length) t.push("utility");
    return t;
  }

  var ROWS = (A2.SKILLS_BY_CLASS || {})[CLS.key] || [];
  var SKILLS = ROWS.map(function (r) {
    var s = {
      id: r[0],
      name: r[1] || ("Skill " + r[0]),
      unnamed: !r[1],
      cd: r[2], end: r[3], range: r[4], lvl: r[5], cost: r[6],
      cc: r[7] ? r[7].split("/") : null,
      buffs: r[8] ? r[8].split("/") : null,
      chainFrom: r[9] || null,
      chainWin: r[10] || 0
    };
    s.tags = derivedTags(s);
    return s;
  });

  var byId = new Map(SKILLS.map(function (s) { return [s.id, s]; }));
  var SPEC_ROWS = A2.SPEC_ROWS || {};

  /* Library entries and specialization rows share one lookup, so a combo can
     hold either a base skill ID or an exact spec child ID. */
  function info(id) {
    var s = byId.get(id);
    if (s) return s;
    var r = SPEC_ROWS[id];
    if (!r) return null;
    var parent = byId.get(r.parent);
    return {
      id: id,
      name: (parent ? parent.name : String(r.parent)) + " (specs " + r.specs.join("+") + ")",
      cd: r.cd,
      end: r.end,
      range: parent ? parent.range : undefined,
      tags: parent ? parent.tags : [],
      cc: parent ? parent.cc : undefined,
      buffs: parent ? parent.buffs : undefined,
      specParent: r.parent,
      specNums: r.specs
    };
  }

  var state = {
    query: "",
    filter: "all",
    combo: [],
    opts: {
      key: 114,
      wait: 3000,
      target: 0,
      repeat: 0,
      perLine: true,
      slots: false,
      autotarget: false,
      nop: true,
      comment: true
    }
  };

  var uidSeq = 1;
  var dragUid = null;

  /* ── tiny helpers ─────────────────────────────────────────────────────── */

  function $(sel) { return document.querySelector(sel); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmtMs(ms) {
    if (!ms) return "0 ms";
    if (ms < 1000) return ms + " ms";
    var s = Math.round(ms / 10) / 100;          // 2 decimals, no trailing zeros
    return s + " s";
  }

  /* ── icons ────────────────────────────────────────────────────────────── */

  var GLYPHS = {
    damage:  '<path d="M3 12h14M12 7l5 5-5 5"/>',
    cc:      '<path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>',
    buff:    '<path d="M12 3l7 3v6c0 4.2-3 7.2-7 9-4-1.8-7-4.8-7-9V6z"/>',
    chain:   '<path d="M9.5 14.5l5-5M8 11l-2.2 2.2a3.2 3.2 0 004.5 4.5L12.5 15.5M16 13l2.2-2.2a3.2 3.2 0 00-4.5-4.5L11.5 8.5"/>',
    utility: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>'
  };

  var COLORS = {
    damage:  ["#ffb454", "#ff7a45"],
    cc:      ["#ff6b81", "#b8559f"],
    buff:    ["#7c9cff", "#4fd1c5"],
    chain:   ["#4fd1c5", "#3aa8e0"],
    utility: ["#94a1b8", "#5d6a82"]
  };

  function primaryTag(s) {
    var tags = s.tags || [];
    if (tags.indexOf("cc") !== -1) return "cc";
    if (tags.indexOf("chain") !== -1) return "chain";
    if (tags.indexOf("buff") !== -1) return "buff";
    if (tags.indexOf("damage") !== -1) return "damage";
    return "utility";
  }

  var badgeCache = new Map();

  function badgeDataUri(s) {
    if (badgeCache.has(s.id)) return badgeCache.get(s.id);
    var tag = primaryTag(s);
    var c = COLORS[tag] || COLORS.utility;
    var glyph = GLYPHS[tag] || GLYPHS.utility;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">' +
        "<defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">" +
          '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/>' +
        "</linearGradient></defs>" +
        '<rect width="40" height="40" rx="9" fill="url(#g)" opacity="0.18"/>' +
        '<rect x="0.5" y="0.5" width="39" height="39" rx="8.5" fill="none" stroke="' + c[0] + '" stroke-opacity="0.45"/>' +
        '<g transform="translate(8,8) scale(1)" fill="none" stroke="' + c[0] + '" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round">' + glyph + "</g>" +
      "</svg>";
    var uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    badgeCache.set(s.id, uri);
    return uri;
  }

  var iconCache = new Map();

  function iconEl(s, cls, size) {
    var img = document.createElement("img");
    img.className = cls;
    img.alt = "";
    img.width = size;
    img.height = size;
    img.draggable = false;

    if (!s) {
      img.src = badgeDataUri({ id: -1, tags: ["utility"] });
      return img;
    }

    var known = iconCache.get(s.id);
    if (known) { img.src = known; return img; }

    img.src = badgeDataUri(s);
    img.classList.add("is-badge");
    if (known === false) return img;

    /* A specialization row has no artwork of its own; the client shows its
       skill family's icon, so fall back to the parent's file.
       ROOT makes the icon folder reachable from a page in a subdirectory. */
    var root = window.A2_ROOT || "";
    var ids = s.specParent ? [s.id, s.specParent] : [s.id];
    var files = [];
    ids.forEach(function (sid) {
      A2.ICON_EXTS.forEach(function (ext) { files.push(root + A2.ICON_DIR + "/" + sid + "." + ext); });
    });

    (function tryNext(i) {
      if (i >= files.length) { iconCache.set(s.id, false); return; }
      var probe = new Image();
      probe.onload = function () {
        iconCache.set(s.id, files[i]);
        img.src = files[i];
        img.classList.remove("is-badge");
      };
      probe.onerror = function () { tryNext(i + 1); };
      probe.src = files[i];
    })(0);

    return img;
  }

  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(msg, isErr) {
    toastEl.textContent = msg;
    toastEl.classList.toggle("err", !!isErr);
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ── library ──────────────────────────────────────────────────────────── */

  function matches(s) {
    if (state.filter !== "all" && (s.tags || []).indexOf(state.filter) === -1) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var hay = [
      s.name, String(s.id),
      (s.cc || []).join(" "), (s.buffs || []).join(" "), (s.tags || []).join(" ")
    ].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function skillMeta(s) {
    var out = [];
    if (s.cd) out.push('<span class="tag cd">CD ' + esc(fmtMs(s.cd)) + "</span>");
    else out.push('<span class="tag nocd">no CD</span>');
    if (s.end) out.push('<span class="tag plain">' + esc(fmtMs(s.end)) + " anim</span>");
    if (s.range) out.push('<span class="tag plain">' + s.range + " m</span>");
    if (s.specNums) out.push('<span class="tag chain">specs ' + s.specNums.join("+") + "</span>");
    (s.cc || []).forEach(function (c) { out.push('<span class="tag cc">' + esc(c) + "</span>"); });
    (s.buffs || []).forEach(function (b) { out.push('<span class="tag buff">' + esc(b) + "</span>"); });
    if (s.chainFrom) {
      var p = byId.get(s.chainFrom);
      out.push('<span class="tag chain">chain of ' + esc(p ? p.name : s.chainFrom) + "</span>");
    }
    if (s.lvl) out.push('<span class="tag plain">Lv.' + s.lvl + "</span>");
    if (s.unnamed) out.push('<span class="tag cc">no name in client data</span>');
    return out.join("");
  }

  function renderLibrary() {
    var list = $("#skill-list");
    var shown = SKILLS.filter(matches);
    var frag = document.createDocumentFragment();

    shown.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "skill";
      li.dataset.id = s.id;
      li.title = "Add " + s.name + " to the combo";
      li.appendChild(iconEl(s, "skill-icon", 34));
      var body = document.createElement("div");
      body.className = "skill-body";
      body.innerHTML =
        '<div><span class="skill-name">' + esc(s.name) + "</span> " +
        '<span class="skill-id">' + s.id + "</span></div>" +
        '<div class="skill-meta">' + skillMeta(s) + "</div>";
      li.appendChild(body);
      frag.appendChild(li);
    });

    list.innerHTML = "";
    list.appendChild(frag);

    $("#lib-count").textContent = shown.length === SKILLS.length
      ? SKILLS.length + " skills"
      : shown.length + " of " + SKILLS.length;
  }

  /* ── combo ────────────────────────────────────────────────────────────── */

  function addSkill(id) {
    state.combo.push({ uid: uidSeq++, id: id, slot: null, wait: null, target: null, move: false });
    renderCombo();
  }

  function effectiveWait(step) { return step.wait != null ? step.wait : state.opts.wait; }
  function effectiveTarget(step) { return step.target != null ? step.target : state.opts.target; }
  function abilityToken(step) {
    if (state.opts.slots && step.slot != null) return String(step.slot);
    return String(step.id);
  }

  function stepCommand(step) {
    return "abl" + (step.move ? "*" : "") + abilityToken(step) + "," + effectiveTarget(step) + "," + effectiveWait(step);
  }

  function targetOptions(sel) {
    var opts = [["", "default"], ["0", "0 · current"], ["1", "1 · self"], ["2", "2 · current only"], ["3", "3 · enemy player"]];
    return opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (String(sel == null ? "" : sel) === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>";
    }).join("");
  }

  function renderCombo() {
    var list = $("#combo-list");
    var empty = $("#combo-empty");
    var n = state.combo.length;

    $("#combo-count").textContent = n + (n === 1 ? " skill" : " skills");
    empty.hidden = n > 0;

    var frag = document.createDocumentFragment();

    state.combo.forEach(function (step, i) {
      var s = info(step.id);
      var li = document.createElement("li");
      li.className = "step";
      li.dataset.uid = step.uid;
      li.draggable = true;

      li.innerHTML =
        '<span class="handle" title="Drag to reorder">⠿</span>' +
        '<span class="idx">' + (i + 1) + "</span>" +
        '<span class="step-icon-slot"></span>' +
        '<div class="step-main">' +
          '<div class="step-name">' +
            esc(s ? s.name : "Unknown ID " + step.id) +
            ' <span class="skill-id">' + esc(s ? s.id : step.id) + "</span>" +
          "</div>" +
          '<div class="step-sub">' + (s ? skillMeta(s) : '<span class="tag cc">not in this class</span>') + "</div>" +
        "</div>" +
        '<div class="step-ctl">' +
          '<label class="field"><span>id</span><input class="f-id" type="number" min="1" step="1" value="' + step.id + '"></label>' +
          '<label class="field"><span>slot</span><input class="f-slot" type="number" min="1" max="100" step="1" placeholder="—" value="' + (step.slot == null ? "" : step.slot) + '"></label>' +
          '<label class="field"><span>wait</span><input class="f-wait" type="number" min="0" max="10000" step="50" placeholder="' + state.opts.wait + '" value="' + (step.wait == null ? "" : step.wait) + '"></label>' +
          '<label class="field"><span>target</span><select class="f-target">' + targetOptions(step.target) + "</select></label>" +
          '<button class="icon-btn f-move' + (step.move ? " is-on" : "") + '" type="button" title="Add * : run to the target">★</button>' +
          '<button class="icon-btn f-up" type="button" title="Move up"' + (i === 0 ? " disabled" : "") + ">↑</button>" +
          '<button class="icon-btn f-down" type="button" title="Move down"' + (i === n - 1 ? " disabled" : "") + ">↓</button>" +
          '<button class="icon-btn del f-del" type="button" title="Remove">✕</button>' +
        "</div>";

      frag.appendChild(li);
    });

    list.innerHTML = "";
    list.appendChild(frag);

    Array.prototype.forEach.call(list.querySelectorAll(".step"), function (el, i) {
      var step = state.combo[i];
      var slot = el.querySelector(".step-icon-slot");
      if (slot && step) slot.replaceWith(iconEl(info(step.id), "step-icon", 28));
    });

    renderStats();
    renderOutput();
  }

  function stepByUid(uid) {
    uid = Number(uid);
    for (var i = 0; i < state.combo.length; i++) {
      if (state.combo[i].uid === uid) return { step: state.combo[i], index: i };
    }
    return null;
  }

  function moveStep(uid, delta) {
    var hit = stepByUid(uid);
    if (!hit) return;
    var to = hit.index + delta;
    if (to < 0 || to >= state.combo.length) return;
    state.combo.splice(hit.index, 1);
    state.combo.splice(to, 0, hit.step);
    renderCombo();
  }

  /* ── stats ────────────────────────────────────────────────────────────── */

  function analyse() {
    var animTotal = 0, waitTotal = 0, t = 0;
    var firstUse = new Map();
    var warnings = [];

    state.combo.forEach(function (step, i) {
      var s = info(step.id);
      var end = s && s.end ? s.end : 0;
      waitTotal += effectiveWait(step);

      if (s && s.cd > 0) {
        var key = abilityToken(step);
        if (firstUse.has(key)) {
          var delta = t - firstUse.get(key);
          if (delta < s.cd) {
            warnings.push("Step " + (i + 1) + ": " + s.name + " is used again after about " +
              fmtMs(delta) + ", but its cooldown is " + fmtMs(s.cd) + ".");
          }
        } else { firstUse.set(key, t); }
      }
      t += end;
      animTotal += end;
    });

    return { animTotal: animTotal, waitTotal: waitTotal, warnings: warnings, longestCd: longestCooldown() };
  }

  function longestCooldown() {
    var max = 0;
    state.combo.forEach(function (step) {
      var s = info(step.id);
      if (s && s.cd > max) max = s.cd;
    });
    return max;
  }

  function renderStats() {
    var el = $("#stats");
    if (!state.combo.length) { el.innerHTML = ""; return; }

    var a = analyse();
    var html =
      '<div class="stat-row">' +
        '<span class="stat"><b>' + state.combo.length + "</b><span>steps</span></span>" +
        '<span class="stat"><b>' + esc(fmtMs(a.animTotal)) + "</b><span>attack timers, back to back</span></span>" +
        '<span class="stat"><b>' + esc(fmtMs(a.waitTotal)) + "</b><span>total waits</span></span>" +
        (a.longestCd ? '<span class="stat"><b>' + esc(fmtMs(a.longestCd)) + "</b><span>longest cooldown</span></span>" : "") +
      "</div>";

    html += '<ul class="warn-list">';
    if (a.warnings.length) {
      a.warnings.forEach(function (w) { html += "<li>" + esc(w) + "</li>"; });
    } else {
      html += '<li class="ok">No cooldown conflicts for a single pass through this order.</li>';
    }
    html += "</ul>";

    el.innerHTML = html;
  }

  /* ── macro output ─────────────────────────────────────────────────────── */

  function buildLines() {
    var opts = state.opts;
    var cmds = state.combo.map(stepCommand);
    if (!cmds.length) return [];

    if (opts.autotarget) cmds[0] = "tcm2000|" + cmds[0];

    var lines = [];
    if (opts.comment) lines.push("; " + CLS.name + " combo — generated by the AION 2 Combo tool");
    lines.push("[" + opts.key + "]");

    function keyName(i) { return i === 0 ? "keys" : "keys" + (i + 1); }

    if (opts.perLine) {
      cmds.forEach(function (c, i) { lines.push(keyName(i) + "=" + c); });
      if (opts.nop) lines.push(keyName(cmds.length) + "=nop");
    } else {
      lines.push(keyName(0) + "=" + cmds.join("|"));
      if (opts.nop) lines.push(keyName(1) + "=nop");
    }

    if (opts.repeat) lines.push("repeat=" + opts.repeat);
    return lines;
  }

  function highlight(line) {
    var e = esc(line);
    e = e.replace(/^(keys\d*=|repeat=)(.*)$/, function (_, a, b) {
      return '<span class="k">' + a + '</span><span class="a">' + b + "</span>";
    });
    if (/^;/.test(line)) return '<span class="c">' + e + "</span>";
    if (/^\[/.test(line)) return '<span class="k">' + e + "</span>";
    return e;
  }

  function renderOutput() {
    var lines = buildLines();
    var out = $("#out");

    if (!lines.length) {
      out.textContent = "Add a skill to see the macro.";
      $("#out-note").textContent = "";
      return;
    }

    out.innerHTML = lines.map(highlight).join("\n");

    var a = analyse();
    var n = state.combo.length;
    $("#out-note").textContent = n + (n === 1 ? " line" : " lines") +
      (state.opts.nop ? " + nop" : "") +
      (a.warnings.length ? " · " + a.warnings.length + " warning" + (a.warnings.length === 1 ? "" : "s") : "");
  }

  function macroText() { return buildLines().join("\n"); }

  /* ── clipboard / download ─────────────────────────────────────────────── */

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(new Error("copy failed")); }
      catch (e) { reject(e); }
      finally { document.body.removeChild(ta); }
    });
  }

  function download(name, text) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ── wiring ───────────────────────────────────────────────────────────── */

  function initTriggerKeys() {
    $("#opt-key").innerHTML = A2.TRIGGER_KEYS.map(function (g) {
      var opts = g.keys.map(function (k) {
        return '<option value="' + k.vk + '"' + (k.vk === state.opts.key ? " selected" : "") + ">" +
          esc(k.label) + " (VK " + k.vk + ")</option>";
      }).join("");
      return '<optgroup label="' + esc(g.group) + '">' + opts + "</optgroup>";
    }).join("");
  }

  function initStarters() {
    var list = (A2.STARTERS || {})[CLS.key] || [];
    var box = $("#starters");
    if (!list.length) { box.hidden = true; return; }
    box.innerHTML = list.map(function (p, i) {
      return '<button class="chip" type="button" data-starter="' + i + '" title="' + esc(p.source || "Load this combo") + '">' + esc(p.name) + "</button>";
    }).join("");
  }

  function bind() {
    $("#search").addEventListener("input", function (e) { state.query = e.target.value; renderLibrary(); });

    $("#chips").addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      state.filter = b.dataset.filter;
      Array.prototype.forEach.call(this.querySelectorAll(".chip"), function (c) { c.classList.toggle("is-active", c === b); });
      renderLibrary();
    });

    $("#skill-list").addEventListener("click", function (e) {
      var li = e.target.closest(".skill");
      if (!li) return;
      var id = Number(li.dataset.id);
      addSkill(id);
      var s = byId.get(id);
      toast("Added " + (s ? s.name : id));
    });

    $("#starters").addEventListener("click", function (e) {
      var b = e.target.closest("[data-starter]");
      if (!b) return;
      var list = (A2.STARTERS || {})[CLS.key] || [];
      var p = list[Number(b.dataset.starter)];
      if (!p) return;
      var rows = p.steps ? p.steps.map(function (st) { return st.id; }) : p.ids;
      state.combo = rows.map(function (id) {
        return { uid: uidSeq++, id: id, slot: null, wait: null, target: null, move: false };
      });
      renderCombo();
      toast("Loaded: " + p.name);
    });

    var list = $("#combo-list");

    list.addEventListener("click", function (e) {
      var li = e.target.closest(".step");
      if (!li) return;
      var uid = li.dataset.uid;
      var hit = stepByUid(uid);
      if (!hit) return;
      if (e.target.closest(".f-del")) { state.combo.splice(hit.index, 1); renderCombo(); }
      else if (e.target.closest(".f-up")) moveStep(uid, -1);
      else if (e.target.closest(".f-down")) moveStep(uid, 1);
      else if (e.target.closest(".f-move")) { hit.step.move = !hit.step.move; renderCombo(); }
    });

    function onEdit(e) {
      var li = e.target.closest(".step");
      if (!li) return;
      var hit = stepByUid(li.dataset.uid);
      if (!hit) return;
      var t = e.target;

      if (t.classList.contains("f-id")) {
        var v = parseInt(t.value, 10);
        if (isFinite(v) && v > 0) {
          hit.step.id = v;
          var s = info(v);
          li.querySelector(".step-name").innerHTML = esc(s ? s.name : "Unknown ID " + v) +
            ' <span class="skill-id">' + esc(s ? s.id : v) + "</span>";
          li.querySelector(".step-sub").innerHTML = s ? skillMeta(s) : '<span class="tag cc">not in this class</span>';
          var ic = li.querySelector(".step-icon");
          if (ic) ic.replaceWith(iconEl(s, "step-icon", 28));
          renderStats();
          renderOutput();
        }
      } else if (t.classList.contains("f-slot")) {
        var sv = parseInt(t.value, 10);
        hit.step.slot = isFinite(sv) && sv > 0 ? sv : null;
        renderOutput();
      } else if (t.classList.contains("f-wait")) {
        var wv = parseInt(t.value, 10);
        hit.step.wait = isFinite(wv) && wv >= 0 && t.value !== "" ? wv : null;
        renderStats();
        renderOutput();
      } else if (t.classList.contains("f-target")) {
        hit.step.target = t.value === "" ? null : parseInt(t.value, 10);
        renderOutput();
      }
    }
    list.addEventListener("input", onEdit);
    list.addEventListener("change", onEdit);

    list.addEventListener("dragstart", function (e) {
      var li = e.target.closest(".step");
      if (!li) return;
      dragUid = Number(li.dataset.uid);
      li.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", li.dataset.uid); } catch (_) {}
    });

    list.addEventListener("dragend", function () {
      dragUid = null;
      Array.prototype.forEach.call(list.querySelectorAll(".step"), function (el) { el.classList.remove("dragging", "drop-target"); });
    });

    list.addEventListener("dragover", function (e) {
      if (dragUid == null) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      var li = e.target.closest(".step");
      Array.prototype.forEach.call(list.querySelectorAll(".step"), function (el) { el.classList.toggle("drop-target", el === li); });
    });

    list.addEventListener("drop", function (e) {
      if (dragUid == null) return;
      e.preventDefault();
      var li = e.target.closest(".step");
      var from = stepByUid(dragUid);
      if (!from) return;
      var step = state.combo.splice(from.index, 1)[0];
      var to = li ? stepByUid(li.dataset.uid) : null;
      state.combo.splice(to ? to.index : state.combo.length, 0, step);
      dragUid = null;
      renderCombo();
    });

    $("#opt-key").addEventListener("change", function (e) { state.opts.key = Number(e.target.value); renderOutput(); });
    $("#opt-wait").addEventListener("input", function (e) {
      var v = parseInt(e.target.value, 10);
      state.opts.wait = isFinite(v) && v >= 0 ? v : 3000;
      renderCombo();
    });
    $("#opt-target").addEventListener("change", function (e) { state.opts.target = Number(e.target.value); renderCombo(); });
    $("#opt-repeat").addEventListener("change", function (e) { state.opts.repeat = Number(e.target.value); renderOutput(); });
    $("#opt-perline").addEventListener("change", function (e) { state.opts.perLine = e.target.checked; renderOutput(); });
    $("#opt-slots").addEventListener("change", function (e) { state.opts.slots = e.target.checked; renderOutput(); });
    $("#opt-autotarget").addEventListener("change", function (e) { state.opts.autotarget = e.target.checked; renderOutput(); });
    $("#opt-nop").addEventListener("change", function (e) { state.opts.nop = e.target.checked; renderOutput(); });
    $("#opt-comment").addEventListener("change", function (e) { state.opts.comment = e.target.checked; renderOutput(); });

    $("#btn-copy").addEventListener("click", function () {
      if (!state.combo.length) return toast("Nothing to copy yet.", true);
      copyText(macroText())
        .then(function () { toast("Macro copied to the clipboard."); })
        .catch(function () { toast("Copy failed — select the text and press Ctrl+C.", true); });
    });

    $("#btn-download").addEventListener("click", function () {
      if (!state.combo.length) return toast("Nothing to download yet.", true);
      download(CLS.key + "-combo.ini", macroText() + "\n");
      toast("Saved " + CLS.key + "-combo.ini");
    });

    $("#btn-fillwaits").addEventListener("click", function () {
      if (!state.combo.length) return toast("Add skills first.", true);
      var filled = 0;
      state.combo.forEach(function (step) {
        var s = info(step.id);
        if (s && s.end > 0) { step.wait = s.end; filled++; }
      });
      renderCombo();
      toast(filled ? "Filled " + filled + " wait field(s) from attack timers." : "No attack timers available.", !filled);
    });

    $("#btn-clear").addEventListener("click", function () {
      if (!state.combo.length) return;
      state.combo = [];
      renderCombo();
      toast("Combo cleared.");
    });

    $("#btn-reset").addEventListener("click", function () {
      state.combo = [];
      state.query = "";
      state.filter = "all";
      state.opts = { key: 114, wait: 3000, target: 0, repeat: 0, perLine: true, slots: false, autotarget: false, nop: true, comment: true };
      $("#search").value = "";
      $("#opt-wait").value = 3000;
      $("#opt-target").value = "0";
      $("#opt-repeat").value = "0";
      $("#opt-key").value = "114";
      $("#opt-perline").checked = true;
      $("#opt-slots").checked = false;
      $("#opt-autotarget").checked = false;
      $("#opt-nop").checked = true;
      $("#opt-comment").checked = true;
      Array.prototype.forEach.call(document.querySelectorAll("#chips .chip"), function (c) {
        c.classList.toggle("is-active", c.dataset.filter === "all");
      });
      renderLibrary();
      renderCombo();
      toast("Reset.");
    });

    $("#btn-help").addEventListener("click", function () { $("#help").hidden = false; });
    $("#help-close").addEventListener("click", function () { $("#help").hidden = true; });
    $("#help").addEventListener("click", function (e) { if (e.target === this) this.hidden = true; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("#help").hidden = true; });
  }

  /* ── start ────────────────────────────────────────────────────────────── */

  // label the page for this class
  document.title = CLS.name + " Combo Builder — AION 2";
  var nameEl = $("#class-name");
  if (nameEl) nameEl.textContent = CLS.name;
  var weaponEl = $("#class-weapon");
  if (weaponEl) weaponEl.textContent = CLS.weapon;

  initTriggerKeys();
  initStarters();
  bind();
  renderLibrary();
  renderCombo();
})();
