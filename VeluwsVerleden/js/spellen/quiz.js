// Quiz per verhaallijn: vragen een voor een, met directe feedback en een score aan het eind.
// De vragen staan per verhaallijn in poi-data.js: quiz: [{ vraag, opties: [goed, fout, fout] }]
// Het eerste antwoord in "opties" is het goede; de volgorde wordt hier gehusseld.

VV_SPELLEN.quiz = {
  titel: "Quiz",
  uitleg: "Beantwoord de vragen over deze verhaallijn. Na elk antwoord zie je meteen of het goed was.",

  start(root, api) {
    const el = SpelVenster.el;
    const vragen = (api.poi && Array.isArray(api.poi.quiz)) ? api.poi.quiz : [];

    if (!vragen.length) {
      root.appendChild(el("p", "spel-hint", "Voor deze verhaallijn is nog geen quiz beschikbaar."));
      return;
    }

    function hussel(a) {
      const b = a.slice();
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    }

    const voortgang = el("p", "quiz-voortgang");
    const vraagEl = el("p", "quiz-vraag");
    const opties = el("div", "quiz-opties");
    const feedback = el("p", "quiz-feedback");
    feedback.setAttribute("aria-live", "polite");
    const volgende = el("button", "spel-knop", "Volgende");
    volgende.type = "button";
    volgende.hidden = true;
    root.append(voortgang, vraagEl, opties, feedback, volgende);

    let nr = 0;
    let goed = 0;
    let beantwoord = false;

    function toon() {
      beantwoord = false;
      const v = vragen[nr];
      voortgang.textContent = "Vraag " + (nr + 1) + " van " + vragen.length;
      vraagEl.textContent = v.vraag;
      feedback.textContent = "";
      volgende.hidden = true;
      opties.innerHTML = "";
      const juiste = v.opties[0];
      hussel(v.opties).forEach((tekst) => {
        const b = el("button", "quiz-optie", tekst);
        b.type = "button";
        b.addEventListener("click", () => antwoord(tekst === juiste, b, juiste));
        opties.appendChild(b);
      });
    }

    function antwoord(isGoed, knop, juiste) {
      if (beantwoord) return;
      beantwoord = true;
      if (isGoed) {
        goed++;
        knop.classList.add("is-goed");
        feedback.textContent = "Goed zo!";
      } else {
        knop.classList.add("is-fout");
        feedback.textContent = "Helaas, het juiste antwoord was: " + juiste;
        opties.querySelectorAll(".quiz-optie").forEach((b) => {
          if (b.textContent === juiste) b.classList.add("is-goed");
        });
      }
      opties.querySelectorAll(".quiz-optie").forEach((b) => { b.disabled = true; });
      volgende.textContent = nr + 1 >= vragen.length ? "Bekijk je score" : "Volgende vraag";
      volgende.hidden = false;
    }

    volgende.addEventListener("click", () => {
      nr++;
      if (nr >= vragen.length) {
        api.klaar(goed / vragen.length, "Je had " + goed + " van de " + vragen.length + " vragen goed.");
      } else {
        toon();
      }
    });

    toon();
  },
};
