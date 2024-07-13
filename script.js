const hangmanElement = document.getElementById('hangman');
const wordToGuessElement = document.getElementById('word-to-guess');
const lettersElement = document.getElementById('letters');
const messageElement = document.getElementById('message');
const attemptsElement = document.getElementById('attempts');
const gameScoreElement = document.getElementById('game-score');
const resetBtn = document.getElementById('reset-btn');
const errorCountElement = document.getElementById('error-count');
const hintElement = document.getElementById('hint');

let chosenWord = "";
let chosenHint = "";
let guessedLetters = new Set();
let incorrectGuesses = 0;
let gameEnded = false;
let gamesWon = 0;
let gamesLost = 0;

const maxAttempts = 6;

// Initialize Hangman SVG
hangmanElement.innerHTML = `
    <line x1="10" y1="220" x2="50" y2="220" />
    <line x1="30" y1="30" x2="30" y2="220" />
    <line x1="30" y1="30" x2="120" y2="30" />
    <line x1="120" y1="30" x2="120" y2="60" class="rope" />
`;

// Function to reset the game
function resetGame() {
    guessedLetters.clear();
    incorrectGuesses = 0;
    gameEnded = false;
    const randomWordData = wordsData[Math.floor(Math.random() * wordsData.length)];
    chosenWord = randomWordData.word;
    chosenHint = randomWordData.hint;
    resetHangman();
    displayWordToGuess();
    displayAlphabetButtons();
    updateAttempts();
    updateGameScore();
    displayHint();
    messageElement.innerHTML = '';
    errorCountElement.textContent = 'Errors: 0';
}

// Function to reset Hangman SVG
function resetHangman() {
    hangmanElement.innerHTML = `
        <line x1="10" y1="220" x2="50" y2="220" />
        <line x1="30" y1="30" x2="30" y2="220" />
        <line x1="30" y1="30" x2="120" y2="30" />
        <line x1="120" y1="30" x2="120" y2="60" class="rope" />
    `;
}

// Function to display the word to guess
function displayWordToGuess() {
    wordToGuessElement.innerHTML = chosenWord
        .split('')
        .map(letter => `<span class="letter">${guessedLetters.has(letter) ? letter : '_'}</span>`)
        .join('');
}

// Function to display alphabet buttons
function displayAlphabetButtons() {
    const alphabet = 'qwertyuiopasdfghjklzxcvbnm'.split('');
    lettersElement.innerHTML = alphabet
        .map(letter =>
            `<button class="btn btn-outline-primary letter-btn" data-letter="${letter}" onclick="handleGuess('${letter}')" ${guessedLetters.has(letter) ? 'disabled' : ''}>
                ${letter}
            </button>`
        )
        .join('');
}

// Function to handle letter guess
function handleGuess(letter) {
    if (!gameEnded && !guessedLetters.has(letter)) {
        guessedLetters.add(letter);
        if (!chosenWord.includes(letter)) {
            incorrectGuesses++;
            drawHangman();
        }
        displayWordToGuess();
        checkGameEnd();
        updateAttempts();
        updateErrorCount();
        animateKeyPress(letter);
        console.log(`Pressed key: ${letter.toUpperCase()}`);
    }
}

// Function to animate key press
function animateKeyPress(letter) {
    const button = document.querySelector(`.letter-btn[data-letter="${letter}"]`);
    if (button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 300);
    }
}

// Function to draw Hangman SVG based on incorrect guesses
function drawHangman() {
    const svg = hangmanElement;
    const parts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    if (incorrectGuesses <= parts.length) {
        const drawFunction = {
            head: drawHead,
            body: drawBody,
            leftArm: drawLeftArm,
            rightArm: drawRightArm,
            leftLeg: drawLeftLeg,
            rightLeg: drawRightLeg
        }[parts[incorrectGuesses - 1]];
        drawFunction(svg);
    }
}

// SVG drawing functions for Hangman parts
function drawHead(svg) {
    const head = createSVGElement('circle', {
        cx: '120',
        cy: '90',
        r: '30',
        class: 'head'
    });
    svg.appendChild(head);
}

function drawBody(svg) {
    const body = createSVGElement('line', {
        x1: '120',
        y1: '120',
        x2: '120',
        y2: '170',
        class: 'body'
    });
    svg.appendChild(body);
}

function drawLeftArm(svg) {
    const leftArm = createSVGElement('line', {
        x1: '120',
        y1: '140',
        x2: '90',
        y2: '120',
        class: 'arm'
    });
    svg.appendChild(leftArm);
}

function drawRightArm(svg) {
    const rightArm = createSVGElement('line', {
        x1: '120',
        y1: '140',
        x2: '150',
        y2: '120',
        class: 'arm'
    });
    svg.appendChild(rightArm);
}

function drawLeftLeg(svg) {
    const leftLeg = createSVGElement('line', {
        x1: '120',
        y1: '170',
        x2: '90',
        y2: '210',
        class: 'leg'
    });
    svg.appendChild(leftLeg);
}

function drawRightLeg(svg) {
    const rightLeg = createSVGElement('line', {
        x1: '120',
        y1: '170',
        x2: '150',
        y2: '210',
        class: 'leg'
    });
    svg.appendChild(rightLeg);
}

// Helper function to create SVG elements
function createSVGElement(tag, attributes) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attributes).forEach(key => svgElement.setAttribute(key, attributes[key]));
    return svgElement;
}

// Function to check if the game has ended
function checkGameEnd() {
    if (incorrectGuesses >= maxAttempts) {
        endGame(false);
    } else if ([...chosenWord].every(letter => guessedLetters.has(letter))) {
        endGame(true);
    }
}

// Function to handle game ending
function endGame(won) {
    gameEnded = true;
    if (won) {
        gamesWon++;
        messageElement.innerHTML = `<div class="alert alert-success">Congratulations! You've guessed the word "${chosenWord}".</div>`;
    } else {
        gamesLost++;
        messageElement.innerHTML = `<div class="alert alert-danger">Game Over! The word was "${chosenWord}".</div>`;
    }
    updateGameScore();
}

// Function to update the number of attempts remaining
function updateAttempts() {
    attemptsElement.textContent = `Attempts Remaining: ${maxAttempts - incorrectGuesses}`;
}

// Function to update the error count
function updateErrorCount() {
    errorCountElement.textContent = `Errors: ${incorrectGuesses}`;
}

// Function to update the game score
function updateGameScore() {
    gameScoreElement.textContent = `Score - Wins: ${gamesWon}, Losses: ${gamesLost}`;
}

// Function to display hint
function displayHint() {
    hintElement.textContent = `Hint: ${chosenHint}`;
}

// Event listener for reset button
resetBtn.addEventListener('click', resetGame);

// Event listener for keyboard input
document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (key.match(/^[a-z]$/) && !gameEnded) {
        handleGuess(key);
    }
});

// Initial game setup
resetGame();