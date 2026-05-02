/**
 * Pomodoro Timer Chrome Extension
 * Activity tracking: focus = timer running, standby = timer paused
 * Uses IndexedDB for efficient session storage
 */

class TimerApp {
  constructor() {
    // Timer configuration
    this.workMinutes = 5;
    this.shortBreakMinutes = 5;
    this.longBreakMinutes = 15;
    this.pomodorosUntilLongBreak = 4;

    // Timer state
    this.timeLeft = this.workMinutes * 60;
    this.totalTime = this.timeLeft;
    this.isRunning = false;
    this.sessionType = 'work';
    this.interval = null;
    this.syncInterval = null;

    // Theme state
    this.theme = 'system';

    // Session tracking
    this.sessionActive = false;
    this.sessionStartTime = null;
    this.focusTime = 0;
    this.standbyTime = 0;
    this.currentCycleStart = null;
    this.activityCheckInterval = null;

    // DOM elements
    this.elements = {};

    this.init();
  }

  async init() {
    await this.loadData();
    this.cacheDOM();
    this.bindEvents();
    this.updateTheme();
    await this.checkExistingSession();
    await this.loadSessionsList();
    await this.updateTodaySummary();
  }

  cacheDOM() {
    const elements = {
      startScreen: document.getElementById('start-screen'),
      timerScreen: document.getElementById('timer-screen'),
      startBtn: document.getElementById('start-btn'),
      clearBtn: document.getElementById('clear-btn'),
      endSessionBtn: document.getElementById('end-session-btn'),
      theme: document.getElementById('theme-toggle'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      pieFill: document.getElementById('pie-fill'),
      duration: document.getElementById('duration-control'),
      playBtn: document.getElementById('play-btn'),
      resetBtn: document.getElementById('reset-btn'),
      skipBtn: document.getElementById('skip-btn'),
      durationBtns: document.querySelectorAll('.duration-btn'),
      statsSection: document.getElementById('stats-section'),
      statsList: document.getElementById('stats-list'),
      sessionsList: document.getElementById('sessions-list'),
      sessionsEmpty: document.getElementById('sessions-empty'),
      sessionsFooter: document.getElementById('sessions-footer'),
      totalWork: document.getElementById('total-work'),
      totalStandby: document.getElementById('total-standby'),
    };

    this.elements = elements;
  }

  bindEvents() {
    const el = this.elements;

    el.startBtn.addEventListener('click', () => this.startSession());
    el.clearBtn.addEventListener('click', () => this.clearAllSessions());
    el.endSessionBtn.addEventListener('click', () => this.endSession());
    el.theme.addEventListener('click', () => this.cycleTheme());
    el.playBtn.addEventListener('click', () => this.toggleTimer());
    el.resetBtn.addEventListener('click', () => this.resetTimer());
    el.skipBtn.addEventListener('click', () => this.skipSession());

    el.durationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isRunning) return;
        this.setDuration(parseInt(e.target.dataset.duration));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (this.sessionActive) this.toggleTimer();
      }
      if (e.code === 'Escape' || e.key === 'r') {
        if (this.sessionActive) {
          e.preventDefault();
          this.resetTimer();
        }
      }
    });
  }

  async checkExistingSession() {
    const response = await this.sendMessage({ type: 'getSessionState' });
    if (response && response.sessionState && response.sessionState.isActive) {
      this.sessionActive = true;
      this.sessionStartTime = response.sessionState.startTime;
      this.focusTime = response.sessionState.focusTime || 0;
      this.standbyTime = response.sessionState.standbyTime || 0;
      
      this.showTimerScreen();
      this.updateStats();
      this.startActivityCheck();
    }
  }

  async startSession() {
    this.sessionActive = true;
    this.sessionStartTime = Date.now();
    this.focusTime = 0;
    this.standbyTime = 0;
    this.currentCycleStart = null;

    // Reset timer to selected duration
    this.timeLeft = this.workMinutes * 60;
    this.totalTime = this.timeLeft;
    this.isRunning = false;
    this.sessionType = 'work';

    this.saveSessionState();
    this.showTimerScreen();
    this.startActivityCheck();
    this.updateDisplay();
    this.updatePie();
    this.updateControls();
    this.updateStats();

    // Reset play button state
    this.elements.playBtn.classList.remove('playing');

    this.sendMessage({ type: 'sessionStarted' });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
    this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
  }

  async resumeSession(session) {
    if (this.sessionActive) {
      // Already in a session, confirm before switching
      if (!confirm('Resume this session? Current session will be saved.')) {
        return;
      }
      await this.endSession();
    }
    
    this.sessionActive = true;
    this.sessionStartTime = Date.now();
    this.focusTime = session.focusTime || 0;
    this.standbyTime = session.standbyTime || 0;
    this.currentCycleStart = null;

    // Reset timer to selected duration
    this.timeLeft = this.workMinutes * 60;
    this.totalTime = this.timeLeft;
    this.isRunning = false;
    this.sessionType = 'work';

    this.saveSessionState();
    this.showTimerScreen();
    this.startActivityCheck();
    this.updateDisplay();
    this.updatePie();
    this.updateControls();
    this.updateStats();

    // Reset play button state
    this.elements.playBtn.classList.remove('playing');

    this.sendMessage({ type: 'sessionStarted' });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
    this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
  }

  async endSession() {
    // Add current cycle to stats before ending
    await this.addTimerCycleToStats();
    
    this.pauseTimer();
    this.stopActivityCheck();
    
    this.sessionActive = false;
    this.sessionStartTime = null;
    this.focusTime = 0;
    this.standbyTime = 0;
    this.currentCycleStart = null;

    this.sendMessage({ type: 'sessionEnded' });
    
    // Refresh the sessions list
    await this.loadSessionsList();
    await this.updateTodaySummary();
    
    this.showStartScreen();
  }

  showStartScreen() {
    const el = this.elements;
    el.startScreen.classList.remove('hidden');
    el.timerScreen.classList.add('hidden');
  }

  showTimerScreen() {
    const el = this.elements;
    el.startScreen.classList.add('hidden');
    el.timerScreen.classList.remove('hidden');
    
    this.updateDisplay();
    this.updateControls();
  }

  startActivityCheck() {
    if (this.activityCheckInterval) return;
    
    this.activityCheckInterval = setInterval(() => {
      this.updateActivityState();
    }, 1000);
  }

  stopActivityCheck() {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
  }

  updateActivityState() {
    if (!this.sessionActive) return;

    // Focus time = time when timer is RUNNING
    // Standby time = time when timer is PAUSED
    
    if (this.isRunning) {
      this.focusTime++;
    } else {
      this.standbyTime++;
    }

    this.saveSessionState();
    this.updateStats();
  }

  /**
   * Add current timer cycle to stats (called when timer completes or skips)
   */
  async addTimerCycleToStats() {
    if (this.focusTime === 0 && this.standbyTime === 0) return;

    const session = {
      timestamp: new Date(),
      focusTime: this.focusTime,
      standbyTime: this.standbyTime,
    };

    await DB.addSession(session);
  }

  formatTimeShort(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }

  formatTimeDetailed(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }

  /**
   * Calculate ratio as a string (e.g., "1.5x" or "0.5x")
   */
  formatRatio(focus, standby) {
    if (standby === 0) {
      return focus > 0 ? '∞x' : '—';
    }
    const ratio = focus / standby;
    return `${ratio.toFixed(1)}x`;
  }

  saveSessionState() {
    const sessionState = {
      isActive: this.sessionActive,
      startTime: this.sessionStartTime,
      focusTime: this.focusTime,
      standbyTime: this.standbyTime,
    };
    chrome.storage.local.set({ sessionState });
  }

  /**
   * Load and display sessions list on start screen
   */
  async loadSessionsList() {
    const el = this.elements;
    
    try {
      const sessions = await DB.getAllSessions();
      const today = new Date().toDateString();
      
      if (sessions.length === 0) {
        el.sessionsList.innerHTML = '';
        el.sessionsEmpty.classList.remove('hidden');
        el.sessionsFooter.style.display = 'none';
        return;
      }
      
      el.sessionsEmpty.classList.add('hidden');
      el.sessionsFooter.style.display = 'block';
      el.sessionsList.innerHTML = '';
      
      // Sort by timestamp descending (newest first)
      sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Calculate totals
      let totalWork = 0;
      let totalStandby = 0;
      
      // Show last 20 sessions grouped by date
      const sessionsByDate = {};
      sessions.slice(0, 20).forEach(session => {
        totalWork += session.focusTime || 0;
        totalStandby += session.standbyTime || 0;
        
        const date = new Date(session.timestamp).toDateString();
        if (!sessionsByDate[date]) {
          sessionsByDate[date] = [];
        }
        sessionsByDate[date].push(session);
      });
      
      for (const [date, daySessions] of Object.entries(sessionsByDate)) {
        // Only show date header if not today (today is obvious)
        if (date !== today) {
          const dateRow = document.createElement('div');
          dateRow.className = 'session-date-header';
          dateRow.textContent = this.formatDateHeader(date);
          el.sessionsList.appendChild(dateRow);
        }
        
        // Sessions for this date
        daySessions.forEach(session => {
          const row = this.createSessionRow(session);
          el.sessionsList.appendChild(row);
        });
      }
      
      // Update footer totals
      el.totalWork.textContent = this.formatTimeDetailed(totalWork);
      el.totalStandby.textContent = this.formatTimeDetailed(totalStandby);
      
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  formatDateHeader(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toDateString()) {
      return 'Today';
    } else if (dateString === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  createSessionRow(session) {
    const row = document.createElement('div');
    row.className = 'session-row';
    
    // Click to resume this session
    row.addEventListener('click', () => {
      this.resumeSession(session);
    });
    
    const time = new Date(session.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    row.innerHTML = `
      <div class="session-date"><span class="resume-icon">↻</span> ${time}</div>
      <div class="session-work">${this.formatTimeDetailed(session.focusTime)}</div>
      <div class="session-standby">${this.formatTimeDetailed(session.standbyTime)}</div>
    `;
    
    return row;
  }

  /**
   * Update today's summary on start screen
   */
  async updateTodaySummary() {
    const el = this.elements;
    
    try {
      const stats = await DB.getStatsSummary();
      
      // Update footer totals for today
      el.totalWork.textContent = this.formatTimeDetailed(stats.todayFocusTime);
      el.totalStandby.textContent = this.formatTimeDetailed(stats.todayStandbyTime);
    } catch (error) {
      console.error('Error updating summary:', error);
    }
  }

  /**
   * Clear all sessions
   */
  async clearAllSessions() {
    if (!confirm('Delete all sessions? This cannot be undone.')) {
      return;
    }
    
    try {
      await DB.clearAllSessions();
      await this.loadSessionsList();
      await this.updateTodaySummary();
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  }

  updateStats() {
    const el = this.elements;

    // Calculate today's totals
    const today = new Date();
    const todaySessions = this.sessionActive ? [{
      timestamp: new Date(this.sessionStartTime),
      focusTime: this.focusTime,
      standbyTime: this.standbyTime,
      isCurrent: true
    }] : [];

    const totalFocus = todaySessions.reduce((sum, s) => sum + (s.focusTime || 0), 0);
    const totalStandby = todaySessions.reduce((sum, s) => sum + (s.standbyTime || 0), 0);
    const totalTime = totalFocus + totalStandby;

    const totalTimeFormatted = this.formatTimeShort(totalTime);
    el.statsTotal.textContent = totalTimeFormatted;

    // Populate stats list (simplified - just current session)
    if (this.sessionActive) {
      el.statsSection.style.display = 'block';
      el.statsList.innerHTML = '';
      
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <div>Now</div>
        <div>${this.formatTimeShort(this.focusTime)}</div>
        <div style="text-align: right">${this.formatTimeShort(this.standbyTime)}</div>
      `;
      el.statsList.appendChild(row);
    } else {
      el.statsSection.style.display = 'none';
    }
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

  async fetchStateFromBackground() {
    const response = await this.sendMessage({ type: 'getState' });
    if (response && response.state) {
      const bgState = response.state;
      
      if (bgState.isRunning && bgState.timestamp) {
        const elapsed = Math.floor((Date.now() - bgState.timestamp) / 1000);
        this.timeLeft = Math.max(0, bgState.totalTime - elapsed);
        this.totalTime = bgState.totalTime;
        this.isRunning = true;
        this.startBackgroundSync();
      } else {
        this.timeLeft = bgState.timeLeft || this.timeLeft;
        this.totalTime = bgState.totalTime || this.totalTime;
        this.isRunning = false;
        this.stopBackgroundSync();
      }
      
      this.sessionType = bgState.sessionType || this.sessionType;
      this.workMinutes = bgState.workMinutes || this.workMinutes;
      
      this.updateDisplay();
      this.updatePie();
      this.updateProgress();
      this.updateControls();
      
      if (this.isRunning) {
        this.elements.playBtn.classList.add('playing');
      } else {
        this.elements.playBtn.classList.remove('playing');
      }
    }
  }

  startBackgroundSync() {
    if (this.syncInterval) return;
    this.syncInterval = setInterval(() => {
      this.fetchStateFromBackground();
    }, 1000);
  }

  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async loadData() {
    try {
      const data = localStorage.getItem('pomodoroData');
      if (data) {
        const parsed = JSON.parse(data);
        this.workMinutes = parsed.workMinutes || this.workMinutes;
        this.timeLeft = this.workMinutes * 60;
        this.totalTime = this.timeLeft;
        this.theme = parsed.theme || 'system';
      }
      
      this.sendMessage({ type: 'updateConfig', workMinutes: this.workMinutes });
      this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
      this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
      await this.fetchStateFromBackground();
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }

  saveData() {
    const data = {
      workMinutes: this.workMinutes,
      theme: this.theme,
    };
    localStorage.setItem('pomodoroData', JSON.stringify(data));
  }

  cycleTheme() {
    const themes = ['dark', 'light', 'system'];
    const currentIndex = themes.indexOf(this.theme);
    this.theme = themes[(currentIndex + 1) % themes.length];
    this.updateTheme();
    this.saveData();
  }

  updateTheme() {
    const el = this.elements;
    el.theme.textContent = this.theme === 'system' ? 'Auto' : this.theme;
    const effectiveTheme = this.getEffectiveTheme();
    if (effectiveTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  getEffectiveTheme() {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.theme;
  }

  setDuration(minutes) {
    this.workMinutes = minutes;
    this.timeLeft = minutes * 60;
    this.totalTime = this.timeLeft;
    this.updateDisplay();
    this.updateProgress();
    this.updateDuration();
    this.saveData();

    this.sendMessage({ type: 'updateConfig', workMinutes: minutes });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
  }

  updateDuration() {
    const el = this.elements;
    el.durationBtns.forEach(btn => {
      if (parseInt(btn.dataset.duration) === this.workMinutes) {
        btn.classList.add('duration-active');
      } else {
        btn.classList.remove('duration-active');
      }
    });
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    const el = this.elements;
    el.playBtn.classList.add('playing');

    this.startBackgroundSync();

    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      this.updatePie();
      this.updateProgress();

      this.sendMessage({ type: 'tick' });

      if (this.timeLeft <= 0) {
        this.completeSession();
      }
    }, 1000);

    this.sendMessage({ type: 'start' });
  }

  pauseTimer() {
    this.isRunning = false;
    const el = this.elements;
    el.playBtn.classList.remove('playing');
    clearInterval(this.interval);
    this.interval = null;

    this.sendMessage({ type: 'pause' });
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.sessionType === 'work'
      ? this.workMinutes * 60
      : this.sessionType === 'shortBreak'
        ? this.shortBreakMinutes * 60
        : this.longBreakMinutes * 60;
    this.totalTime = this.timeLeft;
    this.updateDisplay();
    this.updatePie();
    this.updateProgress();
    this.updateControls();

    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
  }

  async skipSession() {
    await this.addTimerCycleToStats();
    
    this.focusTime = 0;
    this.standbyTime = 0;
    
    this.pauseTimer();
    this.completeSession();
    
    this.updateStats();
    await this.loadSessionsList();
    await this.updateTodaySummary();
  }

  async completeSession() {
    await this.addTimerCycleToStats();
    
    this.focusTime = 0;
    this.standbyTime = 0;
    
    this.pauseTimer();

    if (this.sessionType === 'work') {
      this.sessionType = 'shortBreak';
      this.timeLeft = this.shortBreakMinutes * 60;
    } else {
      this.sessionType = 'work';
      this.timeLeft = this.workMinutes * 60;
    }

    this.totalTime = this.timeLeft;
    this.updateDisplay();
    this.updatePie();
    this.updateProgress();
    this.updateControls();
    this.updateStats();
    await this.loadSessionsList();
    await this.updateTodaySummary();

    this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
  }

  updateDisplay() {
    const el = this.elements;
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;

    el.minutes.textContent = minutes.toString().padStart(2, '0');
    el.seconds.textContent = seconds.toString().padStart(2, '0');
  }

  updateControls() {
    const el = this.elements;
    el.duration.classList.toggle('disabled', this.isRunning);
  }

  updatePie() {
    const el = this.elements;
    const progress = Math.max(0, (this.totalTime - this.timeLeft) / this.totalTime);
    const angle = progress * 360;

    if (angle === 0) {
      el.pieFill.setAttribute('d', '');
      return;
    }

    const cx = 150, cy = 150, radius = 140;

    if (angle >= 359.9) {
      el.pieFill.setAttribute('d', `M ${cx} ${cy} m 0 -${radius} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`);
    } else {
      const startAngle = -90;
      const endAngle = startAngle + angle;

      const x1 = cx + radius * Math.cos(Math.PI * startAngle / 180);
      const y1 = cy + radius * Math.sin(Math.PI * startAngle / 180);
      const x2 = cx + radius * Math.cos(Math.PI * endAngle / 180);
      const y2 = cy + radius * Math.sin(Math.PI * endAngle / 180);

      const largeArc = angle > 180 ? 1 : 0;

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      el.pieFill.setAttribute('d', d);
    }
  }

  updateProgress() {
    // Progress handled by updatePie()
  }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new TimerApp();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    app.updateTheme();
  });

  window.addEventListener('beforeunload', () => {
    app.stopBackgroundSync();
    app.saveSessionState();
  });
});
