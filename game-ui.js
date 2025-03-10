let currentTextPosition = 0;
let currentLevel = 0;
let errorCount = 0;
let wrongClickCount = 0;
let hasShownCorrectClickMessage = false;
let hasShownSkippedWordMessage = false;
let currentGameId = 'scifi';

//
// Tooltip-Funktionen importieren oder einbinden
// Normalerweise würde man hier importieren, aber für direktes Einbinden:
// import { showTooltip, hideTooltip } from './tooltip-utils.js';

function getRandomColor() {
    const colors = [
        '#ff4136', // red
        '#ffdc00', // yellow
        '#2ecc40', // green
        '#0074d9', // blue
        '#b10dc9', // purple
        '#ff851b', // orange
        '#7fdbff', // light blue
        '#f012be', // pink
        '#39cccc', // teal
        '#01ff70'  // lime
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Update display to show the level code
function updateLevelDisplay() {
    document.getElementById('current-level').textContent = currentLevel;
    
    // Aktualisiere auch den Spielnamen im Titel
    document.getElementById('game-title').textContent = getCurrentGame().name || "Klick dich schlau!";
    
    const levelSettings = getLevelSettings(currentLevel);
    const codeElement = document.getElementById('level-code');
    
    if (levelSettings) {
        // Ensure code exists
        if (!levelSettings.secret) {
            const gamePrefix = currentGameId.substring(0, 2).toUpperCase();
            const levelNum = String(currentLevel).padStart(2, '0');
            const randomChars = generateRandomChars(2);
            levelSettings.secret = `${gamePrefix}-${levelNum}-${randomChars}`;
        }
        
        // Display the code
        codeElement.textContent = levelSettings.secret;
        codeElement.style.display = 'inline';
        
        // Add tooltip functionality to make it clear the code can be used later
        codeElement.title = "Merke dir diesen Code, um später hier weiterzumachen!";
        codeElement.style.cursor = "help";
        codeElement.style.position = "relative";
        
        // Add click-to-copy functionality
        codeElement.onclick = function() {
            // Copy code to clipboard
            navigator.clipboard.writeText(levelSettings.secret).then(function() {
                showTooltip(codeElement, "Code kopiert! ✓", "success", { 
                    duration: 1500,
                    closeOthers: true
                });
            }).catch(function() {
                // Fallback for browsers without clipboard API
                showTooltip(codeElement, "Dein Code: " + levelSettings.secret, "info", { 
                    duration: 2000,
                    closeOthers: true
                });
            });
        };
    } else {
        codeElement.style.display = 'none';
    }
}

function createConfetti(element, { 
    minCount = 5,      // Minimale Anzahl
    maxCount = 10,     // Maximale Anzahl
    duration = 0.5     // Dauer in Sekunden
} = {}) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);

    // Zufällige Anzahl zwischen min und max
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Zufällige Bewegung
        const angle = Math.random() * Math.PI; // Winkel für die Bewegung (nur nach oben: 0 bis π)
        const distance = 30 + Math.random() * 90; // Zufällige Distanz zwischen 30 und 120 Pixeln
        const endX = Math.cos(angle) * distance;
        const endY = -Math.sin(angle) * distance; // Negativ für Bewegung nach oben
        
        // Zufällige Rotation zwischen 180 und 720 Grad
        const rotation = (180 + Math.random() * 540) + 'deg';
        
        // Zufällige Verzögerung
        const delay = Math.random() * 0.1; // 0 bis 0.1 Sekunden

        // Stil setzen
        confetti.style.left = `${centerX}px`;
        confetti.style.top = `${centerY}px`;
        confetti.style.background = getRandomColor();
        confetti.style.setProperty('--end-x', `${endX}px`);
        confetti.style.setProperty('--end-y', `${endY}px`);
        confetti.style.setProperty('--rotation', rotation);
        confetti.style.animation = `confetti-fall ${duration}s ease-out ${delay}s forwards`;

        document.body.appendChild(confetti);

        // Aufräumen nach Animation
        confetti.addEventListener('animationend', () => confetti.remove());
    }
}

