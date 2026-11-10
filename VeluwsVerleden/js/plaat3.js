// Veluws Verleden -- interactieve schoolplaat: zoom/pan + POI markers
// POI-inhoud staat in poi-data.js (SCHOOLPLAAT_POIS)

document.addEventListener("DOMContentLoaded", () => {
  const viewerBody = document.getElementById("viewer-body");
  const viewerError = document.getElementById("viewer-error");
  const viewerRetry = document.getElementById("viewer-retry");

  // ---------- Gegevens controleren voordat er iets opgebouwd wordt ----------

  function isGeldigePoi(p) {
    return p
      && typeof p.nr === "number"
      && typeof p.titel === "string" && p.titel.length > 0
      && typeof p.x === "number"
      && typeof p.y === "number"
      && typeof p.tekst === "string" && p.tekst.length > 0;
  }

  const dataOk = typeof SCHOOLPLAAT_POIS !== "undefined"
    && Array.isArray(SCHOOLPLAAT_POIS)
    && SCHOOLPLAAT_POIS.length > 0
    && SCHOOLPLAAT_POIS.every(isGeldigePoi);

  if (!dataOk) {
    viewerBody.hidden = true;
    viewerError.hidden = false;
    viewerRetry.addEventListener("click", () => window.location.reload());
    return;
  }

  // ---------- Elementen ----------

  const canvas = document.getElementById("viewer-canvas");
  const transformEl = document.getElementById("viewer-transform");
  const image = document.getElementById("viewer-image");
  const loading = document.getElementById("viewer-loading");
  const loadingScherp = document.getElementById("viewer-loading-scherp");
  const markersLayer = document.getElementById("poi-markers");
  const checklistEl = document.getElementById("poi-checklist-list");
  const voortgangEl = document.getElementById("poi-checklist-voortgang");
  const terugBtn = document.querySelector(".terug-btn");

  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  const panel = document.getElementById("poi-panel");
  const panelBackdrop = document.getElementById("poi-panel-backdrop");
  const panelClose = document.getElementById("poi-panel-close");
  const panelNr = document.getElementById("poi-panel-nr");
  const panelTitel = document.getElementById("poi-panel-titel");
  const panelTekst = document.getElementById("poi-panel-tekst");
  const panelExtras = document.getElementById("poi-panel-extras");
  const panelInner = document.querySelector(".poi-panel-inner");
  const gameEl = document.getElementById("poi-game");
  let actiefSpel = null;

  const congrats = document.getElementById("poi-congrats");
  const congratsClose = document.getElementById("poi-congrats-close");

  const EXTRA_LABELS = { verhaal: "Verhaal", spel: "Spel", film: "Film", quiz: "Quiz" };

  const gezien = new Set();
  let congratsGetoond = false;
  const markerEls = new Map();

  const state = {
    scale: 1,
    minScale: 1,
    maxScale: 1,
    tx: 0,
    ty: 0,
    naturalW: 0,
    naturalH: 0,
  };

  // ---------- Transform toepassen ----------

  function applyTransform() {
    transformEl.style.transform = "translate(" + state.tx + "px, " + state.ty + "px) scale(" + state.scale + ")";
    positionMarkers();
  }

  function clamp() {
    const stageW = canvas.clientWidth;
    const stageH = canvas.clientHeight;
    const imgW = state.naturalW * state.scale;
    const imgH = state.naturalH * state.scale;

    state.tx = imgW <= stageW
      ? (stageW - imgW) / 2
      : Math.min(0, Math.max(stageW - imgW, state.tx));

    state.ty = imgH <= stageH
      ? (stageH - imgH) / 2
      : Math.min(0, Math.max(stageH - imgH, state.ty));
  }

  function zoomAt(px, py, newScale) {
    newScale = Math.min(state.maxScale, Math.max(state.minScale, newScale));
    const imageX = (px - state.tx) / state.scale;
    const imageY = (py - state.ty) / state.scale;

    state.scale = newScale;
    state.tx = px - imageX * newScale;
    state.ty = py - imageY * newScale;

    clamp();
    applyTransform();
  }

  function zoomStep(factor) {
    const stageW = canvas.clientWidth;
    const stageH = canvas.clientHeight;
    zoomAt(stageW / 2, stageH / 2, state.scale * factor);
  }

  // ---------- Opstarten zodra de (eerst lage-resolutie) afbeelding geladen is ----------

  function initViewer() {
    state.naturalW = image.naturalWidth;
    state.naturalH = image.naturalHeight;

    const stageW = canvas.clientWidth;
    const stageH = canvas.clientHeight;

    state.minScale = Math.min(stageW / state.naturalW, stageH / state.naturalH);
    state.maxScale = state.minScale * 10;
    state.scale = state.minScale;
    state.tx = (stageW - state.naturalW * state.scale) / 2;
    state.ty = (stageH - state.naturalH * state.scale) / 2;

    loading.hidden = true;
    canvas.classList.add("is-ready");
    renderMarkers();
    applyTransform();
    laadScherpeVersie();
  }

  // Laadt de hoge-resolutie versie op de achtergrond en wisselt die soepel in,
  // zonder het huidige zoom/pan-standpunt van de bezoeker te verstoren.
  function laadScherpeVersie() {
    const volledigSrc = image.dataset.full;
    if (!volledigSrc || volledigSrc === image.currentSrc) return;

    loadingScherp.hidden = false;
    const hogeResolutie = new Image();

    hogeResolutie.addEventListener("load", () => {
      const oudeNaturalW = state.naturalW;
      image.src = volledigSrc;
      state.naturalW = hogeResolutie.naturalWidth;
      state.naturalH = hogeResolutie.naturalHeight;
      // Zelfde beeldgrootte op het scherm behouden, alleen scherper.
      state.scale = state.scale * (oudeNaturalW / state.naturalW);
      state.minScale = state.minScale * (oudeNaturalW / state.naturalW);
      state.maxScale = state.minScale * 10;
      clamp();
      applyTransform();
      loadingScherp.hidden = true;
    });

    hogeResolutie.addEventListener("error", () => {
      // Lage resolutie blijft gewoon zichtbaar; geen harde fout nodig.
      loadingScherp.hidden = true;
    });

    hogeResolutie.src = volledigSrc;
  }

  // De checklist heeft de afbeelding niet nodig en verschijnt meteen.
  renderChecklist();

  if (image.complete && image.naturalWidth) {
    initViewer();
  } else {
    image.addEventListener("load", initViewer);
  }

  window.addEventListener("resize", () => {
    if (!state.naturalW) return;
    clamp();
    applyTransform();
  });

  // ---------- Terug: sluit een open verhaal eerst, navigeert daarna gewoon door ----------

  if (terugBtn) {
    terugBtn.addEventListener("click", () => {
      closePoi();
    });
  }

  // ---------- Slepen (muis + touch, via Pointer Events) ----------

  const actievePointers = new Map();
  let sleepStart = null;
  let knijpStart = null;

  function pointerStart(e, target) {
    target.setPointerCapture(e.pointerId);
    actievePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (actievePointers.size === 1) {
      sleepStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
    } else if (actievePointers.size === 2) {
      sleepStart = null;
      const pts = [...actievePointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      knijpStart = {
        afstand: Math.hypot(dx, dy),
        scale: state.scale,
        midX: (pts[0].x + pts[1].x) / 2,
        midY: (pts[0].y + pts[1].y) / 2,
      };
    }
  }

  function pointerVerplaatst(e) {
    if (!actievePointers.has(e.pointerId)) return;
    actievePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (actievePointers.size === 2 && knijpStart) {
      const pts = [...actievePointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const afstand = Math.hypot(dx, dy);
      const factor = afstand / knijpStart.afstand;
      const rect = canvas.getBoundingClientRect();
      zoomAt(
        knijpStart.midX - rect.left,
        knijpStart.midY - rect.top,
        knijpStart.scale * factor
      );
    } else if (actievePointers.size === 1 && sleepStart) {
      state.tx = sleepStart.tx + (e.clientX - sleepStart.x);
      state.ty = sleepStart.ty + (e.clientY - sleepStart.y);
      clamp();
      applyTransform();
    }
  }

  function pointerEinde(e) {
    actievePointers.delete(e.pointerId);
    sleepStart = null;
    knijpStart = null;
    if (actievePointers.size === 1) {
      const p = [...actievePointers.values()][0];
      sleepStart = { x: p.x, y: p.y, tx: state.tx, ty: state.ty };
    }
  }

  canvas.addEventListener("pointerdown", (e) => pointerStart(e, canvas));
  canvas.addEventListener("pointermove", pointerVerplaatst);
  canvas.addEventListener("pointerup", pointerEinde);
  canvas.addEventListener("pointercancel", pointerEinde);
  canvas.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "touch") pointerEinde(e);
  });

  // ---------- Muiswiel zoomen ----------

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, state.scale * factor);
    },
    { passive: false }
  );

  // ---------- Dubbelklik / dubbeltik om in te zoomen ----------

  canvas.addEventListener("dblclick", (e) => {
    const rect = canvas.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, state.scale * 1.6);
  });

  zoomInBtn.addEventListener("click", () => zoomStep(1.4));
  zoomOutBtn.addEventListener("click", () => zoomStep(1 / 1.4));

  // ---------- POI-markers ----------

  const TIK_DREMPEL = 6; // px -- boven dit verschil is het slepen, geen tik

  function renderMarkers() {
    markersLayer.innerHTML = "";
    markerEls.clear();

    SCHOOLPLAAT_POIS.forEach((poi) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "poi-marker";
      btn.setAttribute("aria-label", "Verhaal " + poi.nr + ": " + poi.titel);
      btn.textContent = String(poi.nr);

      // Een marker mag alleen openen bij een echte tik/klik, niet als de
      // bezoeker vanaf dit punt de plaat probeerde te slepen. Toetsenbord-
      // activering (Enter/spatie) vuurt alleen "click" en werkt dus gewoon door.
      let tikStart = null;
      let wasSlepen = false;

      btn.addEventListener("pointerdown", (e) => {
        tikStart = { x: e.clientX, y: e.clientY };
        wasSlepen = false;
      });
      btn.addEventListener("pointermove", (e) => {
        if (!tikStart) return;
        const afstand = Math.hypot(e.clientX - tikStart.x, e.clientY - tikStart.y);
        if (afstand > TIK_DREMPEL) wasSlepen = true;
      });
      btn.addEventListener("pointerup", () => {
        tikStart = null;
      });
      btn.addEventListener("click", () => {
        if (wasSlepen) {
          wasSlepen = false;
          return;
        }
        openPoi(poi);
      });

      markersLayer.appendChild(btn);
      markerEls.set(poi.nr, btn);
    });
  }

  function positionMarkers() {
    SCHOOLPLAAT_POIS.forEach((poi) => {
      const el = markerEls.get(poi.nr);
      if (!el) return;
      const x = state.tx + (poi.x / 100) * state.naturalW * state.scale;
      const y = state.ty + (poi.y / 100) * state.naturalH * state.scale;
      el.style.transform = "translate(" + x + "px, " + y + "px) translate(-50%, -50%)";
    });
  }

  // ---------- Checklist ----------

  function renderChecklist() {
    checklistEl.innerHTML = "";
    SCHOOLPLAAT_POIS.forEach((poi) => {
      const li = document.createElement("li");
      li.className = "poi-checklist-item";
      li.dataset.nr = poi.nr;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "poi-checklist-btn";

      const vinkje = document.createElement("span");
      vinkje.className = "poi-checklist-vinkje";
      vinkje.textContent = gezien.has(poi.nr) ? "✓" : String(poi.nr);

      const tekst = document.createElement("span");
      tekst.textContent = poi.titel;

      btn.appendChild(vinkje);
      btn.appendChild(tekst);
      btn.addEventListener("click", () => {
        if (state.naturalW) springNaarPoi(poi);
        openPoi(poi);
      });

      li.appendChild(btn);
      checklistEl.appendChild(li);
    });

    bijwerkenVoortgang();
  }

  function bijwerkenVoortgang() {
    voortgangEl.textContent = gezien.size + " van " + SCHOOLPLAAT_POIS.length + " ontdekt";
  }

  function springNaarPoi(poi) {
    const stageW = canvas.clientWidth;
    const stageH = canvas.clientHeight;
    const doelScale = Math.min(state.maxScale, Math.max(state.scale, state.minScale * 3));
    const imageX = (poi.x / 100) * state.naturalW;
    const imageY = (poi.y / 100) * state.naturalH;
    state.scale = doelScale;
    state.tx = stageW / 2 - imageX * state.scale;
    state.ty = stageH / 2 - imageY * state.scale;
    clamp();
    applyTransform();
  }

  // ---------- POI-paneel ----------

  function openPoi(poi) {
    const wasAlGezien = gezien.has(poi.nr);
    gezien.add(poi.nr);

    panelNr.textContent = String(poi.nr);
    panelTitel.textContent = poi.titel;
    panelTekst.textContent = poi.tekst;

    stopSpel();
    panelExtras.innerHTML = "";
    (poi.extras || []).forEach((extra) => {
      const actie = (extra === "spel" && poi.spel) || (extra === "quiz" && Array.isArray(poi.quiz) && poi.quiz.length)
        || (extra === "film" && poi.film);
      if (extra === "verhaal" || !actie) {
        if (extra === "verhaal") {
          const pill = document.createElement("span");
          pill.className = "poi-extra-pill";
          pill.textContent = EXTRA_LABELS[extra];
          panelExtras.appendChild(pill);
        }
        return;
      }
      const knop = document.createElement("button");
      knop.type = "button";
      knop.className = "poi-extra-pill is-actie";
      knop.textContent = extra === "spel" ? "Speel spel" : extra === "film" ? "Bekijk filmpje" : "Quiz";
      knop.addEventListener("click", () => startExtra(poi, extra));
      panelExtras.appendChild(knop);
    });
    if (poi.audio) {
      const audio = document.createElement("audio");
      audio.className = "poi-audio";
      audio.controls = true;
      audio.src = poi.audio;
      panelExtras.appendChild(audio);
    }

    panel.hidden = false;
    panelBackdrop.hidden = false;
    const markerEl = markerEls.get(poi.nr);
    if (markerEl) markerEl.classList.add("is-seen");
    updateChecklistVinkjes();
    bijwerkenVoortgang();

    if (!wasAlGezien) checkAllesOntdekt();
  }

  function checkAllesOntdekt() {
    if (congratsGetoond) return;
    if (gezien.size < SCHOOLPLAAT_POIS.length) return;
    congratsGetoond = true;
    congrats.hidden = false;
  }

  function updateChecklistVinkjes() {
    checklistEl.querySelectorAll(".poi-checklist-item").forEach((li) => {
      const nr = Number(li.dataset.nr);
      const vinkje = li.querySelector(".poi-checklist-vinkje");
      if (gezien.has(nr)) {
        vinkje.textContent = "✓";
        li.classList.add("is-seen");
      }
    });
  }

  function stopSpel() {
    if (actiefSpel) { actiefSpel.stop(); actiefSpel = null; }
    gameEl.hidden = true;
    gameEl.innerHTML = "";
    panelInner.hidden = false;
    panel.classList.remove("is-game");
  }

  function startExtra(poi, type) {
    stopSpel();
    panelInner.hidden = true;
    gameEl.hidden = false;
    panel.classList.add("is-game");
    actiefSpel = SpelVenster.open({
      root: gameEl,
      type: type,
      spelId: poi.spel,
      poi: poi,
      onTerug: () => { actiefSpel = null; stopSpel(); },
    });
  }

  function closePoi() {
    stopSpel();
    panel.hidden = true;
    panelBackdrop.hidden = true;
  }

  panelClose.addEventListener("click", closePoi);
  panelBackdrop.addEventListener("click", closePoi);
  congratsClose.addEventListener("click", () => {
    congrats.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePoi();
  });
});
