
/*onDOMContentLoaded = (function(){ console.log("DOM ready!") })()

onload = (function(){ console.log("Page fully loaded!") })()

onloadeddata = (function(){ console.log("Data loaded!") })()*

Instructions, don't make an 80's game, make something "you envision"
    - How about theme songs from retro games?
    - If a user already guessed a letter, do not count it
    - Show a picture of the guess once it is the correct guess
*/

var hangmanGame = {
    wordBank: [],
    lettersGuessed: [],
    gameWord: '',
    guessesLeft: 0,
    song: './assets/sounds/',
    hangmans: [],
    dontRepeat: null,
    init: function(){
        var hangmanContainer = this.getContainer('hangman');
        this.setWordBank();
        this.setHangmans(hangmanContainer.getElementsByTagName('pre'));
        this.guessesLeft = this.hangmans.length - 1;
        this.showGuessesLeft();
        this.displayCurrentHangman();
        this.setWord();
        this.setClues();
    },
    getContainer: function(divId){
        return document.getElementById(divId);
    },
    setHangmans: function(children){
        this.hangmans = children;
    },
    setWordBank: function() {
        this.wordBank[0] = "Lemmings";
        this.wordBank[1] = "Tetris";
        this.wordBank[2] = "Super Mario Bros";
        this.wordBank[3] = "Sonic The Hedgehog";
        this.wordBank[4] = "Rayman";
        this.wordBank[5] = "Donkey Kong";
        this.wordBank[6] = "Maniac Mansion";
        this.wordBank[7] = "Street Fighter";
        this.wordBank[8] = "Mega Man";
        this.wordBank[9] = "Duck Hunt";
        this.wordBank[10] = "Mike Tyson Punch Out Punch-Out!!";
    },
    setWord: function() {
        var wordCount = this.wordBank.length;
        var selectedIndex = Math.floor(Math.random() * wordCount);
        if(this.dontRepeat !== null) {
            while(selectedIndex === this.dontRepeat)
            {
                selectedIndex = Math.floor(Math.random() * wordCount);
            }
        }
        this.dontRepeat = selectedIndex;
        this.gameWord = this.wordBank[selectedIndex];
    },
    getWord: function() {
        return this.gameWord;
    },
    getSound: function() {

    },
    setSound: function() {

    },
    displayCurrentHangman: function() {
        var elIndex = this.hangmans.length - this.guessesLeft - 1;
        var el = this.hangmans[elIndex];
        el.style.display = "block";
    },
    hidePreviousHangman: function() {
        var elIndex = this.hangmans.length - this.guessesLeft - 2;
        var el = this.hangmans[elIndex];
        el.style.display = "none";
    },
    setClues: function() {
        var container = this.getContainer('word');
        var word = this.getWord();
        for(var i = 0; i < word.length ; i++) {
            //console.log(word.charAt(i));
            var regex = /^[a-zA-Z]$/;
            var span = document.createElement("span");
            span.textContent = word.charAt(i).search(regex) === -1  ? word.charAt(i) : '_';
            container.appendChild(span);
        }
    },
    checkGuess: function(keyPressed) {
        keyPressed = keyPressed.toLowerCase();
        var regex = /^[a-z]$/;
        if(keyPressed.search(regex) === -1 || this.lettersGuessed.indexOf(keyPressed) !== -1)
            return;
        this.lettersGuessed.push(keyPressed.toLowerCase());
        this.showLettersGuessed();
        if(!this.revealLetters(keyPressed)){
            this.setGuessesLeft();
            this.showGuessesLeft();
            this.hidePreviousHangman();
            this.displayCurrentHangman();
            if(this.getGuessesLeft() === 0)
                window.removeEventListener('keyup', receiveKeyInput);
        }
    },
    revealLetters: function(letter) {
        var word = this.getWord().toLowerCase();
        var regex = new RegExp(letter, 'g');
        var notGuessed = this.getContainer('word').getElementsByTagName('span');
        var matches, found = false;
        while( (matches = regex.exec(word)) !== null){
            var msg = 'Found ' + matches[0] + '. ';
            msg += 'Next match starts at ' + regex.lastIndex;
            notGuessed[regex.lastIndex - 1].textContent =
                this.getWord().charAt(regex.lastIndex - 1) === letter ? letter : this.getWord().charAt(regex.lastIndex - 1);
            console.log(msg);
            found = true;
        }
        console.log(found);
        return found;
    },

    showLettersGuessed: function(){
        var container = this.getContainer('guesses').getElementsByTagName('p');
        container = container[0].getElementsByTagName('span');
        container[0].textContent = this.lettersGuessed.join(", ");
    },
    showGuessesLeft: function() {
        var container = this.getContainer('guesses').getElementsByTagName('p');
        container = container[1].getElementsByTagName('span');
        container[0].textContent = this.getGuessesLeft();
    },
    setGuessesLeft: function() {
        this.guessesLeft = this.guessesLeft - 1;
    },
    getGuessesLeft: function() {
        return this.guessesLeft;
    }
};

var gameModal = {

};

function receiveKeyInput(){
        hangmanGame.checkGuess(event.key);
}
window.onload = function(){
    hangmanGame.init();
    window.addEventListener('keyup', receiveKeyInput);
};

