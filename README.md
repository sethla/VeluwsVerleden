# Veluws Verleden

Interactieve schoolplaten over de geschiedenis, archeologie en het landschap van de Veluwe. De site is Nederlandstalig en bestaat uit statische HTML-, CSS- en JavaScript-bestanden; er is geen framework, buildstap of externe dependency nodig.

## Project openen

De website staat in de map `VeluwsVerleden/`. Start bij voorkeur een lokale webserver vanuit die map, zodat afbeeldingen en scripts via HTTP worden geladen.

Met Python:

```powershell
cd VeluwsVerleden
python -m http.server 8000
```

Open daarna <http://localhost:8000> in een browser. Stop de server met `Ctrl+C`.

Je kunt ook de map `VeluwsVerleden/` openen in Visual Studio Code en de pagina met een extensie als Live Server bekijken. Er is geen `npm install` of buildcommando nodig.

## Wat zit erin?

- **Startpagina** (`index.html`): introductie en link naar het overzicht.
- **Schoolplatenoverzicht** (`platen.html`): toont de acht geplande platen. Alleen plaat 3 is momenteel interactief beschikbaar.
- **Interactieve plaat** (`plaat3.html`): de plaat *Oog in oog met de Romeinen* bij Ermelo, met tien klikbare verhalen, zoom/pan, voortgang, quizzen en kleine spellen.
- **Eén gedeelde vormgeving** (`css/style.css`): kleuren, componenten, focusstijlen en responsive gedrag voor alle pagina’s.

## Mappen en bestanden

```text
VeluwsVerleden/
├── index.html                 Startpagina
├── platen.html                Overzicht van de schoolplaten
├── plaat3.html                Interactieve Romeinse schoolplaat
├── css/
│   └── style.css              Gedeelde vormgeving
├── js/
│   ├── main.js                Startnavigatie
│   ├── platen-data.js         Titels, locaties en beschikbaarheid
│   ├── platen.js              Opbouw van het platenoverzicht
│   ├── poi-data.js            Verhalen, posities, quizzen en spelkoppelingen
│   ├── plaat3.js              Zoom, markers, checklist en verhaalvenster
│   ├── spel-venster.js        Gedeelde weergave voor spellen, quiz en film
│   └── spellen/               Individuele spelimplementaties
└── assets/
    └── images/                Schoolplaat en voorbeeld-/thumbnailafbeeldingen
```

## Inhoud aanpassen

- **Schoolplaten toevoegen of wijzigen:** pas `VeluwsVerleden/js/platen-data.js` aan. Gebruik een `href` en `afbeelding` voor een beschikbare plaat; zonder `href` blijft de tegel als nog niet beschikbaar gemarkeerd.
- **Verhalen en interacties wijzigen:** bewerk `VeluwsVerleden/js/poi-data.js`. De `x`- en `y`-posities zijn percentages vanaf linksboven. Koppel spellen via de `spel`-ID en voeg quizvragen toe onder `quiz`.
- **Een spel toevoegen:** maak een script onder `VeluwsVerleden/js/spellen/`, registreer de implementatie in `VV_SPELLEN` en laad het script in `plaat3.html`. Gebruik de bestaande spellen als voorbeeld.
- **Afbeeldingen vervangen:** plaats bestanden in `VeluwsVerleden/assets/images/` en werk de relatieve paden in de HTML of `platen-data.js` bij. De Romeinse kijker gebruikt een lichte afbeelding tijdens het laden en wisselt daarna naar de hoge-resolutieversie.
- **Vormgeving wijzigen:** pas de gedeelde kleurvariabelen en componentregels in `VeluwsVerleden/css/style.css` aan.

## Techniek en testen

De site gebruikt gewone HTML, CSS en JavaScript zonder externe libraries. Er is momenteel geen geautomatiseerde test- of buildconfiguratie; controleer wijzigingen daarom door de pagina’s lokaal te openen en de startnavigatie, het platenoverzicht en de interacties op `plaat3.html` te testen. Test ook op een smal scherm.