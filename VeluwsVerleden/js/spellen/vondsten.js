// Zoek de vondsten (verhaallijn 7): archeologie met warm/koud-hints.

VV_SPELLEN.vondsten = {
  titel: "Zoek de vondsten",
  uitleg: "Je bent archeoloog en graaft in het zand van een Romeins kampterrein. Klik op plekken om te zoeken. Je krijgt hints: koud, lauw, warm of heet. Vind alle vijf de voorwerpen, met zo min mogelijk klikken!",

  start(root, api) {
    const el = SpelVenster.el;
    const NS = "http://www.w3.org/2000/svg";
    const W = 600, H = 380;

    const VONDSTEN = [
      { naam: "Meloenkraal", uitleg: "Een glazen kraal in de vorm van een meloen: een sieraad dat via handel hier kwam.", x: 120, y: 95, kleur: "#2fa6a0" },
      { naam: "Munt", uitleg: "Met een munt betaalden soldaten en kocht je spullen op de markt.", x: 470, y: 130, kleur: "#d9b44a" },
      { naam: "Aardewerkscherf", uitleg: "Scherven vertellen wat mensen aten en dronken.", x: 300, y: 250, kleur: "#b5532f" },
      { naam: "Fibula", uitleg: "Een gesp waarmee je een mantel vastmaakte.", x: 90, y: 300, kleur: "#8e8a80" },
      { naam: "Speldenknop", uitleg: "Een bronzen naald of speld, onderdeel van kleding.", x: 520, y: 310, kleur: "#c08a3e" },
    ];
    const gevonden = new Set();
    let klikken = 0;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "vondst-veld");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Zandgrond om in te graven");

    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("width", W); bg.setAttribute("height", H);
    bg.setAttribute("fill", "#dcc79a");
    svg.appendChild(bg);
    // zandkorrels (vast patroon)
    for (let i = 0; i < 120; i++) {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", (i * 97) % W);
      c.setAttribute("cy", (i * 53 + (i % 7) * 19) % H);
      c.setAttribute("r", 1 + (i % 3));
      c.setAttribute("fill", i % 2 ? "#c9b283" : "#e8d8b0");
      svg.appendChild(c);
    }
    const laag = document.createElementNS(NS, "g");
    svg.appendChild(laag);

    const lijst = el("ul", "vondst-lijst");
    const teller = el("p", "vondst-teller");
    root.append(teller, svg, lijst);

    function bijwerken() {
      teller.textContent = gevonden.size + " van " + VONDSTEN.length + " gevonden  |  " + klikken + " keer gezocht";
    }
    bijwerken();

    function zoek(e) {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width);
      const y = (e.clientY - r.top) * (H / r.height);
      klikken++;

      let dichtstbij = null, afstandMin = Infinity;
      VONDSTEN.forEach((v, i) => {
        if (gevonden.has(i)) return;
        const d = Math.hypot(v.x - x, v.y - y);
        if (d < afstandMin) { afstandMin = d; dichtstbij = i; }
      });
      if (dichtstbij === null) return;

      if (afstandMin <= 30) {
        const v = VONDSTEN[dichtstbij];
        gevonden.add(dichtstbij);
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", v.x); c.setAttribute("cy", v.y); c.setAttribute("r", 14);
        c.setAttribute("fill", v.kleur); c.setAttribute("stroke", "#3a2e22"); c.setAttribute("stroke-width", "2");
        laag.appendChild(c);
        const li = el("li", null);
        const b = el("strong", null, v.naam + ": ");
        li.append(b, document.createTextNode(v.uitleg));
        lijst.appendChild(li);
        api.hint("Gevonden: " + v.naam + "!");
        bijwerken();
        if (gevonden.size === VONDSTEN.length) {
          const fractie = Math.max(0.34, Math.min(1, 10 / klikken));
          const tekst = "Alle vondsten gevonden in " + klikken + " keer zoeken. Zo ontdekken archeologen hoe mensen vroeger leefden.";
          const t = setTimeout(() => api.klaar(fractie, tekst), 1800);
          api.opruimen(() => clearTimeout(t));
        }
        return;
      }
      bijwerken();
      const tekst = afstandMin < 70 ? "Heet!" : afstandMin < 130 ? "Warm." : afstandMin < 220 ? "Lauw." : "Koud.";
      api.hint(tekst);
    }

    svg.addEventListener("click", zoek);
  },
};
