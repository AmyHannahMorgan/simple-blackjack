const tManifestURL = "JS/Data/texture-manifest.json";
let textures;

let manifestReq = new XMLHttpRequest();
manifestReq.open('GET', tManifestURL);
manifestReq.addEventListener('load', function() {
    textures = JSON.parse(this.responseText);
});
manifestReq.send();

const ggameScreen = document.querySelector('.gameScreen');

const dealerHand = ggameScreen.querySelector('#dealerHand');
const playerHand = ggameScreen.querySelector('#playerHand');

const dealerScore = ggameScreen.querySelector('#dealerScore');
const playerScore = ggameScreen.querySelector('#playerScore');

window.addEventListener('gameStart', _ => {
    console.log('event fired');
});