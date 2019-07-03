import {Deck, Player} from './Modules/cards.js';

const deck = new Deck(2);

const tManifestURL = "JS/Data/texture-manifest.json";
const cardBack = "default";
let textures;

let manifestReq = new XMLHttpRequest();
manifestReq.open('GET', tManifestURL);
manifestReq.addEventListener('load', function() {
    textures = JSON.parse(this.responseText);
});
manifestReq.send();

const gameScreen = document.querySelector('.gameScreen');
const hitButton = gameScreen.querySelector('#hitButton');
const standButton = gameScreen.querySelector('#standButton');

const endGameModal = document.querySelector('#endGameModal');
const endGameText = endGameModal.querySelector('#endGameMessage');
const restartButton = endGameModal.querySelector('#restartButton');
const quitButton = endGameModal.querySelector('#quitButton');

const dealerStandValue = 17;
const dealer = new Player(gameScreen.querySelector('#dealerHand'), 
gameScreen.querySelector('#dealerScore'));
const player = new Player(gameScreen.querySelector('#playerHand'), 
gameScreen.querySelector('#playerScore'));

let started = false;
let playerStood = false;
hitButton.addEventListener('click', _ => {
    if(started && !playerStood) {
        hit(deck, player, false);
        let playerScore = player.calculateScore(false);
        if(playerScore[1]) {
            end(4);
        }
    }
});
standButton.addEventListener('click', _ => {
    if(started && !playerStood) {
        stand();
    }
});
restartButton.addEventListener('click', _ => {
    reset();
});
quitButton.addEventListener('click', _ => {
    quit();
})

// const dealerHand = gameScreen.querySelector('#dealerHand');
// const playerHand = gameScreen.querySelector('#playerHand');

// const dealerScore = gameScreen.querySelector('#dealerScore');
// const playerScore = gameScreen.querySelector('#playerScore');

window.addEventListener('gameStart', _ => {
    gameScreen.style.display = 'block'; 
    console.log('event fired');
    startGame();
});

function startGame() {
    deck.shuffle();
    hit(deck, player, false)
    .then(_ => hit(deck, dealer, false))
    .then(_ => hit(deck, player, false))
    .then(_ => hit(deck, dealer, true))
    .then(() => {
        let playerScore = player.calculateScore(true);
        let dealerScore = dealer.calculateScore(true);
        if(playerScore[2]) {
            end(2);
        }
        else if(dealerScore[2]) {
            end(3);
        }
        started = true;
    });
    
    
}

function hit(deckObject, playerObject, flipped) {
    return new Promise((resolve, reject) => {
        let card = deckObject.draw();
        let cardFront = fetchTexture(card);
        let back = textures.backs.root + textures['backs']['backs'][cardBack]
        let cardElem = spawnCard(card, flipped, cardFront, back);

        playerObject.appendCard(card, cardElem);
        setTimeout(resolve, 500);
    });
}

function stand() {
    playerStood = true;
    dealer.hand[1].element.addEventListener('transitionend', function foo() {
        dealer.hand[1].element.removeEventListener('transitionend', foo);
        dealerAi();
    });
    dealer.hand[1].flip();
    dealer.calculateScore();
    
}

function dealerAi() {
    if(dealer.score >= dealerStandValue) {
        end(1);
        return;
    }

    hit(deck, dealer, false);
    let score = dealer.calculateScore(false);
    if(score[1]) {
        end(5);
        return;
    }
    else{
        setTimeout(dealerAi, 1000);
    }
}

function end(condition, data) {
    started = false;
    switch(condition) {
        case 1: // normal end, both players stand. check for draw
            console.log('all players stood');
            if(dealer.score === player.score) {
                console.log('draw');
                endGameText.innerHTML = 'Draw!';
                endGameModal.classList.toggle('open');
            }
            else{
                if(dealer.score > player.score) {
                    console.log('dealer wins');
                    endGameText.innerHTML = 'You Lose!';
                    endGameModal.classList.toggle('open');
                }
                else {
                    console.log('player wins');
                    endGameText.innerHTML = 'You Win!';
                    endGameModal.classList.toggle('open');
                }
            }
            break;
        case 2: // player blackjack, check for dealer blackjack
            console.log('player has blackjack');
            dealer.hand[1].flip();
            dealer.calculateScore();
            if(dealer.score === player.score) {
                console.log('draw');
                endGameText.innerHTML = 'Double Blackjack <br> Both you and the Dealer have blackjack';
                endGameModal.classList.toggle('open');
            }
            else{
                console.log('player wins');
                endGameText.innerHTML = 'Blackjack! <br> You Win!';
                endGameModal.classList.toggle('open');
            }
            break;
        case 3: // dealer blackjack
            console.log('dealer has blackjack');
            dealer.hand[1].flip();
            endGameText.innerHTML = 'Blackjack! <br> The Dealer has blackjack, you lose.';
            endGameModal.classList.toggle('open');
            break;
        case 4: // player bust
            console.log('player went bust');
            console.log('dealer wins');
            endGameText.innerHTML = 'You went bust!'
            endGameModal.classList.toggle('open');
            break;
        case 5: // dealer bust
            console.log('dealer went bust');
            console.log('player wins');
            endGameText.innerHTML = 'You win! <br> The Dealer went bust!'
            endGameModal.classList.toggle('open');
            break;
    }
}

function reset() {
    deck.reset();
    player.reset();
    dealer.reset();
    endGameModal.classList.toggle('open');
    playerStood = false;
    startGame();
}

function quit() {
    deck.reset();
    player.reset();
    dealer.reset();
    endGameModal.classList.toggle('open');
    playerStood = false;

    gameScreen.style.display = '';
    let quitEvent = new CustomEvent('gameQuit', {});
    window.dispatchEvent(quitEvent);
}

function spawnCard(cardObj, flipped, cardFrontSrc, cardBackSrc) {
    let cardElem = document.createElement('div');
    cardElem.classList.add('card');
    cardObj.link(cardElem);

    if(flipped) cardObj.flip();

    let cardInner = document.createElement('div');
    cardInner.classList.add('cardInner');
    cardElem.appendChild(cardInner);

    let cardFront = document.createElement('img');
    cardFront.classList.add('cardFront');
    cardFront.src = cardFrontSrc;
    cardInner.appendChild(cardFront);

    let cardBack = document.createElement('img');
    cardBack.classList.add('cardBack');
    cardBack.src = cardBackSrc;
    cardInner.appendChild(cardBack);

    return cardElem;
}

function fetchTexture(cardObj) {
    return textures.fronts.root +
    textures.fronts[cardObj.suit]['root'] +
    textures.fronts[cardObj.suit]['cards'][cardObj.name];
}