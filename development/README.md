# Pomodoro Timer Chrome Extension

A minimalist, lightweight Pomodoro timer Chrome extension based on the design from Figma.

## Features

- **Clean, minimalist design**: Based on the original Figma design with light/dark/auto theme support
- **Lightweight**: Vanilla JavaScript, no frameworks or build tools required
- **Self-contained**: Works out of the box without any installation or server setup
- **Timer modes**: 25, 50, or 90-minute work sessions with auto-switching breaks
- **Analytics**: Track your daily focus time and session history
- **Keyboard shortcuts**: Space to toggle, Escape to reset, arrow keys to navigate

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this folder
5. The Pomodoro Timer icon will appear in your extensions bar

## Usage

Click the extension icon to open the timer popup.

**Controls:**
- **Start/Pause**: Large yellow button (or Spacebar)
- **Reset**: Left button (or Escape key)
- **Skip**: Right button to skip current session
- **Duration**: 25, 50, or 90 minutes (before starting)
- **Theme**: Click "Auto" in top-right to cycle light/dark/auto

**Automatic Session Switching:**
- After each work session, a short break (5 minutes) starts automatically
- After 4 work sessions, a long break (15 minutes) starts automatically

**Session History:**
Bottom section shows:
- Total focus time today
- Timestamp of each completed session
- Duration of each session
- Time between sessions

## File Structure

```
├── manifest.json      # Chrome extension configuration
├── popup.html         # Main timer interface
├── styles.css         # Minimal CSS styling
├── timer.js           # Timer logic and app state
├── icon.svg           # Extension icon
├── README.md          # This file
```

## Keyboard Shortcuts

- **Space** or **Enter**: Toggle timer (start/pause)
- **Escape** or **R**: Reset timer
- **Tab**: Navigate between controls
- **Arrow keys**: Change duration (before starting)

## Theme Support

- **Light**: Clean white background with black accents
- **Dark**: Dark background with light accents
- **Auto**: Follows system preference

## Data Storage

All data is stored locally in your browser's localStorage:
- Theme preference
- Completed sessions
- Selected duration
- Session history

## Technical Details

- **Pure vanilla JavaScript**: No React, Vue, or build tools
- **Minimal CSS**: Only 180 lines of styling
- **Efficient timer**: Uses requestAnimationFrame for accurate timing
- **Zero dependencies**: Works completely offline
- **Chrome Manifest V3**: Compatible with latest Chrome extensions

## Development

To modify the extension:

1. Edit the files directly in your text editor
2. Go to `chrome://extensions/`
3. Click the refresh icon next to the extension
4. The changes will be applied immediately

## Customization

Change default durations in `timer.js`:
- `this.shortBreakMinutes = 5` - Change short break length
- `this.longBreakMinutes = 15` - Change long break length
- `this.pomodorosUntilLongBreak = 4` - Change work sessions before long break

## License

MIT License - Feel free to use and modify as you wish.

## Support

For issues or suggestions, please open an issue on the repository.

---

**Timer.01** - Designed with minimalism in mind.
