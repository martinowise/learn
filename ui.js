// Flag für den ersten Start
let firstVisit = true;

// Beim Laden der Seite prüfen wir, ob dies der erste Besuch ist
document.addEventListener('DOMContentLoaded', function() {
    // Wenn localStorage verfügbar ist, können wir den Besuch speichern
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("gameFirstVisitShown")) {
            // Kein erster Besuch mehr
            firstVisit = false;
            hideStarterInstructions();
        } else {
            // Ersten Besuch markieren
            localStorage.setItem("gameFirstVisitShown", "true");
        }
    } else {
        // Falls localStorage nicht unterstützt wird, Anleitung trotzdem anzeigen
    }
});

function toggleInstructions() {
    const instructionsModal = document.getElementById('instructions-modal');
    if (instructionsModal.style.display === 'none' || instructionsModal.style.display === '') {
        instructionsModal.style.display = 'flex';
    } else {
        instructionsModal.style.display = 'none';
    }
}

function hideStarterInstructions() {
    const starterInstructions = document.getElementById('starter-instructions');
    if (starterInstructions) {
        starterInstructions.style.display = 'none';
    }
}