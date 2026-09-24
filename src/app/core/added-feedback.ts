import { DestroyRef, inject, signal } from '@angular/core';

/** Remembers which item was just acted on, for a short "✓ Đã thêm" confirmation. */
export function addedFeedback(durationMs = 1500) {
  const current = signal<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;
  inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  return {
    current: current.asReadonly(),
    mark(id: string): void {
      current.set(id);
      clearTimeout(timer);
      timer = setTimeout(() => current.set(null), durationMs);
    },
  };
}