function showText() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    errorCount = 0;
    
    // Hole die korrekten Level-Settings für die Satzanzahl
    const levelSettings = getLevelSettings(currentLevel);
    const numberOfSentences = levelSettings.sentences;
    
    const correctText = getText(currentTextPosition, numberOfSentences);
    const incorrectText = addErrors(correctText, currentLevel);
    
    const incorrectWords = generateWordList(incorrectText);
    const correctWords = generateWordList(correctText);
    
    incorrectWords.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        
        if (!/^[.!?,\s]+$/.test(word)) {
            span.className = 'word';
            span.dataset.checked = 'false';
            span.dataset.correctWord = correctWords[index];
            span.dataset.wasModified = (word !== correctWords[index]).toString();
            
            span.onclick = function() {
                handleWordClick(this);
            };
        } else {
            span.className = 'punctuation';
        }
        
        container.appendChild(span);
    });

    addFinishButton(container);
}

function handleWordClick(wordElement) {
    console.log('handleWordClick called');

    if (wordElement.dataset.checked === 'true') return;
    
    const container = document.getElementById('game-container');
    const wordElements = Array.from(container.getElementsByClassName('word'));
    const currentIndex = wordElements.indexOf(wordElement);
    
    // Prüfe ob es unbehandelte fehlerhafte Wörter vor dem aktuellen Wort gibt
    const hasUnhandledErrorsBefore = wordElements.some((word, index) => {
        return index < currentIndex && 
               word.dataset.checked === 'false' && 
               word.dataset.wasModified === 'true';
    });

    if (hasUnhandledErrorsBefore) {
        // Statt Modal: Zeige Tooltip mit Warnung
        showTooltip(
            wordElement,
            "⚠️ Tipp: Bearbeite die Wörter der Reihe nach - es gibt noch Fehler vor diesem Wort!",
            'info',
            { duration: 3000 }
        );
        hasShownSkippedWordMessage = true;
        return;
    }
    
    // Auto-check vorherige Wörter
    for (let i = 0; i < wordElements.length; i++) {
        const currentElement = wordElements[i];
        if (currentElement === wordElement) break;
        if (currentElement.dataset.checked === 'false') {
            autoCheckWord(currentElement);
        }
    }
    
    // Prüfe angeklicktes Wort
    const wasModified = wordElement.dataset.wasModified === 'true';
    wordElement.dataset.checked = 'true';
    console.log('111');
    
    if (wasModified) {
        // Korrekter Klick
        wordElement.textContent = wordElement.dataset.correctWord;
        console.log('korrekt!');
        wordElement.className = 'word correct';
        
        // Zeige Tooltip nur beim ersten gefundenen Fehler
        if (!hasShownCorrectClickMessage) {
            showTooltip(
                wordElement, 
                "🎯 Super! Du hast einen Fehler gefunden!", 
                'success'
            );
            hasShownCorrectClickMessage = true;
        }
        
        createConfetti(wordElement, { 
            minCount: 3, 
            maxCount: 10, 
            duration: 0.5 
        });
    } else {
        // Falscher Klick
        wordElement.className = 'word incorrect';
        errorCount++;
        
        // Statt Modal: Zeige Tooltip mit Fehlermeldung
        const messages = [
            "😅 Ups! Dieses Wort war eigentlich richtig geschrieben!",
            "🤔 Nicht jedes Wort enthält einen Fehler!",
            "💡 Klicke nur auf Wörter, die falsch geschrieben sind!"
        ];
        
        showTooltip(
            wordElement,
            messages[Math.min(wrongClickCount, messages.length - 1)],
            'error'
        );
        
        wrongClickCount++;
    }
}

