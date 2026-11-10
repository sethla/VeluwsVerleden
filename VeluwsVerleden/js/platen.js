// Veluws Verleden — bouwt het platenraster op uit SCHOOLPLATEN (zie platen-data.js)

function maakPlaatTegel(plaat) {
  const isBeschikbaar = Boolean(plaat.href);

  const li = document.createElement("li");
  li.className = `plaat-tile ${isBeschikbaar ? "is-active" : "is-soon"}`;

  const meta = document.createElement("div");
  meta.className = "plaat-meta";

  const titleRow = document.createElement("div");
  titleRow.className = "plaat-title-row";

  const nr = document.createElement("span");
  nr.className = "plaat-nr";
  nr.textContent = plaat.nr;

  const titel = document.createElement("h2");
  titel.textContent = plaat.titel;

  titleRow.append(nr, titel);

  const locatie = document.createElement("p");
  locatie.className = "plaat-locatie";
  locatie.textContent = plaat.locatie;

  meta.append(titleRow, locatie);
  li.append(meta);

  if (isBeschikbaar) {
    const scherm = document.createElement("a");
    scherm.href = plaat.href;
    scherm.className = "plaat-screen plaat-screen--active";
    scherm.setAttribute("aria-label", `Open interactieve schoolplaat: ${plaat.titel}`);
    scherm.style.backgroundImage = `url('${plaat.afbeelding}')`;
    li.append(scherm);
  } else {
    const scherm = document.createElement("div");
    scherm.className = "plaat-screen plaat-screen--soon";
    const label = document.createElement("span");
    label.textContent = "Niet beschikbaar";
    scherm.append(label);
    li.append(scherm);
  }

  return li;
}

function isGeldigePlaat(p) {
  return p
    && typeof p.nr === "number"
    && typeof p.titel === "string" && p.titel.length > 0
    && typeof p.locatie === "string" && p.locatie.length > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("platen-grid");
  const errorEl = document.getElementById("platen-error");
  const retryBtn = document.getElementById("platen-retry");

  const dataOk = typeof SCHOOLPLATEN !== "undefined"
    && Array.isArray(SCHOOLPLATEN)
    && SCHOOLPLATEN.length > 0
    && SCHOOLPLATEN.every(isGeldigePlaat);

  if (!dataOk) {
    grid.hidden = true;
    errorEl.hidden = false;
    retryBtn.addEventListener("click", () => window.location.reload());
    return;
  }

  SCHOOLPLATEN.forEach((plaat) => grid.append(maakPlaatTegel(plaat)));
});
