class CardGame {
    constructor() {
        this.cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
        this.gameCards = [...this.cards, ...this.cards];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.difficulty = 'easy';
        
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.restartButton = document.getElementById('restart');
        this.difficultyButton = document.getElementById('difficulty');
        this.difficultyText = document.getElementById('difficultyText');
        this.hintButton = document.getElementById('hint');
        this.themeToggle = document.getElementById('themeToggle');
        this.soundToggle = document.getElementById('soundToggle');
        this.scoreProgress = document.getElementById('scoreProgress');
        this.movesProgress = document.getElementById('movesProgress');
        this.timeProgress = document.getElementById('timeProgress');
        this.winModal = document.getElementById('winModal');
        this.finalStats = document.getElementById('finalStats');
        this.playAgainButton = document.getElementById('playAgain');
        
        this.init();
    }
    
    init() {
        this.shuffle();
        this.createBoard();
        this.restartButton.addEventListener('click', () => this.restart());
        this.difficultyButton.addEventListener('click', () => this.changeDifficulty());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.playAgainButton.addEventListener('click', () => this.closeModalAndRestart());
    }
    
    changeDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        this.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
        
        const difficultyNames = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        this.difficultyText.textContent = difficultyNames[this.difficulty];
        
        // Adjust cards based on difficulty
        if (this.difficulty === 'medium') {
            this.cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎵', '🎬'];
            this.gameBoard.className = 'grid grid-cols-4 gap-4 max-w-lg mx-auto p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl';
        } else if (this.difficulty === 'hard') {
            this.cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎵', '🎬', '🎭', '🎪'];
            this.gameBoard.className = 'grid grid-cols-6 gap-3 max-w-2xl mx-auto p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl';
        } else {
            this.cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
            this.gameBoard.className = 'grid grid-cols-4 gap-4 max-w-lg mx-auto p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl';
        }
        
        this.restart();
    }
    
    shuffle() {
        this.gameCards = [...this.cards, ...this.cards];
        for (let i = this.gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.gameCards[i], this.gameCards[j]] = [this.gameCards[j], this.gameCards[i]];
        }
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        this.gameCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-xl border-2 border-white/20 backdrop-blur-sm animate-bounce-in';
            cardElement.style.animationDelay = `${index * 0.1}s`;
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(cardElement) {
        if (cardElement.classList.contains('bg-gradient-to-br') && 
            !cardElement.classList.contains('from-white') ||
            this.flippedCards.length === 2) {
            return;
        }
        
        if (!this.startTime) {
            this.startTimer();
        }
        
        cardElement.classList.remove('from-white', 'to-gray-100');
        cardElement.classList.add('from-teal-400', 'to-cyan-500', 'text-white', 'animate-flip');
        cardElement.textContent = cardElement.dataset.value;
        this.flippedCards.push(cardElement);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            this.updateProgress();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.remove('from-teal-400', 'to-cyan-500');
            card2.classList.remove('from-teal-400', 'to-cyan-500');
            card1.classList.add('from-emerald-500', 'to-green-600', 'cursor-default', 'animate-pulse');
            card2.classList.add('from-emerald-500', 'to-green-600', 'cursor-default', 'animate-pulse');
            this.matchedPairs++;
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.updateProgress();
            
            if (this.matchedPairs === this.cards.length) {
                this.stopTimer();
                setTimeout(() => this.showWinModal(), 500);
            }
        } else {
            card1.classList.add('animate-shake');
            card2.classList.add('animate-shake');
            setTimeout(() => {
                card1.classList.remove('from-teal-400', 'to-cyan-500', 'text-white', 'animate-flip', 'animate-shake');
                card2.classList.remove('from-teal-400', 'to-cyan-500', 'text-white', 'animate-flip', 'animate-shake');
                card1.classList.add('from-white', 'to-gray-100');
                card2.classList.add('from-white', 'to-gray-100');
                card1.textContent = '';
                card2.textContent = '';
            }, 500);
        }
        
        this.flippedCards = [];
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            this.updateProgress();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    showWinModal() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.finalStats.innerHTML = `
            <div class="bg-white/10 rounded-xl p-4 mb-4">
                <div class="text-emerald-400 text-2xl font-bold">${this.score} Points</div>
                <div class="text-blue-400">${this.moves} Moves</div>
                <div class="text-orange-400">${timeString}</div>
                <div class="text-purple-400 capitalize">${this.difficulty} Mode</div>
            </div>
        `;
        
        this.winModal.classList.remove('hidden');
    }
    
    closeModalAndRestart() {
        this.winModal.classList.add('hidden');
        this.restart();
    }
    
    showHint() {
        const hiddenCards = Array.from(this.gameBoard.children).filter(card => 
            card.classList.contains('from-white'));
        if (hiddenCards.length > 0) {
            const randomCard = hiddenCards[Math.floor(Math.random() * hiddenCards.length)];
            randomCard.classList.add('animate-pulse', 'ring-4', 'ring-yellow-400');
            setTimeout(() => {
                randomCard.classList.remove('animate-pulse', 'ring-4', 'ring-yellow-400');
            }, 2000);
        }
    }
    
    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        this.themeToggle.innerHTML = `<span class="text-2xl">${isDark ? '☀️' : '🌙'}</span>`;
    }
    
    toggleSound() {
        // Sound toggle functionality placeholder
        const isMuted = this.soundToggle.classList.toggle('opacity-50');
        this.soundToggle.innerHTML = `<span class="text-2xl">${isMuted ? '🔇' : '🔊'}</span>`;
    }
    
    updateProgress() {
        const maxScore = this.cards.length * 10;
        const maxMoves = this.cards.length * 2;
        const maxTime = 300; // 5 minutes
        
        const scorePercent = Math.min((this.score / maxScore) * 100, 100);
        const movesPercent = Math.min((this.moves / maxMoves) * 100, 100);
        const timePercent = this.startTime ? Math.min(((Date.now() - this.startTime) / 1000 / maxTime) * 100, 100) : 0;
        
        this.scoreProgress.style.width = `${scorePercent}%`;
        this.movesProgress.style.width = `${movesPercent}%`;
        this.timeProgress.style.width = `${timePercent}%`;
    }
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.stopTimer();
        this.scoreElement.textContent = '0';
        this.movesElement.textContent = '0';
        this.timerElement.textContent = '0:00';
        this.shuffle();
        this.createBoard();
    }
}

new CardGame();
