// main.js
let currentTextPosition = 0;
let currentLevel = 0;
let errorCount = 0;

function getText(position, numberOfSentences) {
    let sentences = storyText.slice(position, position + numberOfSentences);
    return sentences.join(" ");
}

function generateWordList(text) {
    return text.split(/([.!?,]\s+|\s+|[.!?,])/g)
              .filter(token => token.length > 0);
}