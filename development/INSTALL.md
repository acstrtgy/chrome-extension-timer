# Quick Installation Guide

## To Install the Chrome Extension:

1. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Navigate to: `chrome://extensions/`

2. **Enable Developer Mode**
   - Click the toggle in the top right corner labeled "Developer mode"

3. **Load the Extension**
   - Click the button "Load unpacked"
   - Select this folder (the one containing `manifest.json`)
   - Click "Select Folder"

4. **Start Using**
   - The extension icon will appear in your toolbar
   - Click it to open the Pomodoro Timer

## Extension Features:

✅ **Clean, minimal design**
✅ **Light/Dark/Auto theme support**
✅ **Timer durations: 25, 50, or 90 minutes**
✅ **Auto breaks after each session**
✅ **Session history tracking**
✅ **Keyboard shortcuts**
✅ **No internet required**

## Keyboard Controls:

- **Spacebar** or **Enter**: Start/Pause timer
- **Escape** or **R**: Reset timer
- **Tab**: Navigate controls

## File Structure:
```
├── manifest.json         Chrome extension configuration
├── popup.html            Main interface (74 lines)
├── styles.css            Minimal styling (312 lines)
├── timer.js              Timer logic (403 lines)
├── images/
│   ├── icon-16.png       16px icon
│   ├── icon-32.png       32px icon
│   ├── icon-48.png       48px icon
│   └── icon-128.png      128px icon
└── README.md              Full documentation
```

**Total Lines:** Only 814 lines of code total!
**Lightweight:** No dependencies, no build tools, pure vanilla JS

---

Enjoy your focused work sessions! 🍅
