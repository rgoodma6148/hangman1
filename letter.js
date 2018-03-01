// Letter constructor
var Letter = function(letter) {
  this.letter = letter;
  this.guessed = false;
};

// Function to display the letter if it has been guessed
// or an underscore if it has not
Letter.prototype.display = function() {
  if (this.guessed) {
    return ' ' + this.letter.toUpperCase() + ' ';
  } else {
    return ' _ ';
  }
};

// Export Letter constructor
module.exports = Letter;
