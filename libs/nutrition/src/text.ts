/**
 * Lower-cases and strips Vietnamese diacritics so "ca chua" matches "Cà chua".
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim();
}

/** Rounds to at most `digits` decimals without float noise such as 5.8500000001. */
export function round(value: number, digits = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Scales a per-100 g value to `grams`. */
export function scaleValue(valuePer100g: number | null, grams: number): number | null {
  return valuePer100g === null ? null : round((valuePer100g * grams) / 100);
}
