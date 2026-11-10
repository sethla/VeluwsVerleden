// Molenspel (verhaallijn 9): mens (wit) tegen computer (donker).
// Fase 1: stenen plaatsen. Fase 2: schuiven. Met 3 stenen mag je springen.

VV_SPELLEN.molenspel = {
  titel: "Het molenspel",
  uitleg: "Plaats om en om je stenen op het bord. Krijg je drie stenen op een rij (een molen), dan mag je een steen van de computer weghalen. Zijn alle stenen geplaatst, dan schuif je naar een aangrenzend punt. Heeft iemand nog maar 3 stenen, dan mag die springen. Wie de tegenstander tot 2 stenen of vast zet wint!",

  start(root, api) {
    const el = SpelVenster.el;
    const NS = "http://www.w3.org/2000/svg";

    const CO = [
      [0, 0], [3, 0], [6, 0], [6, 3], [6, 6], [3, 6], [0, 6], [0, 3],
      [1, 1], [3, 1], [5, 1], [5, 3], [5, 5], [3, 5], [1, 5], [1, 3],
      [2, 2], [3, 2], [4, 2], [4, 3], [4, 4], [3, 4], [2, 4], [2, 3],
    ];
    const MOLENS = [];
    [0, 8, 16].forEach((o) => {
      [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]].forEach((m) => MOLENS.push(m.map((i) => i + o)));
    });
    [1, 3, 5, 7].forEach((i) => MOLENS.push([i, i + 8, i + 16]));

    const BUREN = CO.map(() => []);
    function verbind(a, b) { BUREN[a].push(b); BUREN[b].push(a); }
    [0, 8, 16].forEach((o) => {
      for (let i = 0; i < 8; i++) verbind(o + i, o + ((i + 1) % 8));
    });
    [1, 3, 5, 7].forEach((i) => { verbind(i, i + 8); verbind(i + 8, i + 16); });

    const MENS = "h";
    const PC = "c";
    const ander = (s) => (s === MENS ? PC : MENS);

    const bord = new Array(24).fill(null);
    const teplaatsen = { h: 9, c: 9 };
    let aanZet = MENS;
    let modus = "plaats"; // plaats | kies | verplaats | verwijder | klaar
    let gekozen = null;
    let zetten = 0;
    let timer = null;
    api.opruimen(() => { if (timer) clearTimeout(timer); });

    // ---------- Regels ----------

    function opBord(s) { return bord.filter((x) => x === s).length; }
    function totaal(s) { return opBord(s) + teplaatsen[s]; }
    function inMolen(b, i, s) {
      return MOLENS.some((m) => m.includes(i) && m.every((p) => b[p] === s));
    }
    function springt(s) { return teplaatsen[s] === 0 && opBord(s) === 3; }

    function legaleZetten(s) {
      const res = [];
      if (teplaatsen[s] > 0) {
        bord.forEach((v, i) => { if (v === null) res.push({ naar: i }); });
        return res;
      }
      bord.forEach((v, van) => {
        if (v !== s) return;
        if (springt(s)) {
          bord.forEach((w, naar) => { if (w === null) res.push({ van, naar }); });
        } else {
          BUREN[van].forEach((naar) => { if (bord[naar] === null) res.push({ van, naar }); });
        }
      });
      return res;
    }

    function verwijderbaar(tegenstander) {
      const alle = [];
      bord.forEach((v, i) => { if (v === tegenstander) alle.push(i); });
      const vrij = alle.filter((i) => !inMolen(bord, i, tegenstander));
      return vrij.length ? vrij : alle;
    }

    // ---------- Tekenen ----------

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 600 600");
    svg.setAttribute("class", "molen-bord");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Molenspelbord");
    const px = (c) => 50 + c * 83.3;

    function lijn(a, b) {
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", px(CO[a][0])); l.setAttribute("y1", px(CO[a][1]));
      l.setAttribute("x2", px(CO[b][0])); l.setAttribute("y2", px(CO[b][1]));
      l.setAttribute("class", "molen-lijn");
      svg.appendChild(l);
    }
    BUREN.forEach((lst, a) => lst.forEach((b) => { if (a < b) lijn(a, b); }));

    const punten = CO.map((c, i) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("transform", "translate(" + px(c[0]) + "," + px(c[1]) + ")");
      g.setAttribute("class", "molen-punt");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", "Punt " + (i + 1));
      const hit = document.createElementNS(NS, "circle");
      hit.setAttribute("r", "30"); hit.setAttribute("class", "molen-hit");
      const stip = document.createElementNS(NS, "circle");
      stip.setAttribute("r", "9"); stip.setAttribute("class", "molen-stip");
      const steen = document.createElementNS(NS, "circle");
      steen.setAttribute("r", "24"); steen.setAttribute("class", "molen-steen");
      g.append(hit, stip, steen);
      g.addEventListener("click", () => klik(i));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); klik(i); }
      });
      svg.appendChild(g);
      return { g, steen };
    });

    const status = el("p", "molen-status");
    const teller = el("p", "molen-teller");
    root.append(status, svg, teller);

    function teken() {
      punten.forEach((p, i) => {
        const v = bord[i];
        p.steen.setAttribute("class", "molen-steen" + (v ? " is-" + v : "") + (gekozen === i ? " is-gekozen" : ""));
        p.g.classList.toggle("is-leeg", v === null);
      });
      teller.textContent = "Jij: " + opBord(MENS) + " op het bord, " + teplaatsen.h + " te plaatsen  |  Computer: " +
        opBord(PC) + " op het bord, " + teplaatsen.c + " te plaatsen";
    }

    function zeg(t) { status.textContent = t; }

    // ---------- Beurten ----------

    function beeindig(winnaar, reden) {
      modus = "klaar";
      teken();
      if (winnaar === MENS) {
        api.klaar(1, "Gewonnen! " + reden + " Je speelt het molenspel net zoals Romeinse soldaten dat deden.");
      } else if (winnaar === PC) {
        api.klaar(0.3, "De computer won. " + reden + " Probeer het nog eens!");
      } else {
        api.klaar(0.5, reden);
      }
    }

    function controleerEinde(wieKomtAanDeBeurt) {
      const s = wieKomtAanDeBeurt;
      if (totaal(s) < 3) { beeindig(ander(s), s === MENS ? "Jij hebt nog maar 2 stenen." : "De computer heeft nog maar 2 stenen."); return true; }
      if (legaleZetten(s).length === 0) { beeindig(ander(s), s === MENS ? "Je kunt geen steen meer verplaatsen." : "De computer zit vast."); return true; }
      if (zetten >= 250) { beeindig(null, "Gelijkspel: het spel duurde erg lang."); return true; }
      return false;
    }

    function naZet(speler, index) {
      zetten++;
      if (inMolen(bord, index, speler)) {
        if (speler === MENS) {
          modus = "verwijder";
          zeg("Molen! Kies een steen van de computer om weg te halen.");
          teken();
          return;
        }
        const keuze = kiesVerwijdering(speler);
        bord[keuze] = null;
      }
      volgendeBeurt();
    }

    function volgendeBeurt() {
      gekozen = null;
      aanZet = ander(aanZet);
      teken();
      if (controleerEinde(aanZet)) return;
      if (aanZet === MENS) {
        modus = teplaatsen.h > 0 ? "plaats" : "kies";
        zeg(modus === "plaats"
          ? "Jouw beurt: plaats een steen (" + teplaatsen.h + " over)."
          : (springt(MENS) ? "Jouw beurt: kies een steen; je mag springen!" : "Jouw beurt: kies een steen om te schuiven."));
      } else {
        modus = "computer";
        zeg("De computer denkt na...");
        timer = setTimeout(computerZet, 650);
      }
    }

    function klik(i) {
      if (aanZet !== MENS) return;
      if (modus === "plaats") {
        if (bord[i] !== null) { api.hint("Dat punt is al bezet, kies een leeg punt."); return; }
        api.hint("");
        bord[i] = MENS; teplaatsen.h--;
        teken();
        naZet(MENS, i);
      } else if (modus === "kies") {
        if (bord[i] !== MENS) { api.hint("Kies een van je eigen (witte) stenen."); return; }
        const opties = legaleZetten(MENS).filter((z) => z.van === i);
        if (!opties.length) { api.hint("Deze steen kan nergens heen. Kies een andere."); return; }
        api.hint("");
        gekozen = i; modus = "verplaats";
        zeg("Kies nu een leeg punt om naartoe te gaan.");
        teken();
      } else if (modus === "verplaats") {
        if (bord[i] === MENS) { gekozen = i; teken(); return; }
        const ok = legaleZetten(MENS).some((z) => z.van === gekozen && z.naar === i);
        if (!ok) { api.hint("Die zet mag niet: schuif naar een leeg, aangrenzend punt" + (springt(MENS) ? "." : " (springen mag pas met 3 stenen)." )); return; }
        api.hint("");
        bord[gekozen] = null; bord[i] = MENS;
        gekozen = null;
        teken();
        naZet(MENS, i);
      } else if (modus === "verwijder") {
        const toegestaan = verwijderbaar(PC);
        if (bord[i] !== PC) { api.hint("Kies een donkere steen van de computer."); return; }
        if (!toegestaan.includes(i)) { api.hint("Die steen staat in een molen en is beschermd. Kies een andere."); return; }
        api.hint("");
        bord[i] = null;
        teken();
        volgendeBeurt();
      }
    }

    // ---------- Computer ----------

    function kiesVerwijdering(speler) {
      const tegen = ander(speler);
      const kand = verwijderbaar(tegen);
      let beste = kand[0], bestScore = -1;
      kand.forEach((i) => {
        let score = Math.random();
        MOLENS.forEach((m) => {
          if (!m.includes(i)) return;
          const n = m.filter((p) => bord[p] === tegen).length;
          const leeg = m.filter((p) => bord[p] === null).length;
          if (n === 2 && leeg === 1) score += 3;
        });
        if (score > bestScore) { bestScore = score; beste = i; }
      });
      return beste;
    }

    function waardeer(z, speler) {
      const tegen = ander(speler);
      let score = Math.random();
      const kopie = bord.slice();
      if (z.van !== undefined) kopie[z.van] = null;
      kopie[z.naar] = speler;
      if (inMolen(kopie, z.naar, speler)) score += 100;
      const check = bord.slice();
      if (z.van !== undefined) check[z.van] = null;
      check[z.naar] = tegen;
      if (inMolen(check, z.naar, tegen)) score += 50;
      score += BUREN[z.naar].filter((n) => kopie[n] === speler).length * 2;
      score += BUREN[z.naar].filter((n) => kopie[n] === null).length;
      return score;
    }

    function computerZet() {
      timer = null;
      if (aanZet !== PC || modus === "klaar") return;
      const zetjes = legaleZetten(PC);
      if (!zetjes.length) { controleerEinde(PC); return; }
      let beste = zetjes[0], bestScore = -1;
      zetjes.forEach((z) => {
        const s = waardeer(z, PC);
        if (s > bestScore) { bestScore = s; beste = z; }
      });
      if (beste.van !== undefined) bord[beste.van] = null;
      else teplaatsen.c--;
      bord[beste.naar] = PC;
      teken();
      const molen = inMolen(bord, beste.naar, PC);
      if (molen) {
        zeg("De computer maakte een molen en haalt een steen van je weg!");
        const w = kiesVerwijdering(PC);
        bord[w] = null;
        teken();
      }
      zetten++;
      volgendeBeurt();
    }

    teken();
    zeg("Jouw beurt: plaats een steen (9 over).");
  },
};
