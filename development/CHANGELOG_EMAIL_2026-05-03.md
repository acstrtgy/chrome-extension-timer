# STRTGY Focus Timer Update Email

Date: May 3, 2026

## Subject

STRTGY Focus Timer update is available

## Preview Text

The new version includes a redesigned timer screen, editable sessions, reflection tracking, export improvements, and a cleaner installable extension package.

## Email Draft

Hi,

An updated version of STRTGY Focus Timer is now available.

This update focuses on making the timer clearer during an active work session and making saved sessions much easier to review, correct, and export.

### What's new

- Redesigned timer screen with a clearer hierarchy, compact controls, and a layout consistent with the sessions dashboard.
- Custom focus duration support, in addition to the preset durations.
- Live session summary showing focus intervals, focus time, standby time, and ratio.
- Editable saved sessions, including task text, focus moments, motivation, progress, and reflection notes.
- Improved session list with expandable details, clearer day grouping, compact metadata, and hover actions.
- CSV export for session history, including focus intervals and reflections.
- Light, dark, and auto theme support.
- English and Italian interface support.
- Notification sound and browser notification when a focus block completes.
- Cleaner installable extension folder, with development files moved out of the production package.

### Why update

If you downloaded an earlier version, this one is easier to use day to day:

- The timer screen is calmer and more readable.
- Session data is easier to understand.
- Mistakes in saved sessions can now be corrected.
- The extension folder is cleaner and ready to load in Chrome.

### How to update

1. Download or pull the latest version of the project.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer Mode.
4. Remove or refresh the previous STRTGY Focus Timer extension.
5. Click **Load unpacked**.
6. Select the `STRTGY Timer` folder.

The installable extension is inside the `STRTGY Timer` folder. The `development` folder contains project notes, samples, and development materials.

Thanks for trying the timer and sending feedback. This version is ready to install and use.

Antonio

## Detailed Changelog

### Timer Screen

- Redesigned the active timer screen to match the existing sessions dashboard visual system.
- Added a compact header with session state.
- Added a segmented duration selector for `5`, `25`, `50`, and `90` minutes.
- Added a custom duration control for arbitrary minute values.
- Kept the existing yellow pie-fill timer behavior while aligning the surrounding UI with the redesign.
- Added clearer play, pause, resume, and end-session controls.
- Added a live interval list for the current session.
- Fixed live progress row layout so progress bars keep a consistent width regardless of right-side time text length.
- Added footer-style live totals for focus time, standby time, and ratio.

### Sessions Dashboard

- Redesigned saved session rows around focus duration, session ordinal, metadata, and explanatory ratio text.
- Added clearer day grouping with compact calendar-style date markers.
- Added expandable session details for task, reflections, and intervals.
- Added hover-revealed edit and delete actions.
- Added improved empty state and total summaries.

### Session Editing

- Added full session editing from the saved sessions list.
- Users can edit the task, focus durations, standby durations, motivation score, progress score, and reflection text.
- Duration editing now uses hours, minutes, and seconds instead of raw seconds.
- Reflection scores use dot-style 1-5 controls.
- Added safer session update handling in local storage.

### Reflection And Export

- Added post-focus reflection fields for motivation, meaningful progress, and a standout work-related event.
- Added CSV export for session history.
- CSV export includes session totals, interval data, reflection scores, and reflection notes.

### Packaging

- Cleaned the installable extension folder so `STRTGY Timer` contains only runtime extension assets.
- Moved design documentation and sample CSV files into `development`.
- Removed obsolete root-level project notes that were no longer needed.

### Validation

- Verified JavaScript syntax for `timer.js`.
- Verified JavaScript syntax for `background.js`.
- Verified `manifest.json` parses as valid JSON.

