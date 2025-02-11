// game-ui.js
let currentTextPosition = 0;
let currentLevel = 0;
let errorCount = 0;

function showText() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    errorCount = 0;
    
    const correctText = getText(currentTextPosition, currentLevel + 1);
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
    if (wordElement.dataset.checked === 'true') return;
    
    const container = document.getElementById('game-container');
    const wordElements = Array.from(container.getElementsByClassName('word'));
    
    // Alle vorherigen Wörter bis zum aktuellen Index durchgehen
    for (let i = 0; i < wordElements.length; i++) {
        const currentElement = wordElements[i];
        
        // Stoppen wenn wir das aktuelle Wort erreichen
        if (currentElement === wordElement) break;
        
        // Nur ungeprüfte Wörter bearbeiten
        if (currentElement.dataset.checked === 'false') {
            autoCheckWord(currentElement);
        }
    }
    
    // Das angeklickte Wort prüfen
    checkWord(wordElement);
}

function checkWord(wordElement) {
    if (wordElement.dataset.checked === 'true' || 
        wordElement.className === 'punctuation' || 
        wordElement.textContent === '🏁 Fertig!') return;
    
    const wasModified = wordElement.dataset.wasModified === 'true';
    wordElement.dataset.checked = 'true';
    
    if (wasModified) {
        // Wenn ein modifiziertes (falsches) Wort angeklickt wird - das ist gut!
        wordElement.textContent = wordElement.dataset.correctWord;
        wordElement.className = 'word correct';
    } else {
        // Wenn ein korrektes Wort angeklickt wird - das ist ein Fehler!
        wordElement.className = 'word incorrect';
        errorCount++;
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
            // Entferne alte Fehlermeldung falls vorhanden
            const oldMessage = button.parentNode.querySelector('.error-message');
            if (oldMessage) oldMessage.remove();

            // Erstelle neue Fehlermeldung
            const message = getUncheckedErrorMessage(uncheckedErrors);
            const feedbackText = document.createElement('span');
            feedbackText.textContent = ' ' + message;
            feedbackText.style.marginLeft = '10px';
            feedbackText.className = 'error-message';
            feedbackText.style.color = '#e74c3c';
            
            button.parentNode.appendChild(feedbackText);
            return;
        }

      // Entferne alte Fehlermeldung falls vorhanden
        const oldMessage = button.parentNode.querySelector('.error-message');
        if (oldMessage) oldMessage.remove();

        // Wenn keine unbehandelten Fehler, prüfe alle verbleibenden Wörter
        wordElements.forEach(word => {
            if (word === button) return;
            if (word.dataset.checked === 'false') {
                autoCheckWord(word);
            }
        });

        const message = getFinishMessage(errorCount);
        const feedbackText = document.createElement('span');
        feedbackText.textContent = ' ' + message;
        feedbackText.style.marginLeft = '10px';
        
        button.textContent = '➡️ Weiter';
        button.className = 'word';
        
        button.parentNode.appendChild(feedbackText);
    } else {
	

      // Hole aktuelle Level-Settings für die Anzahl der Sätze
        const currentSettings = getLevelSettings(currentLevel);
        // Springe um die Anzahl der Sätze des aktuellen Levels weiter
        currentTextPosition += currentSettings.sentences;
        
        // Zum nächsten Level
      if (errorCount == 0) {
        	currentLevel = currentLevel + 1;
	}

        document.getElementById('current-level').textContent = currentLevel;
        showText();
    }

}
function autoCheckWord(wordElement) {
    if (wordElement.dataset.checked === 'true' || 
        wordElement.className === 'punctuation' || 
        wordElement.textContent === '🏁 Fertig!') return;
    
    const wasModified = wordElement.dataset.wasModified === 'true';
    wordElement.dataset.checked = 'true';
    
    if (!wasModified) {
        // Wort war fehlerfrei - gut!
        wordElement.className = 'word correct';
    } else {
        // Wort hatte einen Fehler - der wurde übersehen!
        wordElement.textContent = wordElement.dataset.correctWord;
        wordElement.className = 'word incorrect';
        errorCount++;
    }
}

function newGame() {
    currentTextPosition = 0;
    currentLevel = 0;
    errorCount = 0;
    showText();
    document.getElementById('current-level').textContent = currentLevel;
}

// Spiel beim Laden starten
document.addEventListener('DOMContentLoaded', function() {
    showText();
});