function autoCheckWord(wordElement) {
    if (wordElement.dataset.checked === 'true' || 
        wordElement.className === 'punctuation' || 
        wordElement.textContent === '🏁 Fertig!') return;
    
    const wasModified = wordElement.dataset.wasModified === 'true';
    wordElement.dataset.checked = 'true';
    
    if (!wasModified) {
        // Wort war korrekt
        wordElement.className = 'word correct';
        
        // Optional: Tooltip für auto-check
        showTooltip(wordElement, "✓ Richtig!", 'success', { 
            duration: 1000, 
            closeOthers: false 
        });
    } else {
        // Wort hatte einen Fehler - wurde übersehen
        wordElement.textContent = wordElement.dataset.correctWord;
        wordElement.className = 'word incorrect';
        
        // Optional: Tooltip für übersehenen Fehler
        showTooltip(wordElement, "❌ Hier war ein Fehler!", 'error', { 
            duration: 1000, 
            closeOthers: false 
        });
        
        errorCount++;
    }
}

function handleFinishClick(button, container) {
    if (button.textContent === '🏁 Fertig!') {
        const wordElements = Array.from(container.getElementsByClassName('word'));
        
        // Zähle unbehandelte fehlerhafte Wörter
        const uncheckedErrors = wordElements.filter(word => {
            return word !== button && 
                   word.dataset.checked === 'false' && 
                   word.dataset.wasModified === 'true';
        }).length;

        if (uncheckedErrors > 0) {
            // Statt Modal: Tooltip am Fertig-Button
            showTooltip(button, getUncheckedErrorMessage(uncheckedErrors), 'info', {
                duration: 3000
            });
            return;
        }

        // Wenn keine unbehandelten Fehler, prüfe alle verbleibenden Wörter
        wordElements.forEach(word => {
            if (word === button) return;
            if (word.dataset.checked === 'false') {
                autoCheckWord(word);
            }
        });

        const message = getFinishMessage(errorCount);
        if (errorCount == 0) {
            createConfetti(button, { 
                minCount: 120, 
                maxCount: 230, 
                duration: 0.8 
            });
        }
        if (errorCount == 1) {
            createConfetti(button, { 
                minCount: 60, 
                maxCount: 80, 
                duration: 0.8 
            });
        }

        const feedbackText = document.createElement('span');
        feedbackText.textContent = ' ' + message;
        feedbackText.style.marginLeft = '10px';
        
        button.textContent = '➡️ Nächster Versuch!';
        if (errorCount <=1) {
            x = currentLevel + 1;
            button.textContent = '➡️ Weiter zu Level ' + x + '!!';
        }
        button.className = 'word';
        
        button.parentNode.appendChild(feedbackText);
    } else {
        const currentSettings = getLevelSettings(currentLevel);
        currentTextPosition += currentSettings.sentences;
        if (errorCount <=1) {
            currentLevel = currentLevel + 1;
            updateLevelDisplay();
        }
        button.textContent = '🏁 Fertig!';
        showText();
    }
}

function addFinishButton(container) {
    const feedbackContainer = document.createElement('div');
    feedbackContainer.style.marginTop = '20px';
    
    const finishButton = document.createElement('span');
    finishButton.textContent = '🏁 Fertig!';
    finishButton.className = 'word';
    finishButton.style.cursor = 'pointer';
    finishButton.onclick = function() {
        handleFinishClick(this, container);
    };
    
    feedbackContainer.appendChild(finishButton);
    container.appendChild(feedbackContainer);
}

function getCurrentGame() {
    return games[currentGameId];
}

function getText(position, numberOfSentences) {
    let sentences = getCurrentGame().story.slice(position, position + numberOfSentences);
    return sentences.join(" ");
}

function getLevelSettings(level) {
    let levelSettings = getCurrentGame().levels.find(config => config.level === level);
    if (!levelSettings) {
        // Fallback auf höchstes Level wenn Level nicht gefunden
        levelSettings = getCurrentGame().levels.find(config => 
            config.level === Math.max(...getCurrentGame().levels.map(c => c.level))
        );
    }
    return levelSettings;
}

