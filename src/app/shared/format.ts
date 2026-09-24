import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });

/** Vietnamese number formatting ("1.234,5"); "—" when the source has no data. */
export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatter.format(value);
}

@Pipe({ name: 'num' })
export class NumPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatNumber(value);
  }
}
