export const DENOMINATIONS = [20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10] as const;

export type Denomination = (typeof DENOMINATIONS)[number];
export type Counts = Record<Denomination, number>;

export interface CashCount {
  counts: Counts;
  register: string;
  counter: string;
  expected: string;
}

export function emptyCount(): CashCount {
  return {
    counts: Object.fromEntries(DENOMINATIONS.map((value) => [value, 0])) as Counts,
    register: '',
    counter: '',
    expected: '',
  };
}

export function countedTotal(counts: Counts): number {
  return DENOMINATIONS.reduce((total, value) => total + value * counts[value], 0);
}

export function parseExpected(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(trimmed)) return null;
  const [euros, cents = ''] = trimmed.replace(',', '.').split('.');
  const result = Number(euros) * 100 + Number(cents.padEnd(2, '0'));
  return Number.isSafeInteger(result) ? result : null;
}

export function isCashCount(value: unknown): value is CashCount {
  if (!value || typeof value !== 'object') return false;
  const draft = value as Partial<CashCount>;
  return typeof draft.register === 'string' && typeof draft.counter === 'string' &&
    typeof draft.expected === 'string' && !!draft.counts &&
    DENOMINATIONS.every((denomination) => Number.isSafeInteger(draft.counts?.[denomination]) &&
      (draft.counts?.[denomination] ?? -1) >= 0) &&
    Number.isSafeInteger(countedTotal(draft.counts));
}