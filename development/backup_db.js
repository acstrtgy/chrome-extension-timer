/**
 * Session Storage Manager using localStorage
 * Simple and efficient for this use case
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
 * Add a new session
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
    totalFocusTime += s.focusTime || 0;
    totalStandbyTime += s.standbyTime || 0;
  });
  
  todaySessions.forEach(s => {
    todayFocusTime += s.focusTime || 0;
    todayStandbyTime += s.standbyTime || 0;
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
  getStatsSummary
};
