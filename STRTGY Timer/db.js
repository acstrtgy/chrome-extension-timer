/**
 * Session Storage Manager using localStorage
 * 
 * New Session Structure:
 * {
 *   timestamp: Date,           // Session start time
 *   focusIntervals: [
 *     {
 *       startTime: timestamp,      // When Play was clicked
 *       focusDuration: seconds,    // Time focused
 *       standbyDuration: seconds  // Time spent in standby before this focus
 *     },
 *     ...
 *   ]
 * }
 */

const STORAGE_KEY = 'pomodoroSessions';

/**
 * Get all sessions from localStorage
 */
function getAllSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading sessions:', e);
    return [];
  }
}

/**
 * Save all sessions to localStorage
 */
function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
}

/**
 * Add a new session with focus intervals
 */
function addSession(session) {
  const sessions = getAllSessions();
  sessions.push(session);
  
  // Keep only last 500 sessions
  if (sessions.length > 500) {
    sessions.splice(0, sessions.length - 500);
  }
  
  saveSessions(sessions);
  return session;
}

/**
 * Get sessions for today
 */
function getTodaySessions() {
  const sessions = getAllSessions();
  const today = new Date().toDateString();
  
  return sessions.filter(s => {
    const sessionDate = new Date(s.timestamp).toDateString();
    return sessionDate === today;
  });
}

/**
 * Get recent sessions (last N days)
 */
function getRecentSessions(days = 7) {
  const sessions = getAllSessions();
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  return sessions.filter(s => new Date(s.timestamp).getTime() >= cutoff);
}

/**
 * Clear all sessions
 */
function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Delete a specific session by index
 */
function deleteSession(index) {
  const sessions = getAllSessions();
  if (index >= 0 && index < sessions.length) {
    sessions.splice(index, 1);
    saveSessions(sessions);
  }
}

/**
 * Delete a specific session by timestamp
 */
function deleteSessionByTimestamp(timestamp) {
  const sessions = getAllSessions();
  const nextSessions = sessions.filter((session) => String(session.timestamp) !== String(timestamp));
  saveSessions(nextSessions);
}

/**
 * Update a specific session by timestamp
 */
function updateSessionByTimestamp(timestamp, updates) {
  const sessions = getAllSessions();
  const sessionIndex = sessions.findIndex((session) => String(session.timestamp) === String(timestamp));

  if (sessionIndex === -1) {
    return null;
  }

  const updatedSession = {
    ...sessions[sessionIndex],
    ...updates,
    timestamp: sessions[sessionIndex].timestamp,
  };

  sessions[sessionIndex] = updatedSession;
  saveSessions(sessions);
  return updatedSession;
}

/**
 * Calculate total focus time from session
 */
function getSessionFocusTime(session) {
  if (!session.focusIntervals || session.focusIntervals.length === 0) return 0;
  return session.focusIntervals.reduce((sum, interval) => sum + (interval.focusDuration || 0), 0);
}

/**
 * Calculate total standby time from session
 */
function getSessionStandbyTime(session) {
  if (!session.focusIntervals || session.focusIntervals.length === 0) return 0;
  return session.focusIntervals.reduce((sum, interval) => sum + (interval.standbyDuration || 0), 0);
}

/**
 * Get statistics summary
 */
function getStatsSummary() {
  const sessions = getAllSessions();
  const todaySessions = getTodaySessions();
  
  let totalFocusTime = 0;
  let totalStandbyTime = 0;
  let todayFocusTime = 0;
  let todayStandbyTime = 0;
  
  sessions.forEach(s => {
    totalFocusTime += getSessionFocusTime(s);
    totalStandbyTime += getSessionStandbyTime(s);
  });
  
  todaySessions.forEach(s => {
    todayFocusTime += getSessionFocusTime(s);
    todayStandbyTime += getSessionStandbyTime(s);
  });
  
  return {
    totalSessions: sessions.length,
    totalFocusTime,
    totalStandbyTime,
    totalTime: totalFocusTime + totalStandbyTime,
    todaySessions: todaySessions.length,
    todayFocusTime,
    todayStandbyTime,
    todayTime: todayFocusTime + todayStandbyTime,
  };
}

// Export functions for use in timer.js
window.DB = {
  getAllSessions,
  saveSessions,
  addSession,
  getTodaySessions,
  getRecentSessions,
  clearAllSessions,
  deleteSession,
  deleteSessionByTimestamp,
  updateSessionByTimestamp,
  getSessionFocusTime,
  getSessionStandbyTime,
  getStatsSummary
};
