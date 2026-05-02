/**
 * Pomodoro Timer Chrome Extension
 * Activity tracking: focus = timer running, standby = timer paused
 * Uses IndexedDB for efficient session storage
 */

const TRANSLATIONS = {
  en: {
    screen: {
      focusSession: 'Focus Session',
    },
    actions: {
      newSession: 'New Session',
      exportCsv: 'Export CSV',
      clear: 'Clear',
      endSession: 'End Session',
      cancel: 'Cancel',
      saveSession: 'Save Session',
      saveReflection: 'Save Reflection',
      saveReflectionEnd: 'Save Reflection and End Session',
    },
    labels: {
      sessions: 'Sessions',
      session: 'Session',
      focus: 'Focus',
      wait: 'Wait',
      ratio: 'Ratio',
      total: 'Total',
      focusCount: 'focus',
      today: 'Today',
      yesterday: 'Yesterday',
      motivation: 'Motivation',
      meaningfulProgress: 'Meaningful progress',
      postFocusReflection: 'Post-focus reflection {index}',
    },
    empty: {
      noSessions: 'No sessions yet',
    },
    status: {
      standby: 'standby',
    },
    theme: {
      auto: 'Auto',
      light: 'Light',
      dark: 'Dark',
    },
    footer: {
      stayUpdated: 'Stay updated on this project',
    },
    forms: {
      sessionTaskTitle: 'What is important to accomplish in this work session?',
      sessionTaskExpanded: 'What is important to accomplish in this work session? Describe the task you need to focus on.',
      sessionTaskPlaceholder: 'Describe the task or result you need to focus on right now.',
      reflectionBeforeNextBlock: 'Before starting the next focus block, answer these questions.',
      reflectionBeforeEnd: 'Before ending this session, answer these questions.',
      question1: 'Question 1. Use a 1-5 scale (1 = not at all, 5 = extremely)<br>How motivated did you feel to work on your tasks today?',
      question2: 'Question 2. Use a 1-5 scale (1 = not at all, 5 = extremely)<br>To what extent did you make progress on work that feels meaningful to you in this session?',
      question3: 'Question 3. Free text<br>Briefly describe one event from today that stands out in your mind and is related to your work or progress.',
      reflectionEventPlaceholder: 'Describe one work-related event or moment from today that stands out.',
    },
    titles: {
      exportCsv: 'Download all sessions as CSV',
      clearSessions: 'Clear all sessions',
      startPause: 'Start/Pause',
      deleteSession: 'Delete session',
      editSession: 'Edit session',
      changeLanguage: 'Change language',
    },
    messages: {
      resumeUnsupported: 'Resuming past sessions is not yet supported with the new tracking format.',
      confirmDeleteSession: 'Delete this session?',
      confirmClearSessions: 'Delete all sessions? This cannot be undone.',
      reflectionRequiredNextBlock: 'Please answer all reflection questions before starting the next focus block.',
      reflectionRequiredEndSession: 'Please answer all reflection questions before ending this session.',
      noSessionsToExport: 'No sessions available to export.',
      exportFailed: 'Unable to export sessions right now.',
      updateFailed: 'Unable to update this session right now.',
      close: 'Close',
    },
    locale: 'en-US',
  },
  it: {
    screen: {
      focusSession: 'Sessione di Focus',
    },
    actions: {
      newSession: 'Nuova sessione',
      exportCsv: 'Esporta CSV',
      clear: 'Cancella',
      endSession: 'Chiudi sessione',
      cancel: 'Annulla',
      saveSession: 'Salva sessione',
      saveReflection: 'Salva riflessione',
      saveReflectionEnd: 'Salva riflessione e chiudi sessione',
    },
    labels: {
      sessions: 'Sessioni',
      session: 'Sessione',
      focus: 'Focus',
      wait: 'Attesa',
      ratio: 'Rapporto',
      total: 'Totale',
      focusCount: 'focus',
      today: 'Oggi',
      yesterday: 'Ieri',
      motivation: 'Motivazione',
      meaningfulProgress: 'Progresso significativo',
      postFocusReflection: 'Riflessione post-focus {index}',
    },
    empty: {
      noSessions: 'Nessuna sessione',
    },
    status: {
      standby: 'standby',
    },
    theme: {
      auto: 'Auto',
      light: 'Chiaro',
      dark: 'Scuro',
    },
    footer: {
      stayUpdated: 'Resta aggiornato su questo progetto',
    },
    forms: {
      sessionTaskTitle: 'Che cosa è importante portare a termine in questa sessione di lavoro?',
      sessionTaskExpanded: 'Che cosa è importante portare a termine in questa sessione di lavoro? Descrivi il compito su cui devi concentrarti.',
      sessionTaskPlaceholder: 'Descrivi il compito o il risultato su cui devi concentrarti adesso.',
      reflectionBeforeNextBlock: 'Prima di iniziare il prossimo blocco di focus, rispondi a queste domande.',
      reflectionBeforeEnd: 'Prima di chiudere questa sessione, rispondi a queste domande.',
      question1: 'Domanda 1. Usa una scala da 1 a 5 (1 = per niente, 5 = moltissimo)<br>Quanto ti sei sentito motivato a lavorare sui tuoi compiti oggi?',
      question2: 'Domanda 2. Usa una scala da 1 a 5 (1 = per niente, 5 = moltissimo)<br>In che misura hai fatto progressi su un lavoro che senti significativo in questa sessione?',
      question3: 'Domanda 3. Testo libero<br>Descrivi brevemente un evento di oggi che ti è rimasto impresso ed è legato al tuo lavoro o ai tuoi progressi.',
      reflectionEventPlaceholder: 'Descrivi un momento o un evento di lavoro di oggi che ti è rimasto impresso.',
    },
    titles: {
      exportCsv: 'Scarica tutte le sessioni in CSV',
      clearSessions: 'Cancella tutte le sessioni',
      startPause: 'Avvia/Pausa',
      deleteSession: 'Elimina sessione',
      editSession: 'Modifica sessione',
      changeLanguage: 'Cambia lingua',
    },
    messages: {
      resumeUnsupported: 'Riprendere sessioni passate non è ancora supportato con questo nuovo formato di tracciamento.',
      confirmDeleteSession: 'Eliminare questa sessione?',
      confirmClearSessions: 'Eliminare tutte le sessioni? Questa azione non può essere annullata.',
      reflectionRequiredNextBlock: 'Rispondi a tutte le domande prima di iniziare il prossimo blocco di focus.',
      reflectionRequiredEndSession: 'Rispondi a tutte le domande prima di chiudere questa sessione.',
      noSessionsToExport: 'Non ci sono sessioni da esportare.',
      exportFailed: 'Impossibile esportare le sessioni in questo momento.',
      updateFailed: 'Impossibile aggiornare questa sessione in questo momento.',
      close: 'Chiudi',
    },
    locale: 'it-IT',
  },
};

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
    this.language = 'en';

    // Session tracking
    this.sessionActive = false;
    this.sessionStartTime = null;
    this.focusIntervals = [];         // Array of {startTime, focusDuration, standbyDuration}
    this.currentFocusInterval = null; // Current active focus interval
    this.standbyStartTime = null;    // When standby began
    this.sessionTask = '';
    this.sessionReflections = [];
    this.pendingReflection = false;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';
    this.audioContext = null;
    this.notificationAudioBuffer = null;
    this.audioUnlocked = false;

    // DOM elements
    this.elements = {};

    this.init();
  }

  async init() {
    this.cacheDOM();
    this.bindEvents();
    await this.loadData();
    this.updateTheme();
    this.applyTranslations();
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
      exportBtn: document.getElementById('export-btn'),
      endSessionBtn: document.getElementById('end-session-btn'),
      sessionTaskInput: document.getElementById('session-task-input'),
      sessionReflectionForm: document.getElementById('session-reflection-form'),
      sessionReflectionTitle: document.getElementById('session-reflection-title'),
      sessionReflectionEvent: document.getElementById('session-reflection-event'),
      reflectionSubmitBtn: document.getElementById('reflection-submit-btn'),
      reflectionCancelBtn: document.getElementById('reflection-cancel-btn'),
      theme: document.getElementById('theme-toggle'),
      languageToggle: document.getElementById('language-toggle'),
      languageMenu: document.getElementById('language-menu'),
      languageOptions: document.querySelectorAll('.language-option'),
      minTens: document.getElementById('min-tens'),
      minUnits: document.getElementById('min-units'),
      secTens: document.getElementById('sec-tens'),
      secUnits: document.getElementById('sec-units'),
      pieFill: document.getElementById('pie-fill'),
      timerCircle: document.getElementById('timer-circle'),
      timerSvg: document.getElementById('timer-svg'),
      standbyLabel: document.getElementById('standby-label'),
      duration: document.getElementById('duration-control'),
      playBtn: document.getElementById('play-btn'),
      durationBtns: document.querySelectorAll('.duration-btn'),
      statsList: document.getElementById('stats-list'),
      sessionsList: document.getElementById('sessions-list'),
      sessionsEmpty: document.getElementById('sessions-empty'),
      sessionsFooter: document.getElementById('sessions-footer'),
      totalWork: document.getElementById('total-work'),
      totalStandby: document.getElementById('total-standby'),
      totalRatio: document.getElementById('total-ratio'),
      sessionEditModal: document.getElementById('session-edit-modal'),
      sessionEditForm: document.getElementById('session-edit-form'),
      sessionEditCloseBtn: document.getElementById('session-edit-close-btn'),
    };

    this.elements = elements;
  }

  bindEvents() {
    const el = this.elements;
    const unlockAudio = () => this.unlockAudioPlayback();

    el.startBtn.addEventListener('click', () => {
      unlockAudio();
      this.startSession();
    });
    el.clearBtn.addEventListener('click', () => this.clearAllSessions());
    el.exportBtn.addEventListener('click', () => this.exportSessionsCsv());
    el.endSessionBtn.addEventListener('click', () => {
      unlockAudio();
      this.endSession();
    });
    el.theme.addEventListener('click', () => this.cycleTheme());
    el.languageToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      this.toggleLanguageMenu();
    });
    el.languageOptions.forEach((option) => {
      option.addEventListener('click', () => {
        this.setLanguage(option.dataset.language);
      });
    });
    el.playBtn.addEventListener('click', () => {
      unlockAudio();
      this.toggleTimer();
    });
    el.sessionTaskInput.addEventListener('input', (e) => this.updateSessionTask(e.target.value));
    el.sessionReflectionForm.addEventListener('submit', (e) => this.handleReflectionSubmit(e));
    el.reflectionCancelBtn.addEventListener('click', () => this.cancelPendingEndSession());
    el.sessionEditCloseBtn.addEventListener('click', () => this.closeSessionEditModal());
    el.sessionEditModal.addEventListener('click', (event) => {
      if (event.target === el.sessionEditModal) {
        this.closeSessionEditModal();
      }
    });

    el.durationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isRunning) return;
        unlockAudio();
        this.setDuration(parseInt(e.target.dataset.duration));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && !el.sessionEditModal.classList.contains('hidden')) {
        e.preventDefault();
        this.closeSessionEditModal();
        return;
      }

      const target = e.target;
      const isTypingField = target instanceof HTMLElement && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (isTypingField) {
        return;
      }

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

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.language-switcher')) {
        this.closeLanguageMenu();
      }
    });
  }

  getTranslations() {
    return TRANSLATIONS[this.language] || TRANSLATIONS.en;
  }

  t(key, variables = {}) {
    const value = key.split('.').reduce((result, segment) => result?.[segment], this.getTranslations())
      ?? key.split('.').reduce((result, segment) => result?.[segment], TRANSLATIONS.en)
      ?? key;

    if (typeof value !== 'string') {
      return key;
    }

    return Object.entries(variables).reduce(
      (text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  }

  applyTranslations() {
    document.documentElement.lang = this.language;
    document.title = `STRTGY ${this.t('screen.focusSession')}`;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = this.t(node.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((node) => {
      node.innerHTML = this.t(node.dataset.i18nHtml);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      node.placeholder = this.t(node.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
      node.title = this.t(node.dataset.i18nTitle);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
      node.setAttribute('aria-label', this.t(node.dataset.i18nAriaLabel));
    });

    this.updateTheme();
    this.updateLanguageMenu();
    this.updateReflectionState();
    this.updateVisualState();
  }

  toggleLanguageMenu() {
    const isHidden = this.elements.languageMenu.classList.toggle('hidden');
    this.elements.languageToggle.setAttribute('aria-expanded', String(!isHidden));
  }

  closeLanguageMenu() {
    this.elements.languageMenu.classList.add('hidden');
    this.elements.languageToggle.setAttribute('aria-expanded', 'false');
  }

  setLanguage(language) {
    if (!TRANSLATIONS[language] || language === this.language) {
      this.closeLanguageMenu();
      return;
    }

    this.language = language;
    this.applyTranslations();
    this.saveData();
    this.loadSessionsList();
    this.closeLanguageMenu();
  }

  updateLanguageMenu() {
    this.elements.languageOptions.forEach((option) => {
      option.classList.toggle('active', option.dataset.language === this.language);
    });
  }

  getLocale() {
    return this.getTranslations().locale || 'en-US';
  }

  async checkExistingSession() {
    const response = await this.sendMessage({ type: 'getSessionState' });
    if (response && response.sessionState && response.sessionState.isActive) {
      this.sessionActive = true;
      this.sessionStartTime = response.sessionState.startTime;
      this.focusIntervals = response.sessionState.focusIntervals || [];
      this.currentFocusInterval = response.sessionState.currentFocusInterval || null;
      this.standbyStartTime = response.sessionState.standbyStartTime || null;
      this.sessionTask = response.sessionState.sessionTask || '';
      this.sessionReflections = response.sessionState.sessionReflections || [];
      this.pendingReflection = !!response.sessionState.pendingReflection;
      this.pendingSessionEnd = !!response.sessionState.pendingSessionEnd;
      this.reflectionContext = response.sessionState.reflectionContext || 'resume';

      if (this.currentFocusInterval && this.isRunning) {
        const elapsed = Math.floor((Date.now() - this.currentFocusInterval.startTime) / 1000);
        this.currentFocusInterval.focusDuration = Math.max(elapsed, this.currentFocusInterval.focusDuration || 0);
      }

      if (!this.isRunning && this.standbyStartTime) {
        this.startStandbyTicker();
      }

      this.showTimerScreen();
      this.elements.sessionTaskInput.value = this.sessionTask;
      this.resetReflectionForm();
      this.updateVisualState();
      this.updateReflectionState();
      this.updateFocusIntervalsDisplay();
    }
  }

  async startSession() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.stopBackgroundSync();

    this.sessionActive = true;
    this.sessionStartTime = Date.now();
    this.focusIntervals = [];
    this.currentFocusInterval = null;
    this.standbyStartTime = Date.now(); // Standby begins immediately
    this.sessionTask = '';
    this.sessionReflections = [];
    this.pendingReflection = false;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';

    // Initialize cycle tracking (starts in standby mode)
    this.cycleFocusTime = 0;
    this.cycleStandbyTime = 0;
    this.cycleStandbyStartTime = Date.now();

    // Reset timer to selected duration
    this.timeLeft = this.workMinutes * 60;
    this.totalTime = this.timeLeft;
    this.isRunning = false;
    this.sessionType = 'work';

    this.saveSessionState();
    this.showTimerScreen();
    this.elements.sessionTaskInput.value = '';
    this.resetReflectionForm();
    this.updateDisplay();
    this.updatePie();
    this.updateControls();
    this.updateVisualState();
    this.updateFocusIntervalsDisplay();
    this.startStandbyTicker();

    // Reset play button state
    this.elements.playBtn.classList.remove('playing');

    this.sendMessage({ type: 'sessionStarted' });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
    this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
  }

  async resumeSession(session) {
    // For now, we don't support resuming past sessions with this new structure
    // Just show a message
    alert(this.t('messages.resumeUnsupported'));
    return;
  }

  async endSession() {
    if (!this.sessionActive) {
      return;
    }

    if (this.pendingReflection) {
      this.pendingSessionEnd = true;
      this.reflectionContext = 'end';
      this.updateReflectionState();
      this.saveSessionState();
      this.elements.sessionReflectionForm.classList.remove('hidden');
      this.elements.sessionReflectionEvent.focus();
      return;
    }

    this.pendingReflection = true;
    this.pendingSessionEnd = true;
    this.reflectionContext = 'end';
    this.resetReflectionForm();
    this.updateReflectionState();
    this.saveSessionState();
    this.elements.sessionReflectionForm.classList.remove('hidden');
    this.elements.sessionReflectionEvent.focus();
    return;
  }

  async finalizeSessionEnd() {
    // End any open focus interval
    this.endCurrentFocusInterval();
    
    // Calculate remaining standby time
    let totalStandbyTime = this.focusIntervals.reduce((sum, interval) => sum + (interval.standbyDuration || 0), 0);
    if (this.standbyStartTime && !this.currentFocusInterval) {
      // We're in standby mode at the end
      totalStandbyTime += Math.floor((Date.now() - this.standbyStartTime) / 1000);
    }
    
    // Only save if we have at least one focus interval or meaningful standby
    if (this.focusIntervals.length > 0 || totalStandbyTime > 0) {
      const session = {
        timestamp: this.sessionStartTime,
        task: this.sessionTask.trim(),
        reflections: this.sessionReflections,
        focusIntervals: this.focusIntervals,
      };
      await DB.addSession(session);
    }
    
    this.pauseTimer();
    
    this.sessionActive = false;
    this.sessionStartTime = null;
    this.focusIntervals = [];
    this.currentFocusInterval = null;
    this.standbyStartTime = null;
    this.sessionTask = '';
    this.sessionReflections = [];
    this.pendingReflection = false;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';
    this.elements.sessionTaskInput.value = '';
    this.resetReflectionForm();
    this.saveSessionState();

    this.sendMessage({ type: 'sessionEnded' });
    
    // Refresh the sessions list
    await this.loadSessionsList();
    await this.updateTodaySummary();
    
    this.showStartScreen();
  }

  /**
   * Start a new focus interval when Play is clicked
   */
  startNewFocusInterval() {
    // Calculate standby duration from previous pause
    let standbyDuration = 0;
    if (this.standbyStartTime) {
      standbyDuration = Math.floor((Date.now() - this.standbyStartTime) / 1000);
    }
    
    this.currentFocusInterval = {
      startTime: Date.now(),
      focusDuration: 0,
      standbyDuration: standbyDuration,
    };
    this.standbyStartTime = null;
    
    this.saveSessionState();
    this.updateFocusIntervalsDisplay();
  }

  /**
   * End the current focus interval when Pause is clicked
   */
  endCurrentFocusInterval() {
    if (!this.currentFocusInterval) return;
    
    // Calculate focus duration
    this.currentFocusInterval.focusDuration = Math.floor((Date.now() - this.currentFocusInterval.startTime) / 1000);
    
    // Add to focusIntervals array
    this.focusIntervals.push(this.currentFocusInterval);
    this.currentFocusInterval = null;
    
    // Start standby
    this.standbyStartTime = Date.now();
    
    this.saveSessionState();
    this.updateFocusIntervalsDisplay();
  }

  /**
   * Increment the current focus interval's duration (called every second)
   */
  incrementFocusDuration() {
    if (this.currentFocusInterval) {
      this.currentFocusInterval.focusDuration++;
    }
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

  getNumericRatio(focus, standby) {
    if (standby === 0) {
      return focus > 0 ? Number.POSITIVE_INFINITY : null;
    }

    return focus / standby;
  }

  getRatioClass(focus, standby) {
    const ratio = this.getNumericRatio(focus, standby);

    if (ratio === null) return 'ratio-neutral';
    if (ratio < 1) return 'ratio-negative';
    return 'ratio-positive';
  }

  formatAverageRatio(ratios) {
    const finiteRatios = ratios.filter((ratio) => Number.isFinite(ratio));

    if (finiteRatios.length > 0) {
      const average = finiteRatios.reduce((sum, ratio) => sum + ratio, 0) / finiteRatios.length;
      return `${average.toFixed(1)}x`;
    }

    return ratios.some((ratio) => ratio === Number.POSITIVE_INFINITY) ? '∞x' : '—';
  }

  playCompletionSound() {
    if (this.playCustomNotificationSound()) {
      return;
    }

    this.playFallbackCompletionTone();
  }

  playCustomNotificationSound() {
    if (!this.audioUnlocked || !this.audioContext || !this.notificationAudioBuffer) {
      return false;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 1;
      source.buffer = this.notificationAudioBuffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
      return true;
    } catch (error) {
      console.warn('Unable to play custom notification sound:', error);
      return false;
    }
  }

  async unlockAudioPlayback() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.audioUnlocked = this.audioContext.state === 'running';

      if (this.audioUnlocked && !this.notificationAudioBuffer) {
        await this.preloadNotificationSound();
      }
    } catch (error) {
      console.warn('Unable to unlock audio playback:', error);
    }
  }

  async preloadNotificationSound() {
    try {
      if (!this.audioContext || this.notificationAudioBuffer) {
        return;
      }

      const response = await fetch(chrome.runtime.getURL('notification.aac'));
      const audioData = await response.arrayBuffer();
      this.notificationAudioBuffer = await this.audioContext.decodeAudioData(audioData.slice(0));
    } catch (error) {
      console.warn('Unable to preload custom notification sound:', error);
      this.notificationAudioBuffer = null;
    }
  }

  playFallbackCompletionTone() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      gainNode.connect(this.audioContext.destination);

      const frequencies = [523.25, 659.25];
      frequencies.forEach((frequency, index) => {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now + (index * 0.12));
        oscillator.connect(gainNode);
        oscillator.start(now + (index * 0.12));
        oscillator.stop(now + 0.3 + (index * 0.12));
      });
    } catch (error) {
      console.warn('Unable to play completion sound:', error);
    }
  }

  saveSessionState() {
    const sessionState = {
      isActive: this.sessionActive,
      startTime: this.sessionStartTime,
      sessionTask: this.sessionTask,
      sessionReflections: this.sessionReflections,
      pendingReflection: this.pendingReflection,
      pendingSessionEnd: this.pendingSessionEnd,
      reflectionContext: this.reflectionContext,
      focusIntervals: this.focusIntervals,
      currentFocusInterval: this.currentFocusInterval,
      standbyStartTime: this.standbyStartTime,
    };
    chrome.storage.local.set({ sessionState });
    this.sendMessage({ type: 'setSessionState', sessionState });
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
        el.totalRatio.textContent = '—';
        el.totalRatio.className = 'total-ratio ratio-neutral';
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
      const sessionRatios = [];
      
      // Show last 20 sessions grouped by date
      const sessionsByDate = {};
      sessions.slice(0, 20).forEach(session => {
        const focusTime = DB.getSessionFocusTime(session);
        const standbyTime = DB.getSessionStandbyTime(session);

        totalWork += focusTime;
        totalStandby += standbyTime;

        const ratio = this.getNumericRatio(focusTime, standbyTime);
        if (ratio !== null) {
          sessionRatios.push(ratio);
        }
        
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
      el.totalRatio.textContent = this.formatAverageRatio(sessionRatios);
      el.totalRatio.className = `total-ratio ${this.getRatioClass(totalWork, totalStandby)}`;
      
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
      return this.t('labels.today');
    } else if (dateString === yesterday.toDateString()) {
      return this.t('labels.yesterday');
    } else {
      return date.toLocaleDateString(this.getLocale(), { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  createSessionRow(session) {
    const row = document.createElement('div');
    row.className = 'session-row';
    
    const sessionFocusTime = DB.getSessionFocusTime(session);
    const sessionStandbyTime = DB.getSessionStandbyTime(session);
    const ratioText = this.formatRatio(sessionFocusTime, sessionStandbyTime);
    const ratioClass = this.getRatioClass(sessionFocusTime, sessionStandbyTime);
    const intervalCount = session.focusIntervals ? session.focusIntervals.length : 0;
    
    const time = new Date(session.timestamp).toLocaleTimeString(this.getLocale(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Session summary row (click to expand)
    const summaryRow = document.createElement('div');
    summaryRow.className = 'session-summary';
    summaryRow.innerHTML = `
      <div class="session-summary-main">
        <span class="expand-icon">▶</span>
        <span class="session-time">${time}</span>
        <span class="session-intervals">${intervalCount} ${this.t('labels.focusCount')}</span>
        <button class="session-edit-btn" type="button" title="${this.t('titles.editSession')}" aria-label="${this.t('titles.editSession')}">
          <svg class="session-action-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button class="session-delete-btn" type="button" title="${this.t('titles.deleteSession')}">×</button>
      </div>
      <div class="session-summary-totals">
        <span class="session-work">${this.formatTimeDetailed(sessionFocusTime)}</span>
        <span class="session-standby">${this.formatTimeDetailed(sessionStandbyTime)}</span>
        <span class="session-ratio ${ratioClass}">${ratioText}</span>
      </div>
    `;
    
    // Details container (hidden by default)
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'session-details hidden';
    let hasTextSections = false;

    if (session.task && session.task.trim()) {
      const taskPreview = document.createElement('div');
      taskPreview.className = 'session-task-preview';
      taskPreview.innerHTML = `
        <h3 class="session-task-question">${this.escapeHtml(this.t('forms.sessionTaskExpanded'))}</h3>
        <p class="session-task-answer">${this.escapeHtml(session.task.trim())}</p>
      `;
      detailsContainer.appendChild(taskPreview);
      hasTextSections = true;
    }

    if (session.reflections && session.reflections.length > 0) {
      session.reflections.forEach((reflection, index) => {
        const reflectionBlock = document.createElement('div');
        reflectionBlock.className = 'session-task-preview';
        reflectionBlock.innerHTML = `
          <h3 class="session-task-question">${this.escapeHtml(this.t('labels.postFocusReflection', { index: index + 1 }))}</h3>
          <p class="session-task-answer">${this.escapeHtml(this.t('labels.motivation'))}: ${reflection.motivation}/5</p>
          <p class="session-task-answer">${this.escapeHtml(this.t('labels.meaningfulProgress'))}: ${reflection.meaning}/5</p>
          <p class="session-task-answer">${this.escapeHtml(reflection.event)}</p>
        `;
        detailsContainer.appendChild(reflectionBlock);
        hasTextSections = true;
      });
    }
    
    // Focus intervals list
    if (session.focusIntervals && session.focusIntervals.length > 0) {
      if (hasTextSections) {
        const divider = document.createElement('div');
        divider.className = 'session-details-divider';
        detailsContainer.appendChild(divider);
      }

      session.focusIntervals.forEach((interval, index) => {
        const intervalFocus = interval.focusDuration || 0;
        const intervalStandby = interval.standbyDuration || 0;
        const intervalRatioClass = this.getRatioClass(intervalFocus, intervalStandby);
        const intervalRow = document.createElement('div');
        intervalRow.className = 'session-detail-row';
        const startTime = new Date(interval.startTime).toLocaleTimeString(this.getLocale(), {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        intervalRow.innerHTML = `
          <span class="interval-start">${startTime}</span>
          <span class="interval-focus">${this.formatTimeDetailed(intervalFocus)}</span>
          <span class="interval-standby">${this.formatTimeDetailed(intervalStandby)}</span>
          <span class="interval-ratio ${intervalRatioClass}">${this.formatRatio(intervalFocus, intervalStandby)}</span>
        `;
        detailsContainer.appendChild(intervalRow);
      });
    }
    
    // Toggle expand/collapse on click
    summaryRow.addEventListener('click', () => {
      const isHidden = detailsContainer.classList.toggle('hidden');
      summaryRow.querySelector('.expand-icon').textContent = isHidden ? '▶' : '▼';
    });

    const deleteButton = summaryRow.querySelector('.session-delete-btn');
    deleteButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      await this.deleteSession(session.timestamp);
    });

    const editButton = summaryRow.querySelector('.session-edit-btn');
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.openSessionEditModal(session);
    });
    
    row.appendChild(summaryRow);
    row.appendChild(detailsContainer);
    
    return row;
  }

  openSessionEditModal(session) {
    const form = this.elements.sessionEditForm;
    form.innerHTML = '';
    form.dataset.sessionTimestamp = String(session.timestamp);
    this.populateSessionEditForm(session, form);
    this.elements.sessionEditModal.classList.remove('hidden');
    form.querySelector('textarea, input, button')?.focus();
  }

  closeSessionEditModal() {
    this.elements.sessionEditModal.classList.add('hidden');
    this.elements.sessionEditForm.innerHTML = '';
    delete this.elements.sessionEditForm.dataset.sessionTimestamp;
  }

  populateSessionEditForm(session, form) {
    const taskLabel = document.createElement('label');
    taskLabel.className = 'session-task-label';
    taskLabel.textContent = this.t('forms.sessionTaskExpanded');

    const taskInput = document.createElement('textarea');
    taskInput.className = 'session-task-input';
    taskInput.name = 'task';
    taskInput.rows = 3;
    taskInput.value = session.task || '';

    form.appendChild(taskLabel);
    form.appendChild(taskInput);

    const intervals = Array.isArray(session.focusIntervals) ? session.focusIntervals : [];
    intervals.forEach((interval, index) => {
      const intervalEditor = document.createElement('div');
      intervalEditor.className = 'session-edit-interval';

      const title = document.createElement('span');
      title.className = 'session-edit-interval-title';
      title.textContent = `${this.t('labels.focus')} ${index + 1}`;

      intervalEditor.appendChild(title);
      intervalEditor.appendChild(this.createNumberField(
        `${this.t('labels.focus')} (s)`,
        `interval-${index}-focus`,
        interval.focusDuration || 0,
        { min: 0 },
      ));
      intervalEditor.appendChild(this.createNumberField(
        `${this.t('labels.wait')} (s)`,
        `interval-${index}-standby`,
        interval.standbyDuration || 0,
        { min: 0 },
      ));
      form.appendChild(intervalEditor);
    });

    const reflections = Array.isArray(session.reflections) ? session.reflections : [];
    reflections.forEach((reflection, index) => {
      const reflectionEditor = document.createElement('div');
      reflectionEditor.className = 'session-edit-reflection';

      const title = document.createElement('span');
      title.className = 'session-edit-interval-title';
      title.textContent = this.t('labels.postFocusReflection', { index: index + 1 });

      reflectionEditor.appendChild(title);
      reflectionEditor.appendChild(this.createNumberField(
        this.t('labels.motivation'),
        `reflection-${index}-motivation`,
        reflection.motivation || '',
        { min: 1, max: 5 },
      ));
      reflectionEditor.appendChild(this.createNumberField(
        this.t('labels.meaningfulProgress'),
        `reflection-${index}-meaning`,
        reflection.meaning || '',
        { min: 1, max: 5 },
      ));

      const eventInput = document.createElement('textarea');
      eventInput.className = 'session-task-input';
      eventInput.name = `reflection-${index}-event`;
      eventInput.rows = 2;
      eventInput.value = reflection.event || '';
      reflectionEditor.appendChild(eventInput);
      form.appendChild(reflectionEditor);
    });

    const actions = document.createElement('div');
    actions.className = 'reflection-actions';
    actions.innerHTML = `
      <button class="control-btn reflection-submit-btn" type="submit">${this.escapeHtml(this.t('actions.saveSession'))}</button>
      <button class="control-btn reflection-cancel-btn" type="button">${this.escapeHtml(this.t('actions.cancel'))}</button>
    `;
    form.appendChild(actions);

    actions.querySelector('.reflection-cancel-btn').addEventListener('click', () => {
      this.closeSessionEditModal();
    });

    form.onsubmit = async (event) => {
      event.preventDefault();
      await this.saveSessionEdits(session, form);
    };
  }

  createNumberField(labelText, name, value, { min = null, max = null } = {}) {
    const label = document.createElement('label');
    const labelSpan = document.createElement('span');
    const input = document.createElement('input');

    labelSpan.textContent = labelText;
    input.type = 'number';
    input.step = '1';
    input.name = name;
    input.value = value;

    if (min !== null) {
      input.min = String(min);
    }

    if (max !== null) {
      input.max = String(max);
    }

    label.appendChild(labelSpan);
    label.appendChild(input);
    return label;
  }

  parseEditedDuration(value) {
    const duration = Number(value);
    if (!Number.isFinite(duration) || duration < 0) {
      return 0;
    }

    return Math.floor(duration);
  }

  parseEditedScaleValue(value, fallback) {
    const score = Number(value);
    if (!Number.isFinite(score)) {
      return fallback;
    }

    return Math.min(5, Math.max(1, Math.round(score)));
  }

  async saveSessionEdits(session, form) {
    const formData = new FormData(form);
    const intervals = Array.isArray(session.focusIntervals) ? session.focusIntervals : [];
    const reflections = Array.isArray(session.reflections) ? session.reflections : [];

    const updatedIntervals = intervals.map((interval, index) => ({
      ...interval,
      focusDuration: this.parseEditedDuration(formData.get(`interval-${index}-focus`)),
      standbyDuration: this.parseEditedDuration(formData.get(`interval-${index}-standby`)),
    }));

    const updatedReflections = reflections.map((reflection, index) => ({
      ...reflection,
      motivation: this.parseEditedScaleValue(formData.get(`reflection-${index}-motivation`), reflection.motivation),
      meaning: this.parseEditedScaleValue(formData.get(`reflection-${index}-meaning`), reflection.meaning),
      event: String(formData.get(`reflection-${index}-event`) || '').trim(),
    }));

    try {
      const updatedSession = await DB.updateSessionByTimestamp(session.timestamp, {
        task: String(formData.get('task') || '').trim(),
        focusIntervals: updatedIntervals,
        reflections: updatedReflections,
      });

      if (!updatedSession) {
        throw new Error('Session not found');
      }

      await this.loadSessionsList();
      await this.updateTodaySummary();
      this.closeSessionEditModal();
    } catch (error) {
      console.error('Error updating session:', error);
      alert(this.t('messages.updateFailed'));
    }
  }

  async deleteSession(timestamp) {
    if (!confirm(this.t('messages.confirmDeleteSession'))) {
      return;
    }

    try {
      await DB.deleteSessionByTimestamp(timestamp);
      await this.loadSessionsList();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  /**
   * Update the focus intervals display in the timer screen
   */
  updateFocusIntervalsDisplay() {
    const el = this.elements;
    
    el.statsList.innerHTML = '';
    
    // Show all focus intervals
    this.focusIntervals.forEach((interval) => {
      const intervalFocus = interval.focusDuration || 0;
      const intervalStandby = interval.standbyDuration || 0;
      const intervalRatioClass = this.getRatioClass(intervalFocus, intervalStandby);
      const row = document.createElement('div');
      row.className = 'session-interval-row';
      const startTime = new Date(interval.startTime).toLocaleTimeString(this.getLocale(), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      row.innerHTML = `
        <span class="interval-start">${startTime}</span>
        <span class="interval-focus">${this.formatTimeShort(intervalFocus)}</span>
        <span class="interval-standby">${this.formatTimeShort(intervalStandby)}</span>
        <span class="interval-ratio ${intervalRatioClass}">${this.formatRatio(intervalFocus, intervalStandby)}</span>
      `;
      el.statsList.appendChild(row);
    });
    
    // Add current interval if running
    if (this.currentFocusInterval) {
      const intervalFocus = this.currentFocusInterval.focusDuration || 0;
      const intervalStandby = this.currentFocusInterval.standbyDuration || 0;
      const intervalRatioClass = this.getRatioClass(intervalFocus, intervalStandby);
      const row = document.createElement('div');
      row.className = 'session-interval-row';
      const startTime = new Date(this.currentFocusInterval.startTime).toLocaleTimeString(this.getLocale(), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      row.innerHTML = `
        <span class="interval-start">${startTime}</span>
        <span class="interval-focus">${this.formatTimeShort(intervalFocus)}</span>
        <span class="interval-standby">${this.formatTimeShort(intervalStandby)}</span>
        <span class="interval-ratio ${intervalRatioClass}">${this.formatRatio(intervalFocus, intervalStandby)}</span>
      `;
      el.statsList.appendChild(row);
    }
  }

  updateSessionTask(value) {
    this.sessionTask = value;
    if (this.sessionActive) {
      this.saveSessionState();
    }
  }

  updateReflectionState() {
    const el = this.elements;
    const isEndReflection = this.reflectionContext === 'end' || this.pendingSessionEnd;
    el.sessionReflectionForm.classList.toggle('hidden', !this.pendingReflection);
    el.sessionReflectionTitle.textContent = isEndReflection
      ? this.t('forms.reflectionBeforeEnd')
      : this.t('forms.reflectionBeforeNextBlock');
    el.reflectionSubmitBtn.textContent = isEndReflection
      ? this.t('actions.saveReflectionEnd')
      : this.t('actions.saveReflection');
    el.reflectionCancelBtn.classList.toggle('hidden', !isEndReflection);
    el.playBtn.disabled = this.pendingReflection;
    el.playBtn.title = this.pendingReflection
      ? (isEndReflection
          ? this.t('messages.reflectionRequiredEndSession')
          : this.t('messages.reflectionRequiredNextBlock'))
      : this.t('titles.startPause');
  }

  resetReflectionForm() {
    const el = this.elements;
    el.sessionReflectionForm.reset();
    el.sessionReflectionEvent.value = '';
  }

  cancelPendingEndSession() {
    if (!this.pendingSessionEnd) {
      return;
    }

    this.pendingReflection = false;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';
    this.resetReflectionForm();
    this.updateReflectionState();
    this.saveSessionState();
  }

  handleReflectionSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.elements.sessionReflectionForm);
    const motivation = Number(formData.get('motivation'));
    const meaning = Number(formData.get('meaning'));
    const reflectionEvent = this.elements.sessionReflectionEvent.value.trim();

    if (!motivation || !meaning || !reflectionEvent) {
      alert(this.t(this.pendingSessionEnd ? 'messages.reflectionRequiredEndSession' : 'messages.reflectionRequiredNextBlock'));
      return;
    }

    this.sessionReflections.push({
      completedAt: Date.now(),
      motivation,
      meaning,
      event: reflectionEvent,
    });
    this.pendingReflection = false;
    const shouldEndSession = this.pendingSessionEnd;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';
    this.resetReflectionForm();
    this.updateReflectionState();
    this.saveSessionState();

    if (shouldEndSession) {
      this.finalizeSessionEnd();
    }
  }

  escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  csvEscape(value) {
    const stringValue = String(value ?? '');
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  async exportSessionsCsv() {
    try {
      const sessions = await DB.getAllSessions();

      if (!sessions.length) {
        alert(this.t('messages.noSessionsToExport'));
        return;
      }

      const rows = [[
        'session_timestamp',
        'session_task',
        'session_focus_seconds',
        'session_wait_seconds',
        'session_ratio',
        'interval_index',
        'interval_start',
        'interval_focus_seconds',
        'interval_wait_seconds',
        'interval_ratio',
        'reflection_index',
        'motivation_score',
        'meaningful_progress_score',
        'standout_event'
      ]];

      sessions
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .forEach((session) => {
          const sessionFocus = DB.getSessionFocusTime(session);
          const sessionWait = DB.getSessionStandbyTime(session);
          const sessionRatio = this.formatRatio(sessionFocus, sessionWait);
          const task = session.task || '';
          const intervals = session.focusIntervals && session.focusIntervals.length
            ? session.focusIntervals
            : [null];
          const reflections = session.reflections && session.reflections.length
            ? session.reflections
            : [null];

          const maxRows = Math.max(intervals.length, reflections.length);

          Array.from({ length: maxRows }).forEach((_, index) => {
            const interval = intervals[index] || null;
            const reflection = reflections[index] || null;
            const intervalFocus = interval ? (interval.focusDuration || 0) : '';
            const intervalWait = interval ? (interval.standbyDuration || 0) : '';
            const intervalRatio = interval
              ? this.formatRatio(interval.focusDuration || 0, interval.standbyDuration || 0)
              : '';

            rows.push([
              new Date(session.timestamp).toISOString(),
              task,
              sessionFocus,
              sessionWait,
              sessionRatio,
              interval ? index + 1 : '',
              interval ? new Date(interval.startTime).toISOString() : '',
              intervalFocus,
              intervalWait,
              intervalRatio,
              reflection ? index + 1 : '',
              reflection ? reflection.motivation : '',
              reflection ? reflection.meaning : '',
              reflection ? reflection.event : ''
            ]);
          });
        });

      const csv = rows.map((row) => row.map((value) => this.csvEscape(value)).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `strtgy-focus-sessions-${dateStamp}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting sessions:', error);
      alert(this.t('messages.exportFailed'));
    }
  }

  /**
   * Footer totals are derived from the visible sessions list.
   */
  async updateTodaySummary() {
    return;
  }

  /**
   * Clear all sessions
   */
  async clearAllSessions() {
    if (!confirm(this.t('messages.confirmClearSessions'))) {
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

  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Runtime message failed:', chrome.runtime.lastError.message);
          resolve(null);
          return;
        }
        resolve(response);
      });
    });
  }

  async fetchStateFromBackground() {
    // Don't fetch if we have an active local timer - prevents race conditions
    if (this.interval || this.standbyInterval) return;
    
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
        this.timeLeft = bgState.timeLeft ?? this.timeLeft;
        this.totalTime = bgState.totalTime ?? this.totalTime;
        this.isRunning = false;
        this.stopBackgroundSync();
      }
      
      this.sessionType = bgState.sessionType || this.sessionType;
      this.workMinutes = bgState.workMinutes || this.workMinutes;
      
      this.updateDisplay();
      this.updatePie();
      this.updateProgress();
      this.updateControls();
      this.updateDuration();
      this.updateVisualState();
      
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

  startStandbyTicker() {
    if (this.standbyInterval) {
      clearInterval(this.standbyInterval);
    }

    this.standbyInterval = setInterval(() => {
      this.updateDisplay();
    }, 1000);
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
        this.language = parsed.language || 'en';
      }
      
      await this.sendMessage({ type: 'updateConfig', workMinutes: this.workMinutes });
      await this.fetchStateFromBackground();

      if (!this.totalTime) {
        this.totalTime = this.workMinutes * 60;
        this.timeLeft = this.totalTime;
        await this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
      }

      await this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
      this.updateDuration();
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }

  saveData() {
    const data = {
      workMinutes: this.workMinutes,
      theme: this.theme,
      language: this.language,
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
    const themeLabelKey = this.theme === 'system' ? 'theme.auto' : `theme.${this.theme}`;
    el.theme.textContent = this.t(themeLabelKey);
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
    if (this.pendingReflection) {
      this.reflectionContext = this.pendingSessionEnd ? 'end' : 'resume';
      this.elements.sessionReflectionForm.classList.remove('hidden');
      this.elements.sessionReflectionEvent.focus();
      return;
    }

    this.isRunning = true;
    const el = this.elements;
    el.playBtn.classList.add('playing');

    // Clear standby interval if running
    if (this.standbyInterval) {
      clearInterval(this.standbyInterval);
      this.standbyInterval = null;
    }

    // Reset cycle times for new focus period
    this.cycleFocusTime = 0;
    this.cycleStandbyTime = 0;
    this.cycleStandbyStartTime = null;

    // Start a new focus interval
    this.startNewFocusInterval();

    this.startBackgroundSync();

    this.interval = setInterval(() => {
      this.timeLeft--;
      
      // Increment focus duration
      this.incrementFocusDuration();
      
      this.updateDisplay();
      this.updatePie();
      this.updateProgress();
      this.updateFocusIntervalsDisplay();

      this.sendMessage({ type: 'tick' });

      if (this.timeLeft <= 0) {
        this.playCompletionSound();
        this.completeSession();
      }
    }, 1000);

    this.sendMessage({ type: 'start' });
    this.updateDisplay();
    this.updatePie();
    this.updateProgress();
    this.updateFocusIntervalsDisplay();
    this.updateVisualState();
    this.updateReflectionState();
  }

  pauseTimer() {
    return this.stopTimer({
      recordFocus: true,
      startStandby: true,
      syncBackground: true,
    });
  }

  stopTimer({ recordFocus = true, startStandby = true, syncBackground = true } = {}) {
    this.isRunning = false;
    const el = this.elements;
    el.playBtn.classList.remove('playing');
    clearInterval(this.interval);
    this.interval = null;
    this.stopBackgroundSync();

    if (recordFocus) {
      this.endCurrentFocusInterval();
    }

    if (startStandby && this.sessionActive) {
      if (!this.standbyStartTime) {
        this.standbyStartTime = Date.now();
        this.saveSessionState();
      }
      this.startStandbyTicker();
    } else if (this.standbyInterval) {
      clearInterval(this.standbyInterval);
      this.standbyInterval = null;
    }

    this.updateDisplay();
    this.updatePie();
    this.updateProgress();
    this.updateFocusIntervalsDisplay();
    this.updateVisualState();
    this.updateReflectionState();
    if (syncBackground) {
      this.sendMessage({ type: 'pause' });
    }
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
    // End current focus interval if running
    this.endCurrentFocusInterval();
    
    this.pauseTimer();
    this.completeSession();
    
    await this.loadSessionsList();
    await this.updateTodaySummary();
  }

  async completeSession() {
    const completedSessionType = this.sessionType;
    this.stopTimer({
      recordFocus: true,
      startStandby: false,
      syncBackground: true,
    });
    this.sessionType = 'work';
    this.timeLeft = this.workMinutes * 60;
    this.standbyStartTime = Date.now();
    this.totalTime = this.timeLeft;
    this.pendingReflection = true;
    this.pendingSessionEnd = false;
    this.reflectionContext = 'resume';
    this.saveSessionState();
    this.startStandbyTicker();
    this.resetReflectionForm();
    this.updateDisplay();
    this.updatePie();
    this.updateProgress();
    this.updateFocusIntervalsDisplay();
    this.updateVisualState();
    this.updateReflectionState();
    this.updateControls();
    await this.loadSessionsList();
    await this.updateTodaySummary();

    this.sendMessage({ type: 'setSessionType', sessionType: this.sessionType });
    this.sendMessage({ type: 'updateTime', timeLeft: this.timeLeft, totalTime: this.totalTime });
    this.sendMessage({ type: 'notifyCompletion', sessionType: completedSessionType });
  }

  updateDisplay() {
    const el = this.elements;
    let minutes, seconds;
    
    if (this.isRunning) {
      // Focus mode: countdown
      minutes = Math.floor(this.timeLeft / 60);
      seconds = this.timeLeft % 60;
    } else if (this.standbyStartTime) {
      // Standby mode: count up
      const standbySeconds = Math.floor((Date.now() - this.standbyStartTime) / 1000);
      minutes = Math.floor(standbySeconds / 60);
      seconds = standbySeconds % 60;
    } else {
      // No active state
      minutes = Math.floor(this.timeLeft / 60);
      seconds = this.timeLeft % 60;
    }

    this.updateDigitPair(el.minTens, el.minUnits, minutes);
    this.updateDigitPair(el.secTens, el.secUnits, seconds);
  }
  
  updateDigitPair(tensContainer, unitsContainer, value) {
    const tensValue = Math.floor(value / 10).toString();
    const unitsValue = (value % 10).toString();
    
    if (tensContainer.textContent !== tensValue) {
      tensContainer.textContent = tensValue;
    }
    if (unitsContainer.textContent !== unitsValue) {
      unitsContainer.textContent = unitsValue;
    }
  }

  updateVisualState() {
    const el = this.elements;
    const isStandby = !this.isRunning && this.standbyStartTime;
    
    // Toggle standby mode class on timer circle
    el.timerCircle.classList.toggle('standby-mode', isStandby);
    
    // Toggle standby label
    if (el.standbyLabel) {
      el.standbyLabel.classList.toggle('hidden', !isStandby);
    }
  }
  

  updateControls() {
    const el = this.elements;
    el.duration.classList.toggle('disabled', this.isRunning);
  }

  updatePie() {
    const el = this.elements;
    const cx = 150, cy = 150, radius = 140;
    
    // No active session - clear pie
    if (!this.sessionActive || !this.isRunning) {
      el.pieFill.setAttribute('d', '');
      return;
    }
    
    // Focus mode: yellow pie fills based on elapsed focus time
    // Full circle after selected duration (5/25/50/90 minutes)
    const elapsedFocus = this.totalTime - this.timeLeft;
    const focusProgress = Math.min(elapsedFocus / this.totalTime, 1);
    const yellowAngle = focusProgress * 360;
    
    const drawYellowSlice = (sweepDeg) => {
      if (sweepDeg <= 0.1) return '';
      if (sweepDeg >= 359.9) {
        return `M ${cx} ${cy} L ${cx} ${(cy - radius).toFixed(2)} A ${radius} ${radius} 0 1 1 ${cx} ${(cy + radius).toFixed(2)} A ${radius} ${radius} 0 1 1 ${cx} ${(cy - radius).toFixed(2)} Z`;
      }
      
      const startRad = -Math.PI / 2; // 12 o'clock
      const endRad = startRad + (sweepDeg * Math.PI / 180);
      
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      const large = sweepDeg > 180 ? 1 : 0;
      
      return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    };
    
    el.pieFill.setAttribute('d', drawYellowSlice(yellowAngle));
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
