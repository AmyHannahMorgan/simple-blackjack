const playButton = document.querySelector('#playButton');
const rulesButton = document.querySelector('#rulesButton');
const rulesModal = document.querySelector('#rulesModal');

const startMenu = document.querySelector(".startMenu");

const startGame = new CustomEvent('gameStart', {});

playButton.addEventListener('click', _ => {
    startMenu.style.display = "none";
    window.dispatchEvent(startGame);
});

rulesButton.addEventListener('click', _ =>{
    rulesModal.classList.toggle('open');
});

window.addEventListener('click', event => {
    console.log(event.target);
    
    if(event.target === rulesModal) {
        rulesModal.classList.toggle('open');
    }
});

window.addEventListener('gameQuit', _ => {
    startMenu.style.display = '';
});