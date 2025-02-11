// Fehlertypen generieren und anwenden
function generateWordList(text) {
    return text.split(/([.!?,]\s+|\s+|[.!?,])/g)
              .filter(token => token.length > 0);
}

function addMistake(word, errorType) {
    // Satzzeichen und Leerzeichen nicht bearbeiten
    if (/^[.!?,\s]+$/.test(word)) {
        return word;
    }

    switch(errorType) {
        case 1: // Klein statt Groß
            if (/[A-ZÄÖÜ]/.test(word)) {
                return word.toLowerCase();
            }
            break;
        case 2: // i statt ie
            if (word.includes('ie')) {
                return word.replace(/ie/g, 'i');
            }
            break;
        case 3: // Vergessene h-Dehnung
            return word.replace(/([aeiouäöü])h([^aeiouäöü])/gi, '$1$2');
        case 4: // Einfacher statt Doppelkonsonant
            return word.replace(/([bcdfgklmnprstz])\1/g, '$1');
        case 5: // d statt t am Wortende
            return word.replace(/([A-Za-zäöüß])t\b/g, '$1d');
        case 6: // t statt d am Wortende
            return word.replace(/([A-Za-zäöüß])d\b/g, '$1t');
        case 7: // das statt dass
            if (word === 'dass') {
                return 'das';
            }
            break;
        case 8: // dass statt das
            if (word === 'das') {
                return 'dass';
            }
            break;
        case 9: // wie statt als
            if (word === 'als') {
                return 'wie';
            }
            break;
        case 10: // f statt v in ver- und vor-
            return word.replace(/\b(ver|vor)/gi, match => 
                match.replace(/v/i, 'f'));
        case 11: // f statt pf
            return word.replace(/([KkPp])f/g, 'f');
        case 12: // e statt ä
            return word.replace(/ä/g, 'e').replace(/Ä/g, 'E');
        case 13: // Unnötiges h nach Vokal - nur einmal pro Wort
            if (!/h/.test(word)) {  // Nur wenn noch kein h im Wort ist
                const match = word.match(/([aeiouäöü])(?!h)([bcdfgklmnpqrstvwxz])/i);
                if (match) {
                    const index = match.index + 1;
                    return word.slice(0, index) + 'h' + word.slice(index);
                }
            }
    }
    return word;
}

// Bereite die Level-Konfigurationen vor, indem fehlende Werte vom Vorgänger geerbt werden
function initializeLevelConfig() {
    let previousLevel = null;
    
    // Sortiere Level nach Nummer um sicherzustellen, dass wir in der richtigen Reihenfolge vererben
    const sortedLevels = [...levelConfig].sort((a, b) => a.level - b.level);
    
    return sortedLevels.map(level => {
        const currentLevel = { ...level };
        
        if (previousLevel) {
            // Übernehme fehlende Basis-Eigenschaften vom Vorgänger
            currentLevel.sentences = currentLevel.sentences || previousLevel.sentences;
            currentLevel.name = currentLevel.name || previousLevel.name;
            
            // Übernehme und merge die errorProbs
            currentLevel.errorProbs = {
                ...previousLevel.errorProbs,
                ...(currentLevel.errorProbs || {})
            };
        }
        
        previousLevel = currentLevel;
        return currentLevel;
    });
}

// Initialisiere die erweiterte Level-Konfiguration
const extendedLevelConfig = initializeLevelConfig();

function getLevelSettings(level = 0) {
    // Finde die Level-Einstellungen oder verwende das aktuelle Level
    let levelSettings = extendedLevelConfig.find(config => config.level === level);
    if (!levelSettings) {
        // Wenn kein passendes Level gefunden, nimm das letzte bekannte Level
        levelSettings = extendedLevelConfig.find(config => 
            config.level === Math.max(...extendedLevelConfig.map(c => c.level))
        );
    }
    return levelSettings;
}



function addErrors(text, level = 0) {
    const words = generateWordList(text);
    const levelSettings = getLevelSettings(level);



    const processedWords = words.map(word => {
        // Satzzeichen und Leerzeichen nicht bearbeiten
        if (/^[.!?,\s]+$/.test(word)) {
            return word;
        }

        let processedWord = word;
        // Für jede mögliche Fehlerart prüfen
        Object.entries(levelSettings.errorProbs).forEach(([errorType, probability]) => {
            // Nur einen Fehler pro Wort
            if (processedWord === word && Math.random() * 100 < probability) {
                const newWord = addMistake(word, parseInt(errorType));
                if (newWord !== word) {
                    processedWord = newWord;
                }
            }
        });

        return processedWord;
    });

    return processedWords.join('');
}