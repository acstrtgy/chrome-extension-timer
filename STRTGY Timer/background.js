/**
 * Background Service Worker for Pomodoro Timer
 * Manages timer state independently of the popup
 * Updates the extension badge with remaining time
 */

// Timer state
let timerState = {
  isRunning: false,
  timeLeft: 0,
  totalTime: 0,
  sessionType: 'work',
  workMinutes: 90,
  timestamp: null
};

// Badge colors - yellow background with white text
const BADGE_COLORS = {
  background: '#FFE900',  // Yellow
  text: '#000000'        // Black text (for contrast on yellow)
};

// Design colors matching the popup (for icon generation)
const COLORS = {
  yellow: '#FFE900',
  black: '#000000',
  pieFill: 'rgba(255, 233, 0, 0.15)'
};

// Icon sizes
const ICON_SIZES = [16, 32, 48, 128];
const COMPLETION_NOTIFICATION_ID = 'strtgy-focus-timer-complete';

function configureSidePanelActionClick() {
  if (!chrome.sidePanel || typeof chrome.sidePanel.setPanelBehavior !== 'function') {
    return;
  }

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => {
      console.error('Error enabling side panel action click:', error);
    });
}

function notifyTimerCompleted(sessionType) {
  if (!chrome.notifications) {
    return;
  }

  const title = sessionType === 'work' ? 'Focus session complete' : 'Break complete';
  const message = sessionType === 'work'
    ? 'Your block is done. Open STRTGY Focus Timer to start the next session.'
    : 'Your break is over. Open STRTGY Focus Timer when you are ready to focus again.';

  chrome.notifications.clear(COMPLETION_NOTIFICATION_ID, () => {
    chrome.notifications.create(COMPLETION_NOTIFICATION_ID, {
      type: 'basic',
      iconUrl: 'images/icon-128.png',
      title,
      message,
      priority: 2
    });
  });
}

/**
 * Update the extension badge with remaining time
 * Shows yellow background with black text
 * Note: Chrome badges have limited character support, using simple formats
 */
function updateBadge() {
  if (!chrome.action) return;
  
  if (!timerState.isRunning || timerState.timeLeft <= 0) {
    // Clear badge when not running
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  const totalSeconds = timerState.timeLeft;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  let text;
  
  if (totalSeconds >= 3600) {
    // Chrome badges are tiny, so keep long durations compact.
    const hours = Math.floor(minutes / 60);
    text = `${hours}h`;
  } else if (totalSeconds >= 60) {
    text = `${minutes}m`;
  } else {
    // For under 1 minute, show seconds only
    text = `${seconds}s`;
  }
  
  // Set badge text
  if (chrome.action) {
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS.background });
    if (typeof chrome.action.setBadgeTextColor === 'function') {
      chrome.action.setBadgeTextColor({ color: BADGE_COLORS.text });
    }
  }
}

/**
 * Draw timer icon and return as ImageData
 */
function drawTimerIconAsImageData(timeLeft, totalTime, size) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 1;
  
  // Calculate progress
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  
  // Draw yellow background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.yellow;
  ctx.fill();
  
  // Draw pie fill showing elapsed time
  if (progress > 0) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (progress * Math.PI * 2);
    ctx.arc(centerX, centerY, radius - 1, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLORS.pieFill;
    ctx.fill();
  }
  
  // Draw black border
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.black;
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.stroke();
  
  // Draw time text
  const minutes = Math.ceil(timeLeft / 60);
  const timeText = minutes > 99 ? '99' : String(minutes).padStart(2, '0');
  const fontSize = size < 32 ? Math.floor(size * 0.35) : Math.floor(size * 0.4);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.black;
  ctx.fillText(timeText, centerX, centerY);
  
  return ctx.getImageData(0, 0, size, size);
}

/**
 * Draw default icon and return as ImageData
 */
function drawDefaultIconAsImageData(size) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 1;
  
  // Draw yellow circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.yellow;
  ctx.fill();
  
  // Draw black border
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.black;
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.stroke();
  
  // Draw "00" text
  const fontSize = size < 32 ? Math.floor(size * 0.35) : Math.floor(size * 0.4);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.black;
  ctx.fillText('00', centerX, centerY);
  
  return ctx.getImageData(0, 0, size, size);
}