// Zeigt einen Dialog zur Spielauswahl an
// Update the game selection dialog to include code entry option
function showGameSelectionDialog() {
    // Erstelle einen Modal-Dialog
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalBox = document.createElement('div');
    modalBox.className = 'modal-box';
    
    // Titel hinzufügen
    const title = document.createElement('h2');
    title.textContent = 'Wähle eine Lektion';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    title.style.color = '#2c3e50';
    
    modalBox.appendChild(title);
    
    // Liste der verfügbaren Spiele
    const gameList = document.createElement('div');
    gameList.style.display = 'flex';
    gameList.style.flexDirection = 'column';
    gameList.style.gap = '10px';
    
    // Für jedes Spiel einen Button erstellen
    Object.entries(games).forEach(([gameId, gameData]) => {
        const gameButton = document.createElement('button');
        gameButton.textContent = gameData.name;
        gameButton.className = 'game-select-button';
        
        // Klick-Handler
        gameButton.onclick = function() {
            // Spiel auswählen und starten
            currentGameId = gameId;
            startNewGame();
            
            // Dialog schließen
            document.body.removeChild(modalOverlay);
        };
        
        gameList.appendChild(gameButton);
    });
    
    modalBox.appendChild(gameList);
    
    // Trennlinie
    const divider = document.createElement('div');
    divider.style.margin = '20px 0';
    divider.style.borderBottom = '1px solid #ddd';
    modalBox.appendChild(divider);
    
    // "Code eingeben" Option
    const codeButton = document.createElement('button');
    codeButton.textContent = '🔑 Code eingeben';
    codeButton.className = 'code-entry-button';
    codeButton.onclick = function() {
        // Dialog schließen
        document.body.removeChild(modalOverlay);
        
        // Code-Eingabe Dialog anzeigen
        showCodeEntryDialog();
    };
    
    modalBox.appendChild(codeButton);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
    
    // Click außerhalb des Dialogs schließt ihn
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

function startNewGame() {
    currentTextPosition = 0;
    currentLevel = 0;
    errorCount = 0;
    wrongClickCount = 0;
    hasShownCorrectClickMessage = false;
    hasShownSkippedWordMessage = false;
    
    showText();
    updateLevelDisplay();
}

function newGame() {
    // Statt direkt ein neues Spiel zu starten, zeigen wir den Auswahlbildschirm
    showGameSelectionDialog();
}

// Event-Listener für Spiel-Auswahl
document.addEventListener('DOMContentLoaded', function() {
    // Wir entfernen den Change-Event-Listener, da die Auswahl jetzt über den Dialog erfolgt
    ensureAllLevelsHaveCodes();
    // Erstes Spiel starten
    showText();
    updateLevelDisplay();
});

// === Add these functions to game-ui.js ===

// Generate a unique code for each level if one doesn't exist
function ensureAllLevelsHaveCodes() {
    // Iterate through all games
    Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        
        // Ensure each level has a secret code
        game.levels.forEach((level, index) => {
            if (!level.secret) {
                // Create a unique code if not present
                // Format: [game prefix]-[level]-[random chars]
                const gamePrefix = gameId.substring(0, 2).toUpperCase();
                const levelNum = String(level.level).padStart(2, '0');
                const randomChars = generateRandomChars(2);
                level.secret = `${gamePrefix}-${levelNum}-${randomChars}`;
            }
        });
    });
}

