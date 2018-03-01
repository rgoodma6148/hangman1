// Constructors
let Letter = require("./letter.js");
let Word = require("./word.js");

// NPM Packages
const inquirer = require("inquirer");
const isLetter = require('is-letter');

// Set game defaults
const defaults = {
  words: ['apple', 'banana', 'blueberry', 'grape',
          'cherry', 'grapefruit', 'pear', 'lemon',
          'avocado', 'plum', 'peach', 'nectarine'
  ],
  score: 0,
  lives: 10
}

// Initialize variables
let wordBank = [],
    userGuesses = [],
    score = 0,
    lives = 0,
    currentWord = {},
    gameRun = true;

// Function to return a random integer between and including
// min and max arguments
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to randomly choose a new word from wordBank
function chooseWord() {
  // Create random number from 0 to wordBank index max
  let random = getRandInt(0, wordBank.length - 1);
  // Create currentWord object with random word from wordBank
  currentWord = new Word(wordBank[random]);

  // Create letter objects and add them to letters in word object
  currentWord.generateLetters();
  // Removes the currentWord from wordBank so that it cannot be
  // selected again in the same game
  wordBank.splice(random, 1);
}

// Function to reinitialize variables.
function resetVars() {
  wordBank = defaults.words;
  score = defaults.score;
  lives = defaults.lives;
  userGuesses = [];
}

// Function to begin game;
function startGame() {
  // Reset variables
  resetVars();
  // Get a random word
  chooseWord();
  // Show current guesses and remaining lives
  printGuesses();
  console.log("Lives left: " + lives + '\n');
  // Print the word
  currentWord.printWord();
  // Prompt user for input
  promptLetter();
}

// Function to display win status and ask if the user would like to play again
function endGame(status) {
  switch (status) {
    case 'lose':
      console.log("You lost all of your lives!\n");
      if (wordBank.length > 0) {
        playAgain();
      }
      break;
    case 'win':
      console.log("Congratulations, you guessed all the letters!\n");
      if (wordBank.length > 0) {
        playAgain();
      } else {
        // End game if no more words
        console.log("You've ran out of words to play with! Please come back and play again!");
        return 1;
      }
      break;
  }
}

// Function to prompt the user if they would like to play again
function playAgain() {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'again',
      message: 'Would you like to play again?',
      default: false
    }
  ]).then(function(response) {
    switch (response.again) {
      case true:
        if (lives <= 0) {
          gameRun = false;
          startGame();
        } else {
          userGuesses = [];
          lives = defaults.lives;

          // Get a random word
          chooseWord();
          // Show current guesses and remaining lives
          printGuesses();
          console.log("Lives left: " + lives + '\n');
          // Print the word
          currentWord.printWord();
          // Prompt user for input
          promptLetter();
        }
        break;
      case false:
        console.log('Thank you for playing, please play again sometime!\n');
        return 1;
        break;
    }
  });
}

function printGuesses() {
  let guesses = userGuesses.join(', ');
  console.log("Previous guesses:");
  console.log(guesses + '\n');
}

// Function that loops through all userGuesses and sees if
// returns whether or not that letter has been guessed.
function checkIfGuessed(guess) {
  let hasBeenGuessed = false;
  userGuesses.forEach(function(currentGuess, index) {
    if (currentGuess === guess) {
      hasBeenGuessed = true;
    }
  });
  return hasBeenGuessed;
}

// Function to prompt the user for a letter.
function promptLetter() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'letter',
      message: 'Please guess a letter:',
      // Validate using is-letter npm package and our own
      // function to see if the letter has been guessed.
      validate: function(letter) {
        if (isLetter(letter) && !checkIfGuessed(letter)) {
          return true;
        } else {
          return false;
        }
      }
    }
  ]).then(function(res) {
    // Add letter to userGuesses array
    userGuesses.push(res.letter.toLowerCase());

    // Checks if a match was found, logs according response
    if (currentWord.checkIfFound(res.letter.toLowerCase())) {
      console.log("Good guess, match found!\n");
      score++;
    } else {
      console.log("Guess again!\n");
      lives--;
    }

    // Show current guesses and remaining lives
    printGuesses();
    console.log("Lives left: " + lives + '\n');

    // Check lives and end game if user loses all lives
    if (lives <= 0) {
      // Re-add word back to wordBank since use didn't guess it
      wordBank.push(currentWord.word);

      gamerun = false;
      endGame('lose');
    } else {
      // Print the word
      currentWord.printWord();
      // Check win status
      gameRun = currentWord.checkWin();

      // Run prompt again if there are still letters to guess
      if (gameRun) {
        promptLetter();
      } else {
        endGame('win');
      }
    }

  });
}

// Begin the game
startGame();
