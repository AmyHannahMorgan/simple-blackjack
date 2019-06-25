const playButton = document.querySelector('#playButton');
const rulesButton = document.querySelector('#rulesButton');
const rulesModal = document.querySelector('#rulesModal');

playButton.addEventListener('click', _ => {

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