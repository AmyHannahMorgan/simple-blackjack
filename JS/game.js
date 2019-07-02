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

const dealer = new Player(gameScreen.querySelector('#dealerHand'), 
gameScreen.querySelector('#dealerScore'));
const player = new Player(gameScreen.querySelector('#playerHand'), 
gameScreen.querySelector('#playerScore'));

let started = false;
hitButton.addEventListener('click', _ => {
    if(started) {
        hit(deck, player, false);
    }
});
stand.addEventListener('click', _ => {
    if(started) {
        stand();
    }
});

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

}

function hit(deckObject, playerObject, flipped) {
    let card = deckObject.draw();
    let cardFront = fetchTexture(card);
    let back = textures.backs.root + textures['backs']['backs'][cardBack]
    let cardElem = spawnCard(card, flipped, cardFront, back);

    playerObject.appendCard(card, cardElem);
}

function stand() {

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
    textures.fronts[cardObj.suit]['cards'][cardObj.name];
}