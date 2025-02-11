// game-messages.js

function getText(position, numberOfSentences) {
    let sentences = storyText.slice(position, position + numberOfSentences);
    return sentences.join(" ");
}

function getFinishMessage(errors) {
    const messages = [
        "🌟 Wahnsinn! Du bist ein Rechtschreib-Ninja! Keine Fehler!",
        "🎯 Fast perfekt! Nur " + errors + " Fehler übersehen. Deine Brille ist wohl auf Urlaub?",
        "😅 " + errors + " Fehler... Na ja, Rome wasn't built in a day!",
        "🤔 " + errors + " Fehler? Vielleicht solltest du weniger Netflix und mehr Bücher...",
        "🦥 Oje, " + errors + " Fehler! Heute einen faulen Tag erwischt?",
        "🎮 " + errors + " Fehler... Zu viel Minecraft gespielt?"
    ];
    
    if (errors === 0) return messages[0];
    if (errors <= 2) return messages[1];
    if (errors <= 4) return messages[2];
    if (errors <= 6) return messages[3];
    if (errors <= 8) return messages[4];
    return messages[5];
}

function getUncheckedErrorMessage(count) {
    const messages = [
        "🤔 Da ist noch was... Ein Fehler wartet auf dich!",
        "👀 Noch " + count + " Fehler verstecken sich im Text!",
        "💪 Los geht's! Da sind noch " + count + " Fehler zu finden.",
        "🎯 Mach dich an die Arbeit! " + count + " Fehler warten auf dich.",
        "🦉 Sei aufmerksamer! " + count + " Fehler hast du übersehen.",
        "📚 Du musst genauer lesen! " + count + " Fehler sind noch unentdeckt."
    ];
    
    if (count === 1) return messages[0];
    if (count <= 2) return messages[1];
    if (count <= 3) return messages[2];
    if (count <= 4) return messages[3];
    if (count <= 5) return messages[4];
    return messages[5];
}