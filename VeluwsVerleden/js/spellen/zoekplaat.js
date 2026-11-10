// Zoekplaat (verhaallijn 10): vind dieren en kenmerken van het landschap op de schoolplaat.

VV_SPELLEN.zoekplaat = {
  titel: "Zoekplaat: landschap en dieren",
  uitleg: "Kijk goed naar de schoolplaat. Je krijgt vijf dingen om te vinden in het landschap van de Veluwe. Klik op de plek waar je ze ziet.",

  start(root, api) {
    const el = SpelVenster.el;
    const NS = "http://www.w3.org/2000/svg";

    // Coordinaten in pixels van assets/images/plaat-03-lowres.jpg (1800 x 1272)
    const DOELEN = [
      { naam: "de roofvogel", x: 1283, y: 270, r: 55, uitleg: "Roofvogels zoals deze buizerd jagen nog steeds boven de Veluwe.",
        hint: "Kijk omhoog, hij vliegt hoog in de lucht." },
      { naam: "de hond", x: 577, y: 529, r: 45, uitleg: "Honden liepen mee met de mensen en bewaakten het erf.",
        hint: "Het is een klein dier op het zandpad, aan de linkerkant van het midden." },
      { naam: "de ossenkar", x: 777, y: 490, r: 45, uitleg: "Met trekdieren en karren werden spullen vervoerd.",
        hint: "Kijk ver weg op het pad dat naar de horizon loopt." },
      { naam: "het huis met rieten dak", x: 1053, y: 452, r: 55, uitleg: "Boerderijen hadden dikke rieten daken en lagen verspreid in het landschap.",
        hint: "Zoek aan de horizon, rechts van het midden." },
      { naam: "de bomenrij", x: 600, y: 425, r: 120, uitleg: "Bossen en akkers wisselden elkaar af met open zandgrond en heide.",
        hint: "Aan de linkerkant van de horizon staat een lange rij groene bomen." },
    ];

    const wrap = el("div", "zoek-wrap");
    const vraag = el("p", "zoek-vraag");
    const voortgang = el("p", "zoek-voortgang");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "250 200 1250 520");
    svg.setAttribute("class", "zoek-plaat");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Schoolplaat om dingen op te zoeken");
    const img = document.createElementNS(NS, "image");
    img.setAttribute("href", "assets/images/plaat-03-lowres.jpg");
    img.setAttribute("x", "0"); img.setAttribute("y", "0");
    img.setAttribute("width", "1800"); img.setAttribute("height", "1272");
    svg.appendChild(img);

    const lijst = el("ul", "vondst-lijst");
    wrap.append(voortgang, vraag, svg, lijst);
    root.appendChild(wrap);

    let stap = 0;
    let fouten = 0;

    function toon() {
      api.hint("");
      voortgang.textContent = "Gevonden: " + stap + " van " + DOELEN.length;
      vraag.textContent = "Zoek " + DOELEN[stap].naam + ".";
    }

    svg.addEventListener("click", (e) => {
      if (stap >= DOELEN.length) return;
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const x = vb.x + (e.clientX - r.left) * (vb.width / r.width);
      const y = vb.y + (e.clientY - r.top) * (vb.height / r.height);
      const d = DOELEN[stap];

      if (Math.hypot(x - d.x, y - d.y) <= d.r) {
        const ring = document.createElementNS(NS, "ellipse");
        ring.setAttribute("cx", d.x); ring.setAttribute("cy", d.y);
        ring.setAttribute("rx", d.r); ring.setAttribute("ry", Math.min(d.r, 60));
        ring.setAttribute("class", "zoek-ring");
        svg.appendChild(ring);
        const li = el("li", null);
        li.append(el("strong", null, d.naam.charAt(0).toUpperCase() + d.naam.slice(1) + ": "),
          document.createTextNode(d.uitleg));
        lijst.appendChild(li);
        stap++;
        if (stap >= DOELEN.length) {
          vraag.textContent = "Alles gevonden!";
          voortgang.textContent = "Gevonden: " + stap + " van " + DOELEN.length;
          const fractie = Math.max(0.34, 1 - fouten * 0.12);
          const tekst = fouten === 0
            ? "Wat een scherp oog! Je vond alles zonder te missen."
            : "Alles gevonden, met " + fouten + (fouten === 1 ? " misser" : " missers") + ".";
          const t = setTimeout(() => api.klaar(fractie, tekst), 1600);
          api.opruimen(() => clearTimeout(t));
          return;
        }
        toon();
      } else {
        fouten++;
        api.hint("Daar is het niet. " + d.hint);
      }
    });

    toon();
  },
};
