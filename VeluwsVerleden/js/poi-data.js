// Veluws Verleden -- de 10 verhaallijnen (POI's) op de schoolplaat "Oog in oog met de Romeinen"
// x/y zijn percentages (0-100) van de afbeelding, gemeten vanaf linksboven.
// extras: welke invullingen er per verhaallijn al beschikbaar zijn ("verhaal", later ook "spel"/"film"/"quiz").
// spel: id van een spel in js/spellen (molenspel, kleed, legerkamp, vondsten, zoekplaat)
// quiz: vragen; het EERSTE antwoord in "opties" is het goede (volgorde wordt gehusseld)
// film: pad naar een video (bijv. "assets/video/x.mp4"); null = geen filmpje
// audio: pad naar een voorleesbestand (optioneel); laat leeg/weg als die er nog niet is.
// Pas titel/tekst/positie/extras hier aan; de rest van de pagina volgt automatisch.

const SCHOOLPLAAT_POIS = [
  {
    nr: 1,
    titel: "Romeinse legerkampen op de Veluwe",
    x: 44,
    y: 40,
    tekst: "Op verschillende plekken langs de Veluwe sloegen Romeinse soldaten tijdelijke marskampen op. Vanaf zo'n kamp hielden ze de omgeving in de gaten en onderhielden ze contact met de lokale bevolking. Archeologen vinden nog altijd sporen van deze kampen terug in de bodem.",
    extras: ["verhaal", "quiz"],
    audio: null,
    quiz: [
      { vraag: "Waarvoor gebruikten Romeinse soldaten een marskamp?", opties: ["Om tijdelijk veilig te overnachten tijdens een tocht", "Als blijvende stad voor hun families", "Als markt voor boeren"] },
      { vraag: "Hoe vinden archeologen sporen van zo'n kamp terug?", opties: ["Als verkleuringen en gaten in de bodem", "Doordat de gebouwen nog overeind staan", "Op oude Romeinse kaarten die in het zand liggen"] },
    ],
    film: null,
  },
  {
    nr: 2,
    titel: "De verdediging van het legerkamp",
    x: 80,
    y: 58,
    tekst: "Een marskamp werd beschermd met een gracht, een aarden wal en scherpe houten palen. Deze verdediging moest voorkomen dat vijanden, of dieren, zo het kamp in konden lopen. Wachters hielden dag en nacht de omgeving in de gaten.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "legerkamp",
    quiz: [
      { vraag: "Wat groeven Romeinse soldaten rondom het kamp?", opties: ["Een gracht", "Een tunnel", "Een zwembad"] },
      { vraag: "Waarvoor dienden de scherpe houten palen?", opties: ["Om vijanden buiten te houden", "Om de tenten aan op te hangen", "Als brandhout"] },
    ],
    film: null,
  },
  {
    nr: 3,
    titel: "De inrichting van het legerkamp",
    x: 57,
    y: 35,
    tekst: "Binnen het kamp stond alles op een vaste, herkenbare plek: tenten voor de soldaten, opslag voor voedsel en wapens, en een plek voor de officieren. Deze vaste indeling zorgde ervoor dat elk kamp, waar ook ter wereld, er ongeveer hetzelfde uitzag.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "legerkamp",
    quiz: [
      { vraag: "Hoe zag de indeling van een Romeins kamp eruit?", opties: ["Altijd volgens hetzelfde vaste plan", "Elke keer helemaal anders", "Zonder enige regels"] },
      { vraag: "Wie verbleef er in de grootste tent?", opties: ["De commandant", "De kok", "De paarden"] },
    ],
    film: null,
  },
  {
    nr: 4,
    titel: "Kleding en uitrusting van de Romeinen",
    x: 84,
    y: 37,
    tekst: "Een Romeinse soldaat droeg een metalen harnas, een helm en een schild met het embleem van zijn legioen. Zijn uitrusting was zwaar, maar bood goede bescherming tijdens patrouilles en gevechten.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "kleed",
    quiz: [
      { vraag: "Hoe heet het grote rechthoekige Romeinse schild?", opties: ["Scutum", "Galea", "Gladius"] },
      { vraag: "Waarvoor droeg een soldaat een helm?", opties: ["Ter bescherming van zijn hoofd", "Om warm te blijven", "Als drinkbeker"] },
    ],
    film: null,
  },
  {
    nr: 5,
    titel: "De samenstelling van het Romeins leger",
    x: 60,
    y: 43,
    tekst: "Het Romeinse leger bestond uit verschillende onderdelen, van zwaarbewapende legioensoldaten tot hulptroepen uit andere delen van het rijk. Samen zorgden zij voor de orde in een groot gebied, ver van Rome.",
    extras: ["verhaal", "quiz"],
    audio: null,
    quiz: [
      { vraag: "Waaruit bestond het Romeinse leger onder andere?", opties: ["Legioensoldaten en hulptroepen", "Alleen ruiters", "Alleen boogschutters"] },
      { vraag: "Waar kwamen hulptroepen vaak vandaan?", opties: ["Uit gebieden binnen of rond het Romeinse Rijk", "Alleen uit de stad Rome", "Uit het Chinese keizerrijk"] },
    ],
    film: null,
  },
  {
    nr: 6,
    titel: "De lokale bevolking, kleding en hoe ze woonden",
    x: 35,
    y: 45,
    tekst: "De mensen die al op de Veluwe woonden, droegen andere kleding dan de Romeinen en leefden in eenvoudige boerderijen. Toch veranderde hun manier van leven langzaam door het contact met de nieuwkomers.",
    extras: ["verhaal", "quiz"],
    audio: null,
    quiz: [
      { vraag: "Waar woonden de mensen op de Veluwe in die tijd?", opties: ["In boerderijen met rieten daken", "In hoge stenen kastelen", "In flatgebouwen"] },
      { vraag: "Waar leefden zij vooral van?", opties: ["Landbouw en veeteelt", "Het bouwen van kastelen", "Handel met de maan"] },
    ],
    film: null,
  },
  {
    nr: 7,
    titel: "De meloenkraal en andere vondsten",
    x: 41,
    y: 79,
    tekst: "Bij opgravingen op de Veluwe vinden archeologen bijzondere voorwerpen terug, zoals kralen van glas in de vorm van een meloen. Zulke vondsten vertellen ons iets over handel en dagelijks leven in de Romeinse tijd.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "vondsten",
    quiz: [
      { vraag: "Wat is een meloenkraal?", opties: ["Een glazen kraal in de vorm van een meloen", "Een echte meloen", "Een Romeins muntstuk"] },
      { vraag: "Wat vertellen vondsten ons?", opties: ["Iets over handel en dagelijks leven", "Niets, ze zijn waardeloos", "Alleen hoe laat het was"] },
    ],
    film: null,
  },
  {
    nr: 8,
    titel: "Het contact tussen de Romeinen en de lokale bevolking",
    x: 49,
    y: 44,
    tekst: "Romeinen en de lokale bevolking hadden regelmatig contact, bijvoorbeeld door handel of door werk in en rond het kamp. Dat contact zorgde voor uitwisseling van spullen, gewoontes en soms ook taal.",
    extras: ["verhaal", "quiz"],
    audio: null,
    quiz: [
      { vraag: "Hoe kwamen Romeinen en lokale bevolking met elkaar in contact?", opties: ["Door handel en werk in en rond het kamp", "Nooit, ze meden elkaar", "Via de telefoon"] },
      { vraag: "Wat werd er uitgewisseld?", opties: ["Spullen, gewoontes en soms taal", "Alleen wapens", "Niets"] },
    ],
    film: null,
  },
  {
    nr: 9,
    titel: "Het molenspel",
    x: 27,
    y: 79,
    tekst: "In hun vrije tijd speelden Romeinse soldaten spelletjes zoals het molenspel, een bordspel waarbij je je stenen in een rij probeert te krijgen. Dit spel was populair in het hele Romeinse Rijk.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "molenspel",
    quiz: [
      { vraag: "Wat is het doel van het molenspel?", opties: ["Drie stenen op een rij krijgen (een molen)", "Zoveel mogelijk stenen verzamelen", "Als eerste de overkant bereiken"] },
      { vraag: "Wanneer speelden soldaten dit spel?", opties: ["In hun vrije tijd", "Alleen tijdens het gevecht", "Alleen in de winter in Rome"] },
    ],
    film: null,
  },
  {
    nr: 10,
    titel: "Het landschap en de dieren",
    x: 73,
    y: 16,
    tekst: "De Veluwe zag er in de Romeinse tijd anders uit dan nu: meer open zandvlaktes en heide, met dieren zoals roofvogels die er nog steeds te vinden zijn. Het landschap veranderde mede door de aanwezigheid van de Romeinen.",
    extras: ["verhaal", "spel", "quiz"],
    audio: null,
    spel: "zoekplaat",
    quiz: [
      { vraag: "Hoe zag de Veluwe er toen uit?", opties: ["Open zandvlaktes en heide met bos", "Een grote stad", "Een woestijn met palmbomen"] },
      { vraag: "Welk dier hoort bij dit landschap?", opties: ["Een roofvogel", "Een pinguin", "Een kameel"] },
    ],
    film: null,
  },
];
