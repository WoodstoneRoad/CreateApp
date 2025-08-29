// Navigation and App Controller
class NavigationController {
    constructor() {
        this.currentPage = 'game';
        this.settings = this.loadSettings();
        this.highScores = this.loadHighScores();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupSettings();
        this.setupHighScores();
        this.applyTheme();
        this.showPage('game');
    }

    // Navigation Setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'game';
            this.showPage(page, false);
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    showPage(pageName, updateHistory = true) {
        // Show loading overlay
        this.showLoading();

        setTimeout(() => {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            const targetPage = document.getElementById(`${pageName}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`[data-page="${pageName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Update breadcrumb
            const breadcrumb = document.getElementById('currentPage');
            if (breadcrumb) {
                breadcrumb.textContent = this.getPageTitle(pageName);
            }

            // Update browser history
            if (updateHistory) {
                const url = pageName === 'game' ? '/' : `/${pageName}`;
                window.history.pushState({ page: pageName }, '', url);
            }

            this.currentPage = pageName;

            // Page-specific initialization
            if (pageName === 'scores') {
                this.displayHighScores();
            }

            // Hide loading overlay
            this.hideLoading();
        }, 300);
    }

    getPageTitle(pageName) {
        const titles = {
            'game': 'Game',
            'settings': 'Settings',
            'scores': 'High Scores',
            'instructions': 'How to Play',
            'about': 'About'
        };
        return titles[pageName] || 'Game';
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    // Settings Management
    setupSettings() {
        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });

        // Sound toggle
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = this.settings.soundEnabled;
            soundToggle.addEventListener('change', () => {
                this.settings.soundEnabled = soundToggle.checked;
                this.saveSettings();
            });
        }

        // Volume control
        const volumeSlider = document.getElementById('volume');
        const volumeValue = document.getElementById('volumeValue');
        if (volumeSlider && volumeValue) {
            volumeSlider.value = this.settings.volume;
            volumeValue.textContent = `${this.settings.volume}%`;
            
            volumeSlider.addEventListener('input', () => {
                this.settings.volume = parseInt(volumeSlider.value);
                volumeValue.textContent = `${this.settings.volume}%`;
                this.saveSettings();
            });
        }

        // Auto-flip toggle
        const autoFlipToggle = document.getElementById('autoFlip');
        if (autoFlipToggle) {
            autoFlipToggle.checked = this.settings.autoFlip;
            autoFlipToggle.addEventListener('change', () => {
                this.settings.autoFlip = autoFlipToggle.checked;
                this.saveSettings();
            });
        }

        // Show timer toggle
        const showTimerToggle = document.getElementById('showTimer');
        if (showTimerToggle) {
            showTimerToggle.checked = this.settings.showTimer;
            showTimerToggle.addEventListener('change', () => {
                this.settings.showTimer = showTimerToggle.checked;
                this.saveSettings();
                this.toggleTimer();
            });
        }

        // Reset buttons
        const resetScoresBtn = document.getElementById('resetScores');
        if (resetScoresBtn) {
            resetScoresBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all high scores?')) {
                    this.resetHighScores();
                }
            });
        }

        const resetAllBtn = document.getElementById('resetAll');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    this.resetAllData();
                }
            });
        }
    }

    setTheme(theme) {
        // Remove existing theme classes
        document.body.classList.remove('dark-theme', 'colorful-theme');
        
        // Add new theme class
        if (theme !== 'default') {
            document.body.classList.add(`${theme}-theme`);
        }

        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

        // Save theme preference
        this.settings.theme = theme;
        this.saveSettings();
    }

    applyTheme() {
        this.setTheme(this.settings.theme);
    }

    toggleTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.parentElement.style.display = this.settings.showTimer ? 'block' : 'none';
        }
    }

    // High Scores Management
    setupHighScores() {
        // Difficulty tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.getAttribute('data-difficulty');
                this.showScoresForDifficulty(difficulty);
                
                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(tab => {
                    tab.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    }

    displayHighScores() {
        const activeTab = document.querySelector('.tab-btn.active');
        const difficulty = activeTab ? activeTab.getAttribute('data-difficulty') : 'easy';
        this.showScoresForDifficulty(difficulty);
    }

    showScoresForDifficulty(difficulty) {
        const scoresList = document.getElementById('scoresList');
        const scores = this.highScores[difficulty] || [];

        if (scores.length === 0) {
            scoresList.innerHTML = '<div class="no-scores">No high scores yet. Play a game to set your first record!</div>';
            return;
        }

        const scoresHTML = scores.map((score, index) => `
            <div class="score-item">
                <div class="score-rank">#${index + 1}</div>
                <div class="score-details">
                    <div class="score-points">${score.score} points</div>
                    <div class="score-meta">
                        ${score.moves} moves • ${score.time} • ${new Date(score.date).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `).join('');

        scoresList.innerHTML = scoresHTML;
    }

    addHighScore(difficulty, score, moves, time) {
        if (!this.highScores[difficulty]) {
            this.highScores[difficulty] = [];
        }

        const newScore = {
            score,
            moves,
            time,
            date: Date.now()
        };

        this.highScores[difficulty].push(newScore);
        this.highScores[difficulty].sort((a, b) => b.score - a.score);
        this.highScores[difficulty] = this.highScores[difficulty].slice(0, 10); // Keep top 10

        this.saveHighScores();
        return this.isNewHighScore(difficulty, score);
    }

    isNewHighScore(difficulty, score) {
        const scores = this.highScores[difficulty] || [];
        return scores.length === 0 || score > Math.min(...scores.map(s => s.score)) || scores.length < 10;
    }

    resetHighScores() {
        this.highScores = {
            easy: [],
            medium: [],
            hard: [],
            expert: []
        };
        this.saveHighScores();
        this.displayHighScores();
    }

    resetAllData() {
        localStorage.removeItem('memoryGameSettings');
        localStorage.removeItem('memoryGameHighScores');
        location.reload();
    }

    // Local Storage Management
    loadSettings() {
        const defaultSettings = {
            theme: 'default',
            soundEnabled: true,
            volume: 50,
            autoFlip: true,
            showTimer: true
        };

        try {
            const saved = localStorage.getItem('memoryGameSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('memoryGameSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings to localStorage');
        }
    }

    loadHighScores() {
        const defaultScores = {
            easy: [],
            medium: [],
            hard: [],
            expert: []
        };

        try {
            const saved = localStorage.getItem('memoryGameHighScores');
            return saved ? JSON.parse(saved) : defaultScores;
        } catch (e) {
            return defaultScores;
        }
    }

    saveHighScores() {
        try {
            localStorage.setItem('memoryGameHighScores', JSON.stringify(this.highScores));
        } catch (e) {
            console.warn('Could not save high scores to localStorage');
        }
    }

    // Public API for game integration
    getSettings() {
        return this.settings;
    }

    addScore(difficulty, score, moves, time) {
        return this.addHighScore(difficulty, score, moves, time);
    }

    navigateToScores() {
        this.showPage('scores');
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
});