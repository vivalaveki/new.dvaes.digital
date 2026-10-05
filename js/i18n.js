/* Dvaes Digital — HR / EN prebacivanje jezika
   -------------------------------------------------------------
   Stranice su napisane na hrvatskom (to je zadani jezik).
   Ova skripta:
     1. dodaje fiksni HR | EN gumb u donji lijevi kut svake stranice,
     2. prevodi tekst na engleski preko rječnika EN ispod,
     3. pamti odabrani jezik (localStorage) pa vrijedi na svim stranicama.

   NOVI TEKST: u rječnik EN dodaj redak  "hrvatski tekst": "english text".
   Tekst mora biti isti kao u HTML-u (razmaci i novi redovi se ignoriraju).
   Što nije u rječniku ostaje na hrvatskom — ništa se ne ruši.
*/
(function () {
  "use strict";

  var STORAGE_KEY = "dvaes-lang";
  var DEFAULT_LANG = "hr";
  var SWITCH_CLASS = "lang-switch";

  /* ---------- Rječnik: hrvatski -> engleski ---------- */
  var EN = /*DICT_START*/ {
    "Naslovnica": "Home",
    "Eventi": "Events",
    "Izvođači": "Artists",
    "Izdanja": "Releases",
    "Kontakt": "Contact",
    "Izbornik": "Menu",

    "Dvaes Digital. sva prava pridržana.": "Dvaes Digital. All rights reserved.",

    "Label · Eventi · Produkcija": "Label · Events · Production",
    "Platforma za novu generaciju.": "Built for the new generation.",
    "Snimamo. Produciramo. Objavljujemo. Gradimo artiste.": "Record. Produce. Release. PR.",
    "Tko smo mi?": "Who are we?",
    "O nama": "About us",
    "Agencija pokrenuta kao side-project 2024., Dvaes Digital nastoji pružiti profesionalan pristup i zvuk kako izvođačima tako i organizatorima.": "Started as a side project in 2024, Dvaes Digital offers a professional approach and production to artists and event organizers.",
    "Pokrenuti 2024. godine kao novi izbor u svijetu digitalnog izdavaštva, već smo se 2025. proširili na područja event managementa, produkcije i dizajna.": "Launched in 2024 as a new choice in the world of digital publishing, we expanded in 2025 into event management, production and design.",
    "Naš cilj je jednostavan. Pružiti profesionalan pristup bez nepotrebnog tereta. Gradimo izvođače i evente u koje vjerujemo, ulažemo u njihov razvoj i stvaramo prostor u kojem se mogu fokusirati na ono što rade najbolje.": "Our goal is to offer a professional approach without unnecessary stress. We invest in artists and events we believe in, we invest in their development and create a space where they can focus on what they do best.",
    "Mi preuzimamo tehnički dio posla, sve od produkcije i organizacije do menadžmenta i vizualnog identiteta.": "We take care of the technical side of the work, everything from production and organization to management and visual identity.",
    "Tvoj dio je kreativa. Naš je da sve ostalo funkcionira.": "Your part are the ideas. Ours is making it a reality.",
    "Izdavaštvo": "Publishing",
    "Event Produkcija": "Event Production",
    "Razvoj izvođača": "Artist Development",
    "Menadžment": "Management",
    "Digitalna Produkcija": "Digital Production",
    "Dizajn": "Design",

    "Radimo s izvođačima u koje vjerujemo i pomažemo im oko svega što dolazi uz glazbu. Od izdanja i nastupa do promocije i organizacije, tu smo da olakšamo cijeli proces. Pružamo usluge menadžmenta i bookinga": "We work with artists we believe in and help them with everything that might be a challenge. From publishing and management to promotion and organization, we're here to make the whole process easier. We provide management and booking services.",
    "Izvođač": "Artist",
    "Izvođač / Producent / Dizajner · Osnivač": "Artist / Producer / Designer · Founder",
    "Producent / DJ · Osnivač": "Producer / DJ · Founder",
    "Producent": "Producer",

    "Od ideje do realizacije, bavimo se organizacijom i produkcijom evenata, stvarajući prostor za izvođače, publiku i novu kreativnu scenu.": "From idea to realization, we organize and produce events, creating space for artists, audiences and the new creative scene.",
    "uspjesi": "achievements",
    "Budući - TBA.": "Upcoming - TBA.",
    "Prošli - 18.4.2026.": "Past - 18 April 2026",
    "Prošli - 17./18.7.2025.": "Past - 17–18 July 2025",
    "Otkazano · 2026": "Cancelled · 2026",
    "Otkazano :(": "Cancelled :(",
    "Platforma za nove izvođače.": "A platform for new artists.",
    "Platforma za nove izvođače po drugi put u klubu Exit Osijek.": "A platform for new artists, for the second time at club Exit Osijek.",
    "Platforma za nove izvođače prvi put u klubu Exit Osijek.": "A platform for new artists, for the first time at club Exit Osijek.",
    "Pogledaj event": "View event",

    "← Svi eventi": "← All events",
    "Datum": "Date",
    "Mjesto": "Location",
    "Status": "Status",
    "Otkazano": "Cancelled",
    "Održano": "Completed",
    "Rasprodano": "Sold out",
    "Galerija": "Gallery",
    "13.5.2026.": "13 May 2026",
    "17./18.7.2025.": "17–18 July 2025",
    "18.4.2026.": "18 April 2026",
    "Ovaj event nažalost je otkazan.": "Unfortunately, this event has been cancelled.",
    "Prvo izdanje Underground Weekenda, platforme za nove izvođače, održano je u klubu Exit u Osijeku.": "The first edition of Underground Weekend, a platform for new artists, was held at club Exit in Osijek.",
    "Nastupali su Brada, Južina, Dupetronik, Ciher, Pacadi, $ICH, Louky, Mladi Mjesec, PolaOsam, Leda, Svenko, 5tan 8, Bawgte, 44, kac, Camelll, $ven, FunTom. Festival je prodao 90% kapaciteta prostora uz podršku Flaner Clothinga.": "Performers were Brada, Južina, Dupetronik, Ciher, Pacadi, $ICH, Louky, Mladi Mjesec, PolaOsam, Leda, Svenko, 5tan 8, Bawgte, 44, kac, Camelll, $ven, FunTom. The festival sold 90% of the venue's capacity with support from Flaner Clothing.",
    "Underground Weekend je platforma za nove izvođače. Drugo izdanje ponovno je održano u klubu Exit u Osijeku.": "Underground Weekend is a platform for new artists. The second edition was once again held at club Exit in Osijek.",
    "Na drugom UG weekendu nastupali su ASTO, cHRI$, $vEN & ACO, DB Nord, KVEST & TIRMAX, KNINTENDO i Massimo Savage kao headliner festivala. Festival je rasprodan u cijelosti uz partnersku podršu Knintenda, Core-eventa i kluba Exit Osijek!": "Performing at the second UG Weekend were ASTO, cHRI$, $vEN & ACO, DB Nord, KVEST & TIRMAX, KNINTENDO and Massimo Savage as the festival headliner. The festival sold out completely with partner support from Knintendo, Core-event and club Exit Osijek!",

    "Singlovi, EP i albumi izbačeni preko naše platforme.": "Singles, EPs and albums released through our platform.",
    "katalog": "catalogue",
    "Singl · 2026": "Single · 2026",
    "Singl · 2025": "Single · 2025",

    "Javi nam se": "Get in touch",
    "Imaš pitanje, ideju ili želiš surađivati s nama? Pošalji nam mail na odgovarajuću adresu i javit ćemo ti se što prije.": "Have a question, an idea, or want to work with us? Send an email and we'll get back to you as soon as possible.",
    "Publishing / Izdavaštvo": "Publishing",
    "Event menadžment": "Event management",
    "Produkcija": "Production",
    "Booking / Nastupi": "Booking / Performances",
    "Društvene mreže": "Social media",

    "Izvođači — Dvaes Digital": "Artists — Dvaes Digital",
    "Eventi — Dvaes Digital": "Events — Dvaes Digital",
    "Izvođači na Dvaes Digitalu.": "Artists on Dvaes Digital.",
    "Nadolazeći i prošli eventi Dvaes Digitala.": "Upcoming and past Dvaes Digital events.",

    "Pregled fotografije": "Photo viewer",
    "Zatvori": "Close",
    "Prethodna": "Previous",
    "Sljedeća": "Next",
    "Fotografije s eventa uskoro.": "Event photos coming soon."
  } /*DICT_END*/;

  /* Tekstovi s brojevima i sl. */
  var PATTERNS = [[/^Otvori fotografiju (\d+)$/, "Open photo $1"]];

  var LABELS = {
    hr: { group: "Jezik / Language", hr: "Hrvatski", en: "English" }
  };

  /* ---------- Stanje ---------- */
  var current = DEFAULT_LANG;
  var textOrig = new WeakMap(); // Text node -> originalni (hrvatski) tekst
  var attrOrig = new WeakMap(); // Element -> { atribut: originalna vrijednost }
  var ATTRS = ["aria-label"];
  var origTitle = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var origDesc = metaDesc ? metaDesc.getAttribute("content") : null;
  var switchEl = null;

  function norm(s) {
    return s.replace(/\s+/g, " ").trim();
  }

  function lookup(key) {
    if (!key) return null;
    if (Object.prototype.hasOwnProperty.call(EN, key)) return EN[key];
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(key)) return key.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    return null;
  }

  function inSwitch(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    return !!(el && el.closest && el.closest("." + SWITCH_CLASS));
  }

  /* ---------- Prijevod čvorova ---------- */
  function applyText(node, lang) {
    if (inSwitch(node)) return;
    var parent = node.parentNode;
    if (parent && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.nodeName)) return;

    if (lang === "en") {
      var orig = textOrig.has(node) ? textOrig.get(node) : node.nodeValue;
      var out = lookup(norm(orig));
      if (out === null) return;
      if (!textOrig.has(node)) textOrig.set(node, orig);
      var lead = orig.match(/^\s*/)[0];
      var trail = orig.match(/\s*$/)[0];
      node.nodeValue = lead + out + trail;
    } else if (textOrig.has(node)) {
      node.nodeValue = textOrig.get(node);
    }
  }

  function applyAttrs(el, lang) {
    if (inSwitch(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      if (!el.hasAttribute(name)) continue;
      var store = attrOrig.get(el) || {};
      var orig = Object.prototype.hasOwnProperty.call(store, name)
        ? store[name]
        : el.getAttribute(name);
      if (lang === "en") {
        var out = lookup(norm(orig));
        if (out === null) continue;
        store[name] = orig;
        attrOrig.set(el, store);
        el.setAttribute(name, out);
      } else if (Object.prototype.hasOwnProperty.call(store, name)) {
        el.setAttribute(name, store[name]);
      }
    }
  }

  function applySubtree(root, lang) {
    if (root.nodeType === 3) {
      applyText(root, lang);
      return;
    }
    if (root.nodeType !== 1) return;

    applyAttrs(root, lang);
    var attrNodes = root.querySelectorAll("[aria-label]");
    for (var i = 0; i < attrNodes.length; i++) applyAttrs(attrNodes[i], lang);

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    var batch = [];
    while ((n = walker.nextNode())) batch.push(n);
    for (var j = 0; j < batch.length; j++) applyText(batch[j], lang);
  }

  function applyHead(lang) {
    document.documentElement.lang = lang;
    var t = lang === "en" ? lookup(norm(origTitle)) : null;
    document.title = t !== null ? t : origTitle;
    if (metaDesc && origDesc !== null) {
      var d = lang === "en" ? lookup(norm(origDesc)) : null;
      metaDesc.setAttribute("content", d !== null ? d : origDesc);
    }
  }

  /* ---------- Gumb za jezik ---------- */
  function buildSwitch() {
    switchEl = document.createElement("div");
    switchEl.className = SWITCH_CLASS;
    switchEl.setAttribute("role", "group");
    switchEl.setAttribute("aria-label", LABELS.hr.group);
    switchEl.innerHTML =
      '<button type="button" class="' + SWITCH_CLASS + '__btn" data-lang="hr" lang="hr" title="' + LABELS.hr.hr + '">HR</button>' +
      '<button type="button" class="' + SWITCH_CLASS + '__btn" data-lang="en" lang="en" title="' + LABELS.hr.en + '">EN</button>';
    switchEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-lang]");
      if (btn) setLang(btn.getAttribute("data-lang"), true);
    });
    document.body.appendChild(switchEl);
  }

  function syncSwitch() {
    if (!switchEl) return;
    var btns = switchEl.querySelectorAll("[data-lang]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang") === current;
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      btns[i].classList.toggle("is-active", on);
    }
  }

  /* ---------- Javni API ---------- */
  function setLang(lang, persist) {
    if (lang !== "hr" && lang !== "en") lang = DEFAULT_LANG;
    current = lang;
    applyHead(lang);
    applySubtree(document.body, lang);
    syncSwitch();
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* privatni način rada — jezik vrijedi samo za ovu stranicu */
      }
    }
  }

  function t(hrText) {
    if (current !== "en") return hrText;
    var out = lookup(norm(hrText));
    return out === null ? hrText : out;
  }

  window.dvaesI18n = {
    get lang() {
      return current;
    },
    setLang: function (l) {
      setLang(l, true);
    },
    t: t
  };

  /* ---------- Pokretanje ---------- */
  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    buildSwitch();
    setLang(saved === "en" || saved === "hr" ? saved : DEFAULT_LANG, false);

    /* Dinamički dodan sadržaj (galerija, lightbox) prevodi se čim se pojavi */
    new MutationObserver(function (muts) {
      if (current !== "en") return;
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) applySubtree(added[j], "en");
      }
    }).observe(document.body, { childList: true, subtree: true });

    /* Gumb se sakrije kad footer uđe u vidno polje */
    var footer = document.querySelector(".site-footer");
    if (footer && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        switchEl.classList.toggle("is-hidden", entries[0].isIntersecting);
      }).observe(footer);
    }

    /* Promjena jezika u drugom tabu */
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY && (e.newValue === "hr" || e.newValue === "en")) {
        setLang(e.newValue, false);
      }
    });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
