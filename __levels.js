const levelConfig = [
    {
        level: 0,
        name: "Einfache Fehler",
        sentences: 3,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 100,  // i statt ie
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
        name: "Einfache Fehler",
        sentences: 3,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 0,  // i statt ie
            3: 100,   // Vergessene h-Dehnung
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
        level:2,
        name: "Einfache Fehler",
        sentences: 3,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 0,  // i statt ie
            3: 0,   // Vergessene h-Dehnung
            4: 100,  // Einfacher statt Doppelkonsonant
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
        name: "IE",
        sentences: 2,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 100,  // i statt ie
            3: 0,  // Vergessene h-Dehnung
            4: 0,  // Einfacher statt Doppelkonsonant
            5: 0,  // d statt t am Wortende
            6: 0,  // t statt d am Wortende
            7: 0,  // das statt dass
            8: 0,  // dass statt das
            9: 0,  // wie statt als
            10: 0, // f statt v in ver- und vor-
            11: 0, // f statt pf
            12: 0, // e statt ä
            13: 0  // Unnötiges h nach Vokal
        }
    },
      {
        
        level: 8,
        name: "h",
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 0,  // i statt ie
            3: 100,  // Vergessene h-Dehnung
            4: 0,  // Einfacher statt Doppelkonsonant
            5: 0,  // d statt t am Wortende
            6: 0,  // t statt d am Wortende
            7: 0,  // das statt dass
            8: 0,  // dass statt das
            9: 0,  // wie statt als
            10: 0, // f statt v in ver- und vor-
            11: 0, // f statt pf
            12: 0, // e statt ä
            13: 0  // Unnötiges h nach Vokal
        }


    }

];