// Kleed de Romein aan (verhaallijn 4)

VV_SPELLEN.kleed = {
  titel: "Kleed de Romein aan",
  uitleg: "Een Romeinse soldaat staat klaar, maar hij heeft nog niets aan! Kies bij elk onderdeel wat een Romeinse legionair echt droeg. Kies je verkeerd, dan krijg je een hint.",

  start(root, api) {
    const el = SpelVenster.el;
    const NS = "http://www.w3.org/2000/svg";

    const STAPPEN = [
      { laag: "tuniek", vraag: "Wat droeg hij als eerste kledingstuk op zijn lichaam?",
        goed: "Tunica: een wollen hemd tot de knieen", fout: ["Spijkerbroek", "Pak met stropdas"],
        hint: "Romeinen droegen geen broeken maar een lang wollen hemd." },
      { laag: "harnas", vraag: "Wat droeg hij als bescherming over zijn tunica?",
        goed: "Lorica segmentata: harnas van metalen platen", fout: ["Middeleeuws ridderharnas", "Dikke winterjas"],
        hint: "Het harnas bestond uit overlappende metalen banden, maar niet uit de middeleeuwen." },
      { laag: "helm", vraag: "Wat zette hij op zijn hoofd?",
        goed: "Galea: metalen helm met nekbeschermer", fout: ["Vikinghelm met hoorns", "Wollen muts"],
        hint: "Een metalen helm, maar hoorns hoorden bij de Vikingen." },
      { laag: "schild", vraag: "Welk schild droeg hij?",
        goed: "Scutum: groot, rechthoekig en gebogen", fout: ["Driehoekig ridderschild", "Rond houten tafelblad"],
        hint: "Het Romeinse schild was een groot, gebogen rechthoek." },
      { laag: "zwaard", vraag: "Welk wapen hing aan zijn riem?",
        goed: "Gladius: kort steekzwaard", fout: ["Kruisboog", "Tweehandig ridderzwaard"],
        hint: "Een kort zwaard om mee te steken, geschikt voor dicht op elkaar vechten." },
      { laag: "schoenen", vraag: "Wat droeg hij aan zijn voeten?",
        goed: "Caligae: sandalen met ijzeren spijkertjes", fout: ["Sportschoenen", "Houten klompen"],
        hint: "Open sandalen met nagels onder de zool, om stevig te lopen." },
    ];

    // Volgorde van antwoorden husselen
    function hussel(a) {
      const b = a.slice();
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    }

    // ---------- Soldaat (SVG) ----------
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 320");
    svg.setAttribute("class", "kleed-soldaat");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Romeinse soldaat die je aankleedt");
    svg.innerHTML =
      '<ellipse cx="100" cy="306" rx="60" ry="8" fill="rgba(0,0,0,.15)"/>' +
      '<rect x="78" y="190" width="18" height="100" rx="6" fill="#e0b28a"/>' +
      '<rect x="104" y="190" width="18" height="100" rx="6" fill="#e0b28a"/>' +
      '<rect x="62" y="96" width="76" height="100" rx="14" fill="#e0b28a"/>' +
      '<rect x="40" y="100" width="22" height="80" rx="10" fill="#e0b28a"/>' +
      '<rect x="138" y="100" width="22" height="80" rx="10" fill="#e0b28a"/>' +
      '<circle cx="100" cy="66" r="28" fill="#e8bd96"/>' +
      '<circle cx="90" cy="64" r="3" fill="#333"/><circle cx="110" cy="64" r="3" fill="#333"/>' +
      '<path d="M90 78 Q100 85 110 78" stroke="#333" stroke-width="2.5" fill="none"/>' +
      '<g class="laag" data-laag="tuniek" style="display:none">' +
        '<path d="M60 100 H140 L146 200 H54 Z" fill="#a8332b"/>' +
        '<rect x="40" y="100" width="22" height="30" rx="8" fill="#a8332b"/>' +
        '<rect x="138" y="100" width="22" height="30" rx="8" fill="#a8332b"/></g>' +
      '<g class="laag" data-laag="harnas" style="display:none">' +
        '<rect x="64" y="100" width="72" height="22" rx="6" fill="#aab2b8"/>' +
        '<rect x="64" y="122" width="72" height="16" rx="5" fill="#9aa3aa"/>' +
        '<rect x="64" y="138" width="72" height="16" rx="5" fill="#aab2b8"/>' +
        '<rect x="64" y="154" width="72" height="16" rx="5" fill="#9aa3aa"/></g>' +
      '<g class="laag" data-laag="helm" style="display:none">' +
        '<path d="M70 52 A30 34 0 0 1 130 52 V56 H70 Z" fill="#b9c0c6" stroke="#6f777d" stroke-width="2"/>' +
        '<rect x="66" y="50" width="68" height="7" fill="#9aa3aa"/>' +
        '<path d="M96 10 H104 V24 H96 Z" fill="#a8332b"/>' +
        '<path d="M70 56 L62 84 H80 Z" fill="#9aa3aa"/></g>' +
      '<g class="laag" data-laag="schild" style="display:none">' +
        '<rect x="2" y="104" width="52" height="108" rx="12" fill="#2c4f7a" stroke="#d9b44a" stroke-width="4"/>' +
        '<circle cx="28" cy="158" r="9" fill="#d9b44a"/></g>' +
      '<g class="laag" data-laag="zwaard" style="display:none">' +
        '<rect x="56" y="168" width="88" height="10" fill="#6b4a2a"/>' +
        '<rect x="150" y="120" width="8" height="70" fill="#cfd6da"/>' +
        '<rect x="146" y="188" width="16" height="6" fill="#6b4a2a"/></g>' +
      '<g class="laag" data-laag="schoenen" style="display:none">' +
        '<rect x="74" y="280" width="26" height="14" rx="4" fill="#7a4a24"/>' +
        '<rect x="100" y="280" width="26" height="14" rx="4" fill="#7a4a24"/>' +
        '<path d="M80 270 H94 M106 270 H120" stroke="#7a4a24" stroke-width="3"/></g>';

    const links = el("div", "kleed-links");
    links.appendChild(svg);
    const rechts = el("div", "kleed-rechts");
    const vraag = el("p", "kleed-vraag");
    const opties = el("div", "kleed-opties");
    const voortgang = el("p", "kleed-voortgang");
    rechts.append(voortgang, vraag, opties);
    const wrap = el("div", "kleed-wrap");
    wrap.append(links, rechts);
    root.appendChild(wrap);

    let stap = 0;
    let fouten = 0;

    function toon() {
      api.hint("");
      const s = STAPPEN[stap];
      voortgang.textContent = "Onderdeel " + (stap + 1) + " van " + STAPPEN.length;
      vraag.textContent = s.vraag;
      opties.innerHTML = "";
      hussel([s.goed].concat(s.fout)).forEach((tekst) => {
        const b = el("button", "kleed-optie", tekst);
        b.type = "button";
        b.addEventListener("click", () => kies(tekst === s.goed, b));
        opties.appendChild(b);
      });
    }

    function kies(goed, knop) {
      const s = STAPPEN[stap];
      if (!goed) {
        fouten++;
        knop.disabled = true;
        knop.classList.add("is-fout");
        api.hint("Niet helemaal. " + s.hint);
        return;
      }
      svg.querySelector('[data-laag="' + s.laag + '"]').style.display = "";
      stap++;
      if (stap >= STAPPEN.length) {
        vraag.textContent = "De soldaat is klaar voor het marskamp!";
        opties.innerHTML = "";
        voortgang.textContent = "";
        const fractie = Math.max(0.34, 1 - fouten * 0.2);
        const tekst = fouten === 0
          ? "Foutloos! Je weet precies wat een Romeinse legionair droeg."
          : "Goed gedaan! Je maakte " + fouten + (fouten === 1 ? " fout" : " fouten") + ". Probeer het nog eens foutloos.";
        const t = setTimeout(() => api.klaar(fractie, tekst), 1400);
        api.opruimen(() => clearTimeout(t));
        return;
      }
      toon();
    }

    toon();
  },
};
