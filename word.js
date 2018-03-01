// Require Letter, so we can use the constructor
let Letter = require("./letter.js");

// Word constructor
var Word = function(word) {
  this.word = word;
  this.letters = [];
  this.correctGuesses = 0;
  this.totalLetters = this.word.length;
};

// Function to print the word
Word.prototype.printWord = function() {
  // We want to use *this* current object within another function, so
  // we set it to a variable to access it inside the other function
  let that = this;
  let word = this.word.split('');
  let output = '';
  word.forEach(function(letter, index) {
    output += that.letters[index].display();
  });
  console.log(output + '\n');
};

// Function to check if a match was found in the word
// with the user's guess
Word.prototype.checkIfFound = function(guess) {
  let that = this;
  let correct = false;
  this.letters.forEach(function(currentLetter) {
    if (currentLetter.letter === guess) {
      currentLetter.guessed = true;
      that.correctGuesses++;
      correct = true;
    }
  });
  return correct;
};

// Function to check if all letters have been guessed
Word.prototype.checkWin = function() {
  if (this.correctGuesses == this.totalLetters) {
    return false;
  } else  {
    return true;
  }
}

// Function to create letter objects and push them to letters
// array in word object
Word.prototype.generateLetters = function() {
  let that = this;
  let word = this.word.split('');
  // Creates an object for each letter and adds it to the
  // currentWord.letters array
  word.forEach(function(letter, index) {
    let thisLetter = new Letter(letter);
    that.letters.push(thisLetter);
  });
}

// Export word constructor
module.exports = Word;