// Generate random characters for codes
function generateRandomChars(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded similar looking characters
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Fixed function to calculate the correct text position based on level
function calculateTextPosition(gameId, levelNum) {
    const game = games[gameId];
    let position = 0;
    
    // Sum up sentences from all previous levels
    for (let i = 0; i < levelNum; i++) {
        // Find the specific level config for this level number
        const prevLevel = game.levels.find(level => level.level === i);
        if (prevLevel && prevLevel.sentences) {
            position += prevLevel.sentences;
        }
    }
    
    return position;
}

// Updated function to start game from code
function startGameFromCode(code) {
    const { gameId, level } = findLevelByCode(code);
    
    if (gameId && level !== null) {
        // Set the current game
        currentGameId = gameId;
        
        // Calculate the text position
        currentTextPosition = calculateTextPosition(gameId, level);
        
        // Set the current level
        currentLevel = level;
        
        // Reset error counters
        errorCount = 0;
        wrongClickCount = 0;
        hasShownCorrectClickMessage = false;
        hasShownSkippedWordMessage = false;
        
        // Debug output
        console.log(`Starting game: ${gameId}, Level: ${level}, Text Position: ${currentTextPosition}`);
        
        // Update the game
        showText();
        updateLevelDisplay();
        
        return true;
    }
    
    return false; // Code not found
}

// Improved function to find level by code - with better logging
function findLevelByCode(code) {
    let foundGame = null;
    let foundLevel = null;
    
    // Normalize the code (uppercase, remove spaces)
    const normalizedCode = code.toUpperCase().replace(/\s/g, '');
    console.log(`Looking for code: ${normalizedCode}`);
    
    // Search through all games and levels
    Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        
        game.levels.forEach(level => {
            if (level.secret && level.secret.toUpperCase() === normalizedCode) {
                foundGame = gameId;
                foundLevel = level.level;
                console.log(`Found match! Game: ${gameId}, Level: ${level.level}`);
            }
        });
    });
    
    if (!foundGame) {
        console.log("No matching code found");
    }
    
    return { gameId: foundGame, level: foundLevel };
}

// Show a dialog to enter a code
function showCodeEntryDialog() {
    // Create a modal dialog
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalBox = document.createElement('div');
    modalBox.className = 'modal-box code-entry-box';
    
    // Title
    const title = document.createElement('h2');
    title.textContent = 'Code eingeben';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    title.style.color = '#2c3e50';
    
    // Input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'XX-00-YY';
    inputField.className = 'code-input';
    inputField.style.width = '100%';
    inputField.style.padding = '12px';
    inputField.style.fontSize = '18px';
    inputField.style.textAlign = 'center';
    inputField.style.marginBottom = '20px';
    inputField.style.borderRadius = '5px';
    inputField.style.border = '2px solid #3498db';
    
    // Error message (hidden by default)
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Ungültiger Code. Bitte versuche es erneut.';
    errorMessage.className = 'error-message';
    errorMessage.style.color = '#e74c3c';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.display = 'none';
    errorMessage.style.marginBottom = '15px';
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Los geht\'s!';
    submitButton.className = 'modal-button';
    submitButton.style.width = '100%';
    submitButton.style.padding = '12px';
    submitButton.style.fontSize = '16px';
    submitButton.style.backgroundColor = '#4CAF50';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Abbrechen';
    cancelButton.className = 'modal-button cancel-button';
    cancelButton.style.width = '100%';
    cancelButton.style.padding = '12px';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.backgroundColor = '#7f8c8d';
    cancelButton.style.marginTop = '10px';
    
    // Add elements to modal
    modalBox.appendChild(title);
    modalBox.appendChild(inputField);
    modalBox.appendChild(errorMessage);
    modalBox.appendChild(submitButton);
    modalBox.appendChild(cancelButton);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
    
    // Focus the input field
    setTimeout(() => inputField.focus(), 100);
    
    // Handle submit
    submitButton.addEventListener('click', function() {
        const code = inputField.value.trim();
        if (code) {
            const success = startGameFromCode(code);
            if (success) {
                // Close the dialog
                document.body.removeChild(modalOverlay);
            } else {
                // Show error message
                errorMessage.style.display = 'block';
                inputField.style.borderColor = '#e74c3c';
            }
        }
    });
    
    // Handle cancel
    cancelButton.addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
    });
    
    // Handle enter key
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
    
    // Reset error state on input
    inputField.addEventListener('input', function() {
        errorMessage.style.display = 'none';
        inputField.style.borderColor = '#3498db';
    });
    
    // Click outside to cancel
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}