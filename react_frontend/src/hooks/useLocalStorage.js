import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useLocalStorage hook for persistent user data.
 * @param {string} key
 * @param {any} initialValue
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  return [storedValue, setValue];
}
