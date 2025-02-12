let currentTextPosition = 0;
let currentLevel = 0;
let errorCount = 0;
let wrongClickCount = 0;
let hasShownCorrectClickMessage = false;
let hasShownSkippedWordMessage = false;


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


function showModal(message) {
    // Entferne existierende Modals
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Erstelle Modal-Elemente
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-box';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'modal-message';
    messageDiv.textContent = message;

    const button = document.createElement('button');
    button.className = 'modal-button';
    button.textContent = 'OK';
    button.onclick = () => overlay.remove();

    // Zusammenbauen
    modal.appendChild(messageDiv);
    modal.appendChild(button);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Automatisch schließen nach 3 Sekunden
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.remove();
        }
    }, 3000);
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

    if (hasUnhandledErrorsBefore && !hasShownSkippedWordMessage) {
        showModal("⚠️ Tipp: Bearbeite die Wörter der Reihe nach - es gibt noch Fehler vor diesem Wort!");
        hasShownSkippedWordMessage = true;
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
	
	createConfetti(wordElement, { 
        minCount: 3, 
        maxCount: 10, 
        duration: 0.5 
    });


        if (!hasShownCorrectClickMessage) {
            showModal("🎯 Super! Du hast einen Fehler gefunden!");
            hasShownCorrectClickMessage = true;
        }
    }

else {
        // Falscher Klick
        wordElement.className = 'word incorrect';
        errorCount++;
        if (wrongClickCount < 3) {
            const messages = [
                "😅 Ups! Dieses Wort war eigentlich richtig geschrieben!",
                "🤔 Nicht jedes Wort enthält einen Fehler!",
                "💡 Klicke nur auf Wörter, die falsch geschrieben sind!"
            ];
            showModal(messages[wrongClickCount]);
            wrongClickCount++;
        }
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
    } else {
        // Wort hatte einen Fehler - wurde übersehen
        wordElement.textContent = wordElement.dataset.correctWord;
        wordElement.className = 'word incorrect';
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
            showModal(getUncheckedErrorMessage(uncheckedErrors));
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
        
        button.textContent = '➡️ Weiter';
        button.className = 'word';
        
        button.parentNode.appendChild(feedbackText);
    } else {
        const currentSettings = getLevelSettings(currentLevel);
        currentTextPosition += currentSettings.sentences;
        currentLevel = Math.min(currentLevel + 1, 4);
        document.getElementById('current-level').textContent = currentLevel;
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

function newGame() {
    currentTextPosition = 0;
    currentLevel = 0;
    errorCount = 0;
    wrongClickCount = 0;
    hasShownCorrectClickMessage = false;
    hasShownSkippedWordMessage = false;
    showText();
    document.getElementById('current-level').textContent = currentLevel;
}

// Spiel beim Laden starten
document.addEventListener('DOMContentLoaded', function() {
    showText();
});