/**
 * Update the extension icon with the current timer state
 */
async function updateIcon() {
  try {
    if (!timerState.isRunning || timerState.timeLeft <= 0) {
      // Show default icon when not running
      const imageData = {};
      for (const size of ICON_SIZES) {
        imageData[size] = drawDefaultIconAsImageData(size);
      }
      if (chrome.action) chrome.action.setIcon({ imageData });
      return;
    }
    
    // Generate icons for each size with current time
    const imageData = {};
    for (const size of ICON_SIZES) {
      imageData[size] = drawTimerIconAsImageData(timerState.timeLeft, timerState.totalTime, size);
    }
    if (chrome.action) chrome.action.setIcon({ imageData });
  } catch (e) {
    console.error('Error updating icon:', e);
  }
}

// Timer tick - runs every second when timer is active
function tick() {
  if (!timerState.isRunning || !timerState.timestamp) return;
  
  const elapsed = Math.floor((Date.now() - timerState.timestamp) / 1000);
  timerState.timeLeft = Math.max(0, timerState.totalTime - elapsed);
  
  // Update both badge and icon
  updateBadge();
  updateIcon(); // Fire and forget for performance
  
  if (timerState.timeLeft <= 0) {
    const completedSessionType = timerState.sessionType;
    // Timer completed
    timerState.isRunning = false;
    timerState.timestamp = null;
    timerState.timeLeft = 0;
    
    // Clear badge and update icon
    if (chrome.action) chrome.action.setBadgeText({ text: '' });
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
    saveState();
    updateIcon();
    notifyTimerCompleted(completedSessionType);
  }
}

// Start the timer from background
function startTimer() {
  if (timerState.isRunning) return;
  
  timerState.isRunning = true;
  timerState.timestamp = Date.now();
  timerState.totalTime = timerState.timeLeft;
  
  saveState();
  
  // Update badge and icon
  updateBadge();
  updateIcon();
  
  // Start the tick interval
  startTicking();
}

// Pause the timer
function pauseTimer() {
  if (timerState.isRunning && timerState.timestamp) {
    const elapsed = Math.floor((Date.now() - timerState.timestamp) / 1000);
    timerState.timeLeft = Math.max(0, timerState.totalTime - elapsed);
  }

  timerState.isRunning = false;
  timerState.timestamp = null;
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  
  saveState();
  
  // Clear badge but keep icon
  if (chrome.action) chrome.action.setBadgeText({ text: '' });
  updateIcon();
}

// Update timer configuration
function updateConfig(workMinutes) {
  timerState.workMinutes = workMinutes;
  if (!timerState.isRunning && timerState.totalTime === 0 && timerState.timeLeft === 0) {
    timerState.totalTime = workMinutes * 60;
    timerState.timeLeft = timerState.totalTime;
  }
  saveState();
}

// Set time left (e.g., when user changes duration)
function setTimeLeft(seconds, totalTime = seconds) {
  timerState.timeLeft = seconds;
  timerState.totalTime = totalTime;
  updateBadge();
  updateIcon();
  saveState();
}

// Set session type
function setSessionType(type) {
  timerState.sessionType = type;
  updateBadge();
  updateIcon();
  saveState();
}

// Save state to storage
function saveState() {
  chrome.storage.local.set({ timerState });
}

// Load state from storage
function loadState(callback) {
  chrome.storage.local.get(['timerState'], (result) => {
    if (result.timerState) {
      timerState = { ...timerState, ...result.timerState };
      
      // If timer was running when extension closed, recalculate time
      if (timerState.isRunning && timerState.timestamp) {
        const elapsed = Math.floor((Date.now() - timerState.timestamp) / 1000);
        timerState.timeLeft = Math.max(0, timerState.totalTime - elapsed);
        
        if (timerState.timeLeft <= 0) {
          timerState.isRunning = false;
          timerState.timestamp = null;
        }
      }
      
      // Update badge and icon on load
      updateBadge();
      updateIcon();
    }
    if (callback) callback();
  });
}

// Ticking interval
let tickInterval = null;

