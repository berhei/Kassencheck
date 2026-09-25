import { describe, expect, it } from 'vitest';
import { countedTotal, emptyCount, isCashCount, parseExpected } from './cash';

describe('cash count', () => {
  it('counts every denomination in integer cents', () => {
    const draft = emptyCount();
    draft.counts[10] = 3;
    draft.counts[200] = 2;
    draft.counts[20000] = 1;
    expect(countedTotal(draft.counts)).toBe(20430);
  });

  it('parses optional euro amounts without floating point rounding', () => {
    expect(parseExpected('')).toBeNull();
    expect(parseExpected('12,34')).toBe(1234);
    expect(parseExpected('12.3')).toBe(1230);
    expect(parseExpected('-1')).toBeNull();
    expect(parseExpected('1,234')).toBeNull();
  });

  it('rejects malformed or negative saved drafts', () => {
    const draft = emptyCount();
    expect(isCashCount(draft)).toBe(true);
    draft.counts[50] = -1;
    expect(isCashCount(draft)).toBe(false);
    expect(isCashCount({ ...emptyCount(), counts: {} })).toBe(false);
  });
});