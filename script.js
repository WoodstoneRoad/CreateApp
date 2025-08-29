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
            cardElement.className = 'w-20 h-20 bg-white rounded-xl flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg';
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(cardElement) {
        if (cardElement.classList.contains('bg-teal-400') || 
            cardElement.classList.contains('bg-teal-600') || 
            this.flippedCards.length === 2) {
            return;
        }
        
        cardElement.classList.remove('bg-white');
        cardElement.classList.add('bg-teal-400', 'text-white');
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
            card1.classList.remove('bg-teal-400');
            card2.classList.remove('bg-teal-400');
            card1.classList.add('bg-teal-600', 'cursor-default');
            card2.classList.add('bg-teal-600', 'cursor-default');
            this.matchedPairs++;
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            if (this.matchedPairs === this.cards.length) {
                setTimeout(() => alert(`🎉 You won! Score: ${this.score}, Moves: ${this.moves}`), 500);
            }
        } else {
            card1.classList.remove('bg-teal-400', 'text-white');
            card2.classList.remove('bg-teal-400', 'text-white');
            card1.classList.add('bg-white');
            card2.classList.add('bg-white');
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
