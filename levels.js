const levelConfig = [
    {
        level: 0,
        name: "Einfache Fehler",
        sentences: 1,
        errorProbs: {
            1: 100,  // Klein statt Groß
            2: 0,  // i statt ie
            3: 0,   // Vergessene h-Dehnung
            4: 0,  // Einfacher statt Doppelkonsonant
            5: 0,   // d statt t am Wortende
            6: 0,   // t statt d am Wortende
            7: 0,  // das statt dass
            8: 0,   // dass statt das
            9: 0,   // wie statt als
            10: 0,  // f statt v in ver- und vor-
            11: 0,  // f statt pf
            12: 0,  // e statt ä
            13: 0   // Unnötiges h nach Vokal
        }
    },
    {
        level: 1,
        name: "Mehr Fehlerarten",
        sentences: 2
    },
    {
        level: 2,
        name: "Mehr Fehlerarten",
        sentences: 2
    },
  {
        level: 3,
        name: "Mehr Fehlerarten",
        sentences: 3
    },
 {
        level: 4,
        name: "Mehr Fehlerarten",
        sentences: 4
    },

    {
        level: 5,
        name: "Spezielle Fehler",
        sentences: 4,
        errorProbs: {
            1: 10,  // Klein statt Groß
            2: 10,  // i statt ie
            3: 10,  // Vergessene h-Dehnung
            4: 10,  // Einfacher statt Doppelkonsonant
            5: 10,  // d statt t am Wortende
            6: 10,  // t statt d am Wortende
            7: 10,  // das statt dass
            8: 10,  // dass statt das
            9: 10,  // wie statt als
            10: 30, // f statt v in ver- und vor-
            11: 30, // f statt pf
            12: 20, // e statt ä
            13: 20  // Unnötiges h nach Vokal
        }
    },
    {
        level: 5,
        name: "Alle Fehlertypen",
        sentences: 5,
        errorProbs: {
            1: 15,  // Klein statt Groß
            2: 15,  // i statt ie
            3: 15,  // Vergessene h-Dehnung
            4: 15,  // Einfacher statt Doppelkonsonant
            5: 15,  // d statt t am Wortende
            6: 15,  // t statt d am Wortende
            7: 15,  // das statt dass
            8: 15,  // dass statt das
            9: 15,  // wie statt als
            10: 15, // f statt v in ver- und vor-
            11: 15, // f statt pf
            12: 15, // e statt ä
            13: 15  // Unnötiges h nach Vokal
        }
    }
];