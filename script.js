class CardGame {
    constructor() {
        this.cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
        this.gameCards = [...this.cards, ...this.cards];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.restartButton = document.getElementById('restart');
        
        this.init();
    }
    
    init() {
        this.shuffle();
        this.createBoard();
        this.restartButton.addEventListener('click', () => this.restart());
    }
    
    shuffle() {
        for (let i = this.gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.gameCards[i], this.gameCards[j]] = [this.gameCards[j], this.gameCards[i]];
        }
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        this.gameCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card hidden';
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(cardElement) {
        if (cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') || 
            this.flippedCards.length === 2) {
            return;
        }
        
        cardElement.classList.remove('hidden');
        cardElement.classList.add('flipped');
        cardElement.textContent = cardElement.dataset.value;
        this.flippedCards.push(cardElement);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.matchedPairs++;
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            if (this.matchedPairs === this.cards.length) {
                setTimeout(() => alert(`🎉 You won! Score: ${this.score}, Moves: ${this.moves}`), 500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.add('hidden');
            card2.classList.add('hidden');
            card1.textContent = '';
            card2.textContent = '';
        }
        
        this.flippedCards = [];
    }
    
    restart() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.movesElement.textContent = '0';
        this.shuffle();
        this.createBoard();
    }
}

new CardGame();
