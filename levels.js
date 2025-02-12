const levelConfig = [
    {
        level: 0,
        name: "Klein vs. Gross",
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
        name: "Klein vs. Gross 2/5",
        sentences: 2
      
    },
    {
        level:2,
        name: "Klein vs. Gross 3/5",
        sentences: 3
       
    },

   
  {
        level: 3,
        name: "Klein vs. Gross 4/5",
        sentences: 4
    },
    {
        level: 4,
        name: "Klein vs. Gross 5/5",
        sentences: 5
    },


   {
        
        level: 5,
        name: "Konsonenten-Raub! ",
        sentences: 2,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 0,  // i statt ie
            3: 0,  // Vergessene h-Dehnung
            4: 100,  // Einfacher statt Doppelkonsonant
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
        
        level: 6,
        name: "Konsonenten-Raub! ",
        sentences: 3

  },
 {
        
        level: 7,
        name: "Konsonenten-Raub! ",
        sentences: 4
      
  },





    {
        level: 8,
        name: " Lang oder kurz? 'ie' und 'h'   ",
        sentences: 3,
        errorProbs: {
            1: 0,  // Klein statt Groß
            2: 50,  // i statt ie
            3: 50,  // Vergessene h-Dehnung
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
        level: 9,
        name: "Lang oder kurz? 'ie' und 'h' ",
        sentences: 4
    },

 {
        level: 10,
        name: "Lang oder kurz? 'ie' und 'h' ",
        sentences: 5
    }



   




];