class Card {
    constructor(suit, number, name, flipped) {
        this.suit = suit;
        this.number = number;
        this.name = name;
        this.flipped = flipped;
        this.element = null;
    }
    
    link(element) {
        this.element = element;
    }

    flip() {
        if(this.element !== null) {
            if(this.flipped) {
                this.flipped = false;
                this.element.classList.remove('flip');
            }
            else {
                this.flipped = true;
                this.element.classList.add('flip');
            }
        }
        else throw "there is no element to flip";
    }

    get details() {
        let details = {
            "suit": this.suit,
            "name": this.name
        }

        return details;
    }
}

class Deck {
    constructor(deckCount) {
        let cardDict = {
            "1": "ace",
            "11": "jack",
            "12": "queen",
            "13": "king"
        }
        let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        this.cards = [];
        this.drawn = [];
        for(let i = 0; i < deckCount; i++) {
            for(let s = 0; s < suits.length; s++) {
                for(let c = 1; c < 14; c++) {
                    let name;
                    if(Object.keys(cardDict).includes(`${c}`)) {
                        name = cardDict[c];
                    }
                    else {
                        name = `${c}`;
                    }
                    let card = new Card(suits[s], c, name, false);
                    this.cards.push(card);
                }
            }
        }
    }

    shuffle() {
        let shuffled = [];
        for(let i = 0; this.cards.length > 0; i++) {
            let index = rng(0, this.cards.length);
            shuffled.push(this.cards.splice(index, 1)[0]);
        }
        this.cards = shuffled;
        return this.cards;
    }

    draw() {
        let card = this.cards.shift();
        this.drawn.push(card);
        return card;
    }

    reset() {
        this.cards.concat(this.drawn);
        this.drawn = [];
    }
}

class Player {
    constructor(handElement, scoreElement) {
        this.hand = [];
        this.handElement = handElement;

        this.score = 0;
        this.scoreElement = scoreElement;
    }

    appendCard(cardObject, cardElement) {
        this.hand.push(cardObject);
        this.handElement.appendChild(cardElement);
    }

    calculateScore(start) {
        let hiddenScore = 0;
        let workingScore = 0;
        let scoreDict = {
            'jack': 10,
            'queen':10,
            'king': 10
        };
        let aces = [];
        for(let i = 0; i < this.hand.length; i++) {
            if(this.hand[i].number === 1) {
                aces.push(this.hand[i]);
            }
            else if(Object.keys(scoreDict).includes(this.hand[i].name)) {
                if(this.hand[i].flipped) {
                    hiddenScore += scoreDict[this.hand[i].name];
                }
                else {
                    workingScore += scoreDict[this.hand[i].name];
                }
            }
            else {
                if(this.hand[i].flipped) {
                    hiddenScore += this.hand[i].number;
                }
                else {
                    workingScore += this.hand[i].number;
                }
            }
        }

        if(aces.length > 0) {
            if((workingScore + hiddenScore) + 11 > 21) {
                for(let i = 0; i < aces.length; i++) {
                    if(aces[i].flipped) hiddenScore += 1;
                    else workingScore += 1;
                    
                }
            }
            else {
                for(let i = 0; i < aces.length; i++) {
                    if(aces[i].flipped) {
                        if(i === 0) hiddenScore += 11;
                        else hiddenScore += 1;
                    }
                    else {
                        if(i === 0) workingScore += 11;
                        else workingScore += 1;
                    }
                }
            }
        }
        
        let bust = false;
        let blackjack = false;
        if(workingScore + hiddenScore > 21) {
            bust = true
        }
        else if(start && workingScore + hiddenScore === 21){
            blackjack = true;
        }

        this.score = workingScore + hiddenScore; 
        this.scoreElement.innerHTML = `${workingScore}`;
        if(bust){
            this.scoreElement.classList.add('bust');
            this.scoreElement.innerHTML += ' BUST!';
        }

        return [this.score, bust, blackjack];
    }

    reset() {
        this.score = 0;

        this.scoreElement.innerHTML = '';
        this.scoreElement.classList.remove('bust');

        this.hand = [];

        console.log(this.handElement.firstChild);
        while(this.handElement.firstChild) {
            this.handElement.removeChild(this.handElement.firstChild);
        }
    }
}

function rng(min, max) {
    return Math.random() * (max - min) + min;
}

export {Card, Deck, Player};