// Bouw het legerkamp (verhaallijn 2 en 3): klik op de juiste plek op de plattegrond.

VV_SPELLEN.legerkamp = {
  titel: "Bouw het legerkamp",
  uitleg: "Dit is de plattegrond van een Romeins marskamp. Je krijgt zes onderdelen. Klik telkens op de plek waar dat onderdeel hoort. Een goede plek maakt het kamp veilig en overzichtelijk!",

  start(root, api) {
    const el = SpelVenster.el;
    const NS = "http://www.w3.org/2000/svg";

    const DELEN = [
      { id: "gracht", naam: "de gracht", kleur: "#7fa3b0",
        hint: "De gracht ligt helemaal aan de buitenkant: de eerste hindernis voor een vijand." },
      { id: "wal", naam: "de aarden wal", kleur: "#8a7347",
        hint: "De wal is opgeworpen met de aarde uit de gracht, dus direct achter de gracht." },
      { id: "palen", naam: "de houten palissade", kleur: "#5a4630",
        hint: "De scherpe houten palen staan bovenop de wal, aan de rand van het kamp." },
      { id: "poort", naam: "de poort", kleur: "#d9b44a",
        hint: "De poort is de ingang: een opening in de palissade." },
      { id: "praetorium", naam: "de tent van de commandant", kleur: "#a8332b",
        hint: "De commandant verblijft in het midden van het kamp, het veiligst en overal bereikbaar." },
      { id: "tenten", naam: "de tenten van de soldaten", kleur: "#c9b98a",
        hint: "De soldaten slapen in rijen tenten aan weerszijden, binnen de palissade." },
    ];

    const ZONES = [
      { id: "gracht", x: 10, y: 10, w: 580, h: 400, fill: "#a9c4cc" },
      { id: "wal", x: 50, y: 50, w: 500, h: 320, fill: "#a58a5a" },
      { id: "palen", x: 80, y: 80, w: 440, h: 260, fill: "#6e573b" },
      { id: "binnen", x: 100, y: 100, w: 400, h: 220, fill: "#ecdfb8" },
      { id: "tenten", x: 115, y: 115, w: 110, h: 190, fill: "#d8c99c" },
      { id: "tenten2", x: 375, y: 115, w: 110, h: 190, fill: "#d8c99c", alias: "tenten" },
      { id: "praetorium", x: 255, y: 160, w: 90, h: 70, fill: "#c9d0c0" },
      { id: "poort", x: 270, y: 322, w: 60, h: 36, fill: "#e0c876" },
    ];

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 600 420");
    svg.setAttribute("class", "kamp-plan");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Plattegrond van een Romeins marskamp");

    const vlakken = {};
    ZONES.forEach((z) => {
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("x", z.x); r.setAttribute("y", z.y);
      r.setAttribute("width", z.w); r.setAttribute("height", z.h);
      r.setAttribute("rx", "6");
      r.setAttribute("fill", z.fill);
      r.setAttribute("class", "kamp-zone");
      r.setAttribute("tabindex", "0");
      r.setAttribute("role", "button");
      r.setAttribute("aria-label", "Plek " + z.id);
      r.addEventListener("click", () => kies(z));
      r.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kies(z); }
      });
      svg.appendChild(r);
      vlakken[z.id] = r;
    });

    const vraag = el("p", "kamp-vraag");
    const voortgang = el("p", "kamp-voortgang");
    root.append(voortgang, vraag, svg);

    let stap = 0;
    let fouten = 0;

    function toon() {
      api.hint("");
      voortgang.textContent = "Onderdeel " + (stap + 1) + " van " + DELEN.length;
      vraag.textContent = "Waar hoort " + DELEN[stap].naam + "? Klik op de plattegrond.";
    }

    function kies(z) {
      if (stap >= DELEN.length) return;
      const deel = DELEN[stap];
      const gekozen = z.alias || z.id;
      if (gekozen !== deel.id) {
        fouten++;
        api.hint("Nog niet goed. " + deel.hint);
        vlakken[z.id].classList.add("is-fout");
        setTimeout(() => vlakken[z.id].classList.remove("is-fout"), 400);
        return;
      }
      const doelen = ZONES.filter((q) => (q.alias || q.id) === deel.id);
      doelen.forEach((q) => {
        vlakken[q.id].setAttribute("fill", deel.kleur);
        vlakken[q.id].classList.add("is-klaar");
        const t = document.createElementNS(NS, "text");
        t.setAttribute("x", q.x + q.w / 2);
        t.setAttribute("y", q.y + q.h / 2 + 5);
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("class", "kamp-label");
        t.textContent = { gracht: "Gracht", wal: "Wal", palen: "Palissade", poort: "Poort",
          praetorium: "Commandant", tenten: "Tenten" }[deel.id];
        if (deel.id === "gracht") { t.setAttribute("y", q.y + 30); }
        if (deel.id === "wal") { t.setAttribute("y", q.y + 20); t.style.fontSize = "13px"; }
        if (deel.id === "palen") { t.setAttribute("y", q.y + 15); t.style.fontSize = "12px"; }
        if (deel.id === "praetorium") { t.style.fontSize = "12px"; }
        svg.appendChild(t);
      });
      api.hint("");
      stap++;
      if (stap >= DELEN.length) {
        vraag.textContent = "Het kamp is af!";
        voortgang.textContent = "";
        const fractie = Math.max(0.34, 1 - fouten * 0.15);
        const tekst = fouten === 0
          ? "Foutloos gebouwd! Zo veilig en overzichtelijk bouwden de Romeinen hun kampen."
          : "Het kamp staat! Je maakte " + fouten + (fouten === 1 ? " fout" : " fouten") + " onderweg.";
        const t = setTimeout(() => api.klaar(fractie, tekst), 1500);
        api.opruimen(() => clearTimeout(t));
        return;
      }
      toon();
    }

    toon();
  },
};
