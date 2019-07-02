import {Deck} from './Modules/cards.js';

const testDeck = new Deck(1);
console.log(testDeck.cards);
testDeck.shuffle();
console.log(testDeck.cards);

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

const dealerHand = gameScreen.querySelector('#dealerHand');
const playerHand = gameScreen.querySelector('#playerHand');

const dealerScore = gameScreen.querySelector('#dealerScore');
const playerScore = gameScreen.querySelector('#playerScore');

window.addEventListener('gameStart', _ => {
    gameScreen.style.display = 'block'; 
    console.log('event fired');
});

function startGame() {

}