/*
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
    correctCounter: {guesses: 0, total: 0},
    song: '',
    hangmans: [],
    dontRepeat: null,
    init: function(){
        var hangmanContainer = this.getContainer('hangman');
        this.song = './assets/sounds/';
        this.setWordBank();
        this.setHangmans(hangmanContainer.getElementsByTagName('pre'));
        this.guessesLeft = this.hangmans.length - 1;
        this.showGuessesLeft();
        this.displayCurrentHangman();
        this.setWord();
        this.setClues();
    },
    reset: function() {
        this.hideCurrentHangman();
        this.lettersGuessed = [];
        this.correctCounter = {guesses: 0, total: 0};
        this.init();
        window.addEventListener('keyup', receiveKeyInput);
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
        el.style.display = "inline-block";
    },
    hidePreviousHangman: function() {
        var elIndex = this.hangmans.length - this.guessesLeft - 2;
        var el = this.hangmans[elIndex];
        el.style.display = "none";
    },
    hideCurrentHangman: function() {
        var elIndex = this.hangmans.length - this.guessesLeft - 1;
        var el = this.hangmans[elIndex];
        el.style.display = "none";
    },
    setClues: function() {
        var container = this.getContainer('word');
        container.textContent = '';
        var word = this.getWord();
        for(var i = 0; i < word.length ; i++) {
            var regex = /^[a-zA-Z]$/;
            var span = document.createElement("span");
            if(word.charAt(i).search(regex) === -1){
                span.textContent = word.charAt(i);
            } else{
                span.textContent = '_';
                this.correctCounter.total++;
            }
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
        if(this.revealLetters(keyPressed)){
            if(this.correctCounter.guesses === this.correctCounter.total) {
                gameDialogs.hideDisplay(gameDialogs.modalDescriptions[0]);
                gameDialogs.showDisplay(gameDialogs.modalDescriptions[1]);
                gameDialogs.setModalAction(gameDialogs.modalActions[1]);
                gameDialogs.modalBox.show();
            }
        }else{
            this.setGuessesLeft();
            this.showGuessesLeft();
            this.hidePreviousHangman();
            this.displayCurrentHangman();
            if(this.getGuessesLeft() === 0) {
                gameDialogs.hideDisplay(gameDialogs.modalDescriptions[0]);
                gameDialogs.showDisplay(gameDialogs.modalDescriptions[1]);
                gameDialogs.setModalAction(gameDialogs.modalActions[1]);
                gameDialogs.modalBox.show();
            }
        }
    },
    revealLetters: function(letter) {
        var word = this.getWord().toLowerCase();
        var regex = new RegExp(letter, 'g');
        var notGuessed = this.getContainer('word').getElementsByTagName('span');
        var matches, found = false;
        while( (matches = regex.exec(word)) !== null){
            notGuessed[regex.lastIndex - 1].textContent =
                this.getWord().charAt(regex.lastIndex - 1) === letter ? letter : this.getWord().charAt(regex.lastIndex - 1);
            found = true;
            this.correctCounter.guesses++;
        }
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
        if(this.guessesLeft - 1 === 0) window.removeEventListener('keyup', receiveKeyInput);
        this.guessesLeft = this.guessesLeft - 1;
    },
    getGuessesLeft: function() {
        return this.guessesLeft;
    }
};
var gameDialogs = {
    modalBox: null,
    modalActions: ['Start Game', 'Play Again'],
    modalDescriptions: ['startscreen', 'exitscreen'],
    init: function(){
        var modalContainer = document.getElementById('gameModal');
        this.modalBox = new Modal(modalContainer, {
            backdrop: 'static',
            keyboard: false
        });
        this.setModalAction(this.modalActions[0]);
    },
    setModalAction: function(str){
        document.getElementById('gameModal').getElementsByTagName('button')[0].textContent = str;
    },
    respondToAction: function(action) {
        if(action === this.modalActions[0]) {
            this.modalBox.hide();
            hangmanGame.init();
        }
        if(action === this.modalActions[1]) {
            this.modalBox.hide();
            hangmanGame.reset();
        }
    },
    showDisplay: function(idName) {
        document.getElementById(idName).style.display = 'block';
    },
    hideDisplay: function(idName) {
        document.getElementById(idName).style.display = 'none';
    }
};

function receiveKeyInput(){
    hangmanGame.checkGuess(event.key);
}

window.onload = function(){
    gameDialogs.init();
    gameDialogs.modalBox.show();
    window.addEventListener('keyup', receiveKeyInput);
    gameDialogs.showDisplay(gameDialogs.modalDescriptions[0]);
    document.getElementById('gameAction').onclick = function(e) {
        var typeOfAction = e.target.textContent;
        gameDialogs.respondToAction(typeOfAction);
    };
};

