// Veluws Verleden -- samenhangend verhaalvenster voor spel / quiz / filmpje.
// Elk spel registreert zichzelf in VV_SPELLEN (zie js/spellen/*.js):
//   VV_SPELLEN.<id> = { titel, uitleg, start(root, api) }
// api: klaar(fractie 0..1, tekst) | hint(tekst) | opruimen(fn) | poi
// Scores worden bewust niet opgeslagen.

const VV_SPELLEN = {};

const SpelVenster = (function () {
  function el(tag, klasse, tekst) {
    const e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (tekst !== undefined) e.textContent = tekst;
    return e;
  }

  function sterren(fractie) {
    if (fractie >= 0.85) return 3;
    if (fractie >= 0.5) return 2;
    return 1;
  }

  // opties: { root, type: "spel"|"quiz"|"film", spelId, poi, onTerug }
  // geeft { stop() } terug zodat het venster tussentijds gesloten kan worden.
  function open(opties) {
    const root = opties.root;
    const poi = opties.poi;
    let opruimFns = [];
    let gestopt = false;

    function opruimen() {
      opruimFns.forEach((f) => { try { f(); } catch (e) { /* negeren */ } });
      opruimFns = [];
    }

    function leegmaken() {
      opruimen();
      root.innerHTML = "";
    }

    function terugKnop() {
      const b = el("button", "spel-knop spel-knop--zacht", "Terug naar verhaal");
      b.type = "button";
      b.addEventListener("click", () => {
        gestopt = true;
        leegmaken();
        opties.onTerug();
      });
      return b;
    }

    function toonResultaat(titel, fractie, tekst, opnieuw) {
      leegmaken();
      const n = sterren(fractie);
      const box = el("div", "spel-resultaat");
      box.appendChild(el("h3", null, titel));
      const rij = el("p", "spel-sterren");
      rij.setAttribute("aria-label", n + " van 3 sterren");
      for (let i = 1; i <= 3; i++) {
        rij.appendChild(el("span", i <= n ? "ster is-vol" : "ster", "★"));
      }
      box.appendChild(rij);
      box.appendChild(el("p", "spel-resultaat-tekst", tekst));
      const knoppen = el("div", "spel-knoppen");
      const again = el("button", "spel-knop", "Opnieuw spelen");
      again.type = "button";
      again.addEventListener("click", opnieuw);
      knoppen.appendChild(again);
      knoppen.appendChild(terugKnop());
      box.appendChild(knoppen);
      root.appendChild(box);
    }

    function startSpel(def, titelVoorResultaat) {
      leegmaken();
      const kop = el("h3", "spel-titel", def.titel);
      const hint = el("p", "spel-hint");
      hint.setAttribute("aria-live", "polite");
      const veld = el("div", "spel-veld");
      const onderkant = el("div", "spel-knoppen");
      onderkant.appendChild(terugKnop());
      root.append(kop, hint, veld, onderkant);

      const api = {
        poi: poi,
        hint(tekst) { hint.textContent = tekst || ""; },
        opruimen(fn) { opruimFns.push(fn); },
        klaar(fractie, tekst) {
          if (gestopt) return;
          toonResultaat(titelVoorResultaat || def.titel, fractie, tekst, () => startSpel(def, titelVoorResultaat));
        },
      };
      def.start(veld, api);
    }

    function toonUitleg(def) {
      leegmaken();
      const box = el("div", "spel-intro");
      box.appendChild(el("h3", null, def.titel));
      box.appendChild(el("p", null, def.uitleg));
      const knoppen = el("div", "spel-knoppen");
      const start = el("button", "spel-knop", "Start");
      start.type = "button";
      start.addEventListener("click", () => startSpel(def));
      knoppen.appendChild(start);
      knoppen.appendChild(terugKnop());
      box.appendChild(knoppen);
      root.appendChild(box);
    }

    function toonFilm() {
      leegmaken();
      const box = el("div", "spel-intro");
      box.appendChild(el("h3", null, "Filmpje: " + poi.titel));
      const video = document.createElement("video");
      video.className = "spel-video";
      video.controls = true;
      video.preload = "metadata";
      video.src = poi.film;
      video.addEventListener("error", () => {
        video.replaceWith(el("p", "spel-hint", "Dit filmpje kon niet worden afgespeeld."));
      });
      box.appendChild(video);
      const knoppen = el("div", "spel-knoppen");
      knoppen.appendChild(terugKnop());
      box.appendChild(knoppen);
      root.appendChild(box);
      opruimFns.push(() => { video.pause(); });
    }

    if (opties.type === "film") {
      toonFilm();
    } else if (opties.type === "quiz") {
      const def = VV_SPELLEN.quiz;
      if (!def) { root.textContent = "Quiz niet beschikbaar."; } else { toonUitleg(def); }
    } else {
      const def = VV_SPELLEN[opties.spelId];
      if (!def) {
        root.appendChild(el("p", "spel-hint", "Dit spel is nog niet beschikbaar."));
        root.appendChild(terugKnop());
      } else {
        toonUitleg(def);
      }
    }

    return {
      stop() {
        gestopt = true;
        leegmaken();
      },
    };
  }

  return { open: open, el: el };
})();
