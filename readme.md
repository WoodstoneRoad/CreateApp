# 🃏 Card Memory Game

A modern, feature-rich card matching game with comprehensive navigation and multiple game modes. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### 🎮 Game Features
- **Multiple Difficulty Levels**: Easy (4x2), Medium (4x4), Hard (6x4), Expert (8x4)
- **Advanced Scoring System**: Time bonuses, move penalties, difficulty multipliers
- **Timer & Move Counter**: Track your performance in real-time
- **Pause/Resume**: Take breaks without losing progress
- **Hint System**: Get help when stuck (limited to 3 hints per game)
- **Sound Effects**: Audio feedback for flips, matches, and completion

### 🧭 Navigation Features
- **Multi-Page Interface**: Game, Settings, High Scores, Instructions, About
- **Responsive Navigation**: Desktop menu and mobile hamburger menu
- **Breadcrumb Navigation**: Always know where you are
- **Smooth Page Transitions**: Loading animations and fade effects
- **Browser History Support**: Back/forward buttons work correctly

### ⚙️ Customization
- **Theme Options**: Default, Dark, and Colorful themes
- **Sound Controls**: Toggle sound effects and adjust volume
- **Game Options**: Auto-flip cards, show/hide timer
- **Data Management**: Reset high scores or all data

### 🏆 High Scores
- **Persistent Storage**: Scores saved locally across sessions
- **Difficulty-Based Leaderboards**: Separate rankings for each difficulty
- **Top 10 Tracking**: Keep the best scores for each difficulty
- **Detailed Statistics**: Score, moves, time, and date for each entry

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Adaptive Layout**: Cards and UI scale appropriately
- **Cross-Browser**: Works on modern browsers

## 🎯 How to Play

1. **Choose Difficulty**: Select from Easy to Expert modes
2. **Start Playing**: Click any card to begin the timer
3. **Match Pairs**: Find matching cards by remembering their positions
4. **Use Strategy**: 
   - Start from corners and work inward
   - Use hints sparingly for better scores
   - Complete quickly for time bonuses
5. **Track Progress**: Monitor your score, moves, and time
6. **Set Records**: Compete for high scores in each difficulty

## 🚀 Quick Start

```bash
# Clone or download the repository
# Navigate to the project directory

# Start local server (choose one):
npm start
# or
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` in your browser.

## 🎚️ Difficulty Levels

| Level  | Grid Size | Cards | Pairs | Multiplier |
|--------|-----------|-------|-------|------------|
| Easy   | 4×2       | 8     | 4     | 1.0x       |
| Medium | 4×4       | 16    | 8     | 1.5x       |
| Hard   | 6×4       | 24    | 12    | 2.0x       |
| Expert | 8×4       | 32    | 16    | 2.5x       |

## 🏆 Scoring System

- **Base Score**: 10 points per match
- **Time Bonus**: Up to 30 points for quick matches
- **Move Penalty**: Penalty for excessive moves
- **Difficulty Multiplier**: Higher difficulties give more points
- **Hint Penalty**: -5 points per hint used
- **Completion Bonus**: Up to 300 points for fast completion

## 🛠️ Tech Stack

- **HTML5**: Semantic markup and accessibility
- **CSS3**: 
  - CSS Grid & Flexbox for layouts
  - CSS Variables for theming
  - Animations and transitions
  - Media queries for responsiveness
- **JavaScript ES6+**:
  - Classes and modules
  - Local Storage API
  - Event handling
  - DOM manipulation

## 📁 Project Structure

```
📦 card-memory-game/
 ┣ 📜 index.html          # Main HTML structure with navigation
 ┣ 📜 style.css           # Comprehensive styling and themes
 ┣ 📜 script.js           # Enhanced game logic and features
 ┣ 📜 main.js             # Navigation controller and settings
 ┣ 📜 package.json        # Project configuration
 ┗ 📜 README.md           # This file
```

## 🎨 Themes

### Default Theme
- Gradient background (blue to purple)
- Clean, modern interface
- High contrast for accessibility

### Dark Theme
- Dark backgrounds with light text
- Reduced eye strain for night play
- Sleek, professional appearance

### Colorful Theme
- Vibrant colors and gradients
- Playful, energetic design
- Enhanced visual appeal

## 💾 Data Storage

The game uses browser Local Storage to persist:
- **Settings**: Theme, sound preferences, game options
- **High Scores**: Top 10 scores for each difficulty level
- **User Preferences**: Volume, timer visibility, auto-flip settings

## 🔧 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+

## 🎮 Controls

### Desktop
- **Mouse**: Click to flip cards
- **Keyboard**: Tab navigation, Enter to activate

### Mobile
- **Touch**: Tap to flip cards
- **Gestures**: Swipe navigation in menus

## 🚀 Performance

- **Lightweight**: No external dependencies
- **Fast Loading**: Optimized assets and code
- **Smooth Animations**: Hardware-accelerated CSS
- **Memory Efficient**: Proper cleanup and garbage collection

## 🔒 Privacy

- **No Tracking**: No analytics or external requests
- **Local Storage Only**: All data stays on your device
- **No Cookies**: Uses Local Storage instead
- **Offline Ready**: Works without internet connection

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices. Feel free to:
- Fork and modify for your own use
- Report issues or suggest improvements
- Use as a learning resource for web development

## 📄 License

MIT License - feel free to use this code for personal or commercial projects.

---

**Enjoy playing! 🎉**