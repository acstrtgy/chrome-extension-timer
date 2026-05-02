# Pomodoro Timer - Project Documentation

## Overview
Chrome extension for focused work sessions with activity tracking (focus vs standby time).

## Project Structure
```
STRTGY Timer/
├── manifest.json    # Extension config (Manifest V3)
├── popup.html      # Timer UI
├── timer.js       # Timer logic
├── db.js         # localStorage session manager
├── styles.css     # Styling
├── background.js   # Service worker
├── images/        # Icons
└── PROJECT.md     # This file
```

## Features
- **Side Panel** - Opens in Chrome sidebar (114+)
- **Activity Tracking** - Focus time (timer running) vs Standby time (timer paused)
- **Session Statistics** - Work/Standby tracking per session
- **Session History** - List of past sessions with totals
- **Resume Session** - Click any session to resume it
- **Dynamic Icon** - Shows remaining time on toolbar icon
- **Badge** - Shows time on extension icon

## Time Tracking Logic
| Timer State | Time Type |
|-------------|-----------|
| Paused (before play) | Standby |
| Running (after play) | Focus |
| Paused (after pause) | Standby |

## Sessions Table
Columns: Time | Work | Standby
Footer shows totals.

## Files
- **db.js** - localStorage wrapper for sessions
- **timer.js** - TimerApp class with all logic
- **background.js** - Service worker for icon/badge updates

## Installation
1. Chrome 114+ → `chrome://extensions`
2. Developer mode → Load unpacked → Select folder
3. Click extension icon to open sidebar
