import { effect, signal, WritableSignal } from '@angular/core';

/**
 * A signal mirrored to localStorage. Storage is a convenience only: when it is unavailable
 * (private mode, blocked site data) the signal still works in memory.
 */
export function persistedSignal<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): WritableSignal<T> {
  const state = signal<T>(read(key, initial, isValid));
  effect(() => {
    const value = state();
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore: persistence is best-effort.
    }
  });
  return state;
}

function read<T>(key: string, initial: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initial;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : initial;
  } catch {
    return initial;
  }
}