function startTicking() {
  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(tick, 1000);
}

// Session state (separate from timer state)
let sessionState = {
  isActive: false,
  startTime: null,
  focusTime: 0,
  standbyTime: 0,
  isUserActive: true
};

// Load session state from storage
function loadSessionState() {
  chrome.storage.local.get(['sessionState'], (result) => {
    if (result.sessionState) {
      sessionState = { ...sessionState, ...result.sessionState };
    }
  });
}

// Save session state to storage
function saveSessionState() {
  chrome.storage.local.set({ sessionState });
}

// Message handler for communication with popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'start':
      startTimer();
      sendResponse({ success: true, state: timerState });
      break;
      
    case 'pause':
      pauseTimer();
      sendResponse({ success: true, state: timerState });
      break;
      
    case 'getState':
      sendResponse({ state: timerState });
      break;
      
    case 'getSessionState':
      chrome.storage.local.get(['sessionState'], (result) => {
        if (result.sessionState) {
          sessionState = { ...sessionState, ...result.sessionState };
        }
        sendResponse({ sessionState });
      });
      break;
      
    case 'updateTime':
      setTimeLeft(message.timeLeft, message.totalTime);
      sendResponse({ success: true });
      break;
      
    case 'updateConfig':
      updateConfig(message.workMinutes);
      sendResponse({ success: true });
      break;
      
    case 'setSessionType':
      setSessionType(message.sessionType);
      sendResponse({ success: true });
      break;
      
    case 'sessionStarted':
      sessionState = {
        ...sessionState,
        isActive: true,
        startTime: sessionState.startTime || Date.now(),
        isUserActive: true
      };
      saveSessionState();
      sendResponse({ success: true });
      break;

    case 'setSessionState':
      sessionState = { ...sessionState, ...message.sessionState };
      saveSessionState();
      sendResponse({ success: true, sessionState });
      break;
      
    case 'sessionEnded':
      sessionState.isActive = false;
      sessionState.startTime = null;
      saveSessionState();
      sendResponse({ success: true });
      break;

    case 'notifyCompletion':
      notifyTimerCompleted(message.sessionType || timerState.sessionType);
      sendResponse({ success: true });
      break;
      
    case 'tick':
      // Called every second by popup to sync
      if (timerState.isRunning) {
        const elapsed = Math.floor((Date.now() - timerState.timestamp) / 1000);
        timerState.timeLeft = Math.max(0, timerState.totalTime - elapsed);
        updateBadge();
        updateIcon();
      }
      sendResponse({ state: timerState });
      break;
  }
  return true;
});

if (chrome.notifications && chrome.notifications.onClicked) {
  chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === COMPLETION_NOTIFICATION_ID) {
      chrome.notifications.clear(COMPLETION_NOTIFICATION_ID);
    }
  });
}

// Initialize on startup with error handling
try {
  configureSidePanelActionClick();
  loadState(() => {
    // Resume ticking if timer was running
    if (timerState.isRunning) {
      startTicking();
    }
  });

  // Also load session state
  loadSessionState();
} catch (e) {
  console.error('Error during background initialization:', e);
}

// Set default icon and configure sidePanel on install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Pomodoro Timer extension installed/updated');
  configureSidePanelActionClick();
  
  // Set up sidePanel if available (Chrome 114+)
  if (chrome.sidePanel && typeof chrome.sidePanel.setOptions === 'function') {
    try {
      chrome.sidePanel
        .setOptions({
          path: 'popup.html',
          enabled: true
        })
        .then(() => {
          console.log('Side panel configured successfully');
        })
        .catch((error) => {
          console.error('Error configuring side panel:', error);
        });
    } catch (e) {
      console.error('Error setting up side panel:', e);
    }
  } else {
    console.log('Side panel API not available in this Chrome version');
  }
  
  // Ensure default icon is set
  updateIcon();
});

// Handle startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Pomodoro Timer extension started');
  try {
    configureSidePanelActionClick();
    loadState(() => {
      if (timerState.isRunning) {
        startTicking();
      }
    });
    loadSessionState();
  } catch (e) {
    console.error('Error during startup:', e);
  }
});
