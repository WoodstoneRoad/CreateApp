// Enhanced Card Memory Game with Navigation Integration
class CardGame {
    constructor() {
        // Card sets for different difficulties
        this.cardSets = {
            easy: ['🎮', '🎯', '🎲', '🎪'],
            medium: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'],
            hard: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎪', '🎨', '🎭', '🎸'],
            expert: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎪', '🎨', '🎭', '🎸', '🎺', '🎮', '🎯', '🎲']
        };

        // Game state
        this.difficulty = 'medium';
        this.cards = [];
        this.gameCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = null;
        this.gameTime = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.isGameActive = false;
        this.hintsUsed = 0;
        
        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.restartButton = document.getElementById('restart');
        this.pauseButton = document.getElementById('pause');
        this.hintButton = document.getElementById('hint');
        this.difficultySelect = document.getElementById('difficulty');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setDifficulty(this.difficulty);
        this.createBoard();
    }

    setupEventListeners() {
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => this.restart());
        }

        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => this.togglePause());
        }

        if (this.hintButton) {
            this.hintButton.addEventListener('click', () => this.showHint());
        }

        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', (e) => {
                this.setDifficulty(e.target.value);
                this.restart();
            });
        }
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.cards = this.cardSets[difficulty] || this.cardSets.medium;
        this.gameCards = [...this.cards, ...this.cards];
        
        // Update board layout
        if (this.gameBoard) {
            this.gameBoard.className = `game-board ${difficulty}`;
        }

        // Update difficulty selector
        if (this.difficultySelect) {
            this.difficultySelect.value = difficulty;
        }
    }

    shuffle() {
        for (let i = this.gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.gameCards[i], this.gameCards[j]] = [this.gameCards[j], this.gameCards[i]];
        }
    }
    
    createBoard() {
        if (!this.gameBoard) return;
        
        this.gameBoard.innerHTML = '';
        this.shuffle();
        
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
        if (!this.isGameActive && this.moves === 0) {
            this.startGame();
        }

        if (this.isPaused ||
            cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') || 
            this.flippedCards.length === 2) {
            return;
        }
        
        // Play sound effect
        this.playSound('flip');
        
        cardElement.classList.remove('hidden');
        cardElement.classList.add('flipped');
        cardElement.textContent = cardElement.dataset.value;
        this.flippedCards.push(cardElement);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            this.matchedPairs++;
            
            // Calculate score
            const matchScore = this.calculateMatchScore();
            this.score += matchScore;
            this.updateScore();
            
            // Play match sound
            this.playSound('match');
            
            // Check for game completion
            if (this.matchedPairs === this.cards.length) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            // No match
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.classList.add('hidden');
            card2.classList.add('hidden');
            card1.textContent = '';
            card2.textContent = '';
            
            // Play miss sound
            this.playSound('miss');
        }
        
        this.flippedCards = [];
    }

    calculateMatchScore() {
        let baseScore = 10;
        
        // Time bonus (faster = more points)
        const timeBonus = Math.max(0, 30 - this.gameTime);
        
        // Move penalty (fewer moves = more points)
        const movePenalty = Math.max(0, this.moves - this.cards.length);
        
        // Difficulty multiplier
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2,
            expert: 2.5
        }[this.difficulty] || 1;
        
        return Math.round((baseScore + timeBonus - movePenalty) * difficultyMultiplier);
    }

    startGame() {
        this.isGameActive = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.isGameActive) {
                this.gameTime = Math.floor((Date.now() - this.startTime) / 1000);
                this.updateTimer();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    togglePause() {
        if (!this.isGameActive) return;

        this.isPaused = !this.isPaused;
        
        if (this.pauseButton) {
            this.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
        }

        // Hide/show cards when paused
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (this.isPaused) {
                card.style.visibility = 'hidden';
            } else {
                card.style.visibility = 'visible';
            }
        });

        // Show pause overlay
        if (this.isPaused) {
            this.showPauseOverlay();
        } else {
            this.hidePauseOverlay();
        }
    }

    showHint() {
        if (!this.isGameActive || this.isPaused || this.hintsUsed >= 3) return;

        // Find two matching cards that aren't matched yet
        const hiddenCards = Array.from(document.querySelectorAll('.card.hidden'));
        const cardValues = {};
        
        hiddenCards.forEach(card => {
            const value = card.dataset.value;
            if (!cardValues[value]) {
                cardValues[value] = [];
            }
            cardValues[value].push(card);
        });

        // Find a pair
        for (const value in cardValues) {
            if (cardValues[value].length >= 2) {
                const [card1, card2] = cardValues[value].slice(0, 2);
                
                // Briefly show the cards
                card1.classList.remove('hidden');
                card1.classList.add('flipped');
                card1.textContent = card1.dataset.value;
                
                card2.classList.remove('hidden');
                card2.classList.add('flipped');
                card2.textContent = card2.dataset.value;

                setTimeout(() => {
                    card1.classList.add('hidden');
                    card1.classList.remove('flipped');
                    card1.textContent = '';
                    
                    card2.classList.add('hidden');
                    card2.classList.remove('flipped');
                    card2.textContent = '';
                }, 2000);

                this.hintsUsed++;
                this.score = Math.max(0, this.score - 5); // Penalty for using hint
                this.updateScore();
                
                // Update hint button
                if (this.hintButton) {
                    this.hintButton.textContent = `Hint (${3 - this.hintsUsed} left)`;
                    if (this.hintsUsed >= 3) {
                        this.hintButton.disabled = true;
                    }
                }
                
                break;
            }
        }
    }

    gameComplete() {
        this.isGameActive = false;
        this.stopTimer();
        
        // Calculate final score with time bonus
        const timeBonus = Math.max(0, 300 - this.gameTime); // 5 minute max bonus
        const finalScore = this.score + timeBonus;
        
        // Format time
        const timeString = this.formatTime(this.gameTime);
        
        // Play completion sound
        this.playSound('complete');
        
        // Check if it's a high score
        let isHighScore = false;
        if (window.navigationController) {
            isHighScore = window.navigationController.addScore(
                this.difficulty, 
                finalScore, 
                this.moves, 
                timeString
            );
        }
        
        // Show completion message
        const message = isHighScore 
            ? `🎉 New High Score!\nScore: ${finalScore}\nMoves: ${this.moves}\nTime: ${timeString}`
            : `🎉 You won!\nScore: ${finalScore}\nMoves: ${this.moves}\nTime: ${timeString}`;
            
        setTimeout(() => {
            alert(message);
            if (isHighScore && window.navigationController) {
                if (confirm('View high scores?')) {
                    window.navigationController.navigateToScores();
                }
            }
        }, 500);
    }

    showPauseOverlay() {
        let overlay = document.getElementById('pauseOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pauseOverlay';
            overlay.className = 'loading-overlay show';
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <h2>⏸️ Game Paused</h2>
                    <p>Click Resume to continue playing</p>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.classList.add('show');
        }
    }

    hidePauseOverlay() {
        const overlay = document.getElementById('pauseOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    playSound(type) {
        // Check if sound is enabled
        if (window.navigationController) {
            const settings = window.navigationController.getSettings();
            if (!settings.soundEnabled) return;
            
            // Create audio context for sound effects
            // This is a placeholder for actual sound implementation
            console.log(`Playing ${type} sound at volume ${settings.volume}%`);
        }
    }

    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
    }

    updateMoves() {
        if (this.movesElement) {
            this.movesElement.textContent = this.moves;
        }
    }

    updateTimer() {
        if (this.timerElement) {
            this.timerElement.textContent = this.formatTime(this.gameTime);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    restart() {
        // Reset game state
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameTime = 0;
        this.startTime = null;
        this.isPaused = false;
        this.isGameActive = false;
        this.hintsUsed = 0;
        
        // Stop timer
        this.stopTimer();
        
        // Reset UI
        this.updateScore();
        this.updateMoves();
        this.updateTimer();
        
        if (this.pauseButton) {
            this.pauseButton.textContent = 'Pause';
        }
        
        if (this.hintButton) {
            this.hintButton.textContent = 'Hint';
            this.hintButton.disabled = false;
        }
        
        // Hide pause overlay
        this.hidePauseOverlay();
        
        // Recreate board
        this.createBoard();
    }

    // Public API for navigation integration
    getDifficulty() {
        return this.difficulty;
    }

    getGameState() {
        return {
            difficulty: this.difficulty,
            score: this.score,
            moves: this.moves,
            time: this.gameTime,
            isActive: this.isGameActive,
            isPaused: this.isPaused
        };
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cardGame = new CardGame();
});