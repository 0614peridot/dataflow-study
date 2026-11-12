import { useEffect, useState } from 'react';

const PREFIX = 'si500-lumen:';

export function readSession(key, fallback) {
  try {
    const saved = window.sessionStorage.getItem(PREFIX + key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // The prototype still works if browser storage is unavailable.
  }
}

export function removeSession(key) {
  try {
    window.sessionStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function clearStudySession() {
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function useSessionValue(key, initialValue) {
  const [value, setValue] = useState(() => readSession(key, initialValue));

  useEffect(() => {
    writeSession(key, value);
  }, [key, value]);

  return [value, setValue];
}
