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
            1: "ace",
            11: "jack",
            12: "queen",
            13: "king"
        }
        let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        this.cards = [];
        this.drawn = [];
        for(let i = 0; i < deckCount; i++) {
            for(let s = 0; s < suits.length; s++) {
                for(let c = 1; c < 14; c++) {
                    let name;
                    if(Object.keys(cardDict).includes(c)) {
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

    }

    calculateScore() {

    }
}

function rng(min, max) {
    return Math.random() * (max - min) + min;
}

export {Card, Deck, Player};