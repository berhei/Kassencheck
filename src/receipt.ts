import { countedTotal, DENOMINATIONS, parseExpected, type CashCount } from './cash';
import { labels, money, type Language } from './labels';

export function createReceipt(draft: CashCount, language: Language, date: Date): Blob {
  const text = labels[language];
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');

  context.font = '32px "DM Sans", sans-serif';
  const wrap = (value: string, width: number): string[] => {
    const lines: string[] = [];
    let line = '';
    for (const character of value) {
      if (context.measureText(line + character).width > width && line) {
        lines.push(line);
        line = '';
      }
      line += character;
    }
    if (line) lines.push(line);
    return lines;
  };
  const registerLines = draft.register.trim() ? wrap(draft.register.trim(), 940) : [];
  const counterLines = draft.counter.trim() ? wrap(draft.counter.trim(), 940) : [];
  canvas.height = 1620 + (registerLines.length + counterLines.length) * 43;
  context.fillStyle = '#f9faf7';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const line = (top: number) => {
    context.fillStyle = '#d9dfda';
    context.fillRect(76, top, 1048, 2);
  };
  const write = (value: string, left: number, top: number, size: number, color: string, align: CanvasTextAlign = 'left') => {
    context.font = `${size >= 44 ? '700' : '500'} ${size}px "DM Sans", sans-serif`;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(value, left, top);
  };

  context.fillStyle = '#13765f';
  context.fillRect(76, 72, 70, 8);
  write('KASSENCHECK', 76, 137, 28, '#13765f');
  write(text.record, 76, 238, 68, '#192b26');
  write(`${text.date}: ${new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short',
  }).format(date)}`, 76, 305, 29, '#52645d');

  let top = 388;
  for (const [label, lines] of [[text.register, registerLines], [text.counter, counterLines]] as const) {
    if (!lines.length) continue;
    write(label.toUpperCase(), 76, top, 22, '#52645d');
    top += 45;
    for (const value of lines) {
      write(value, 76, top, 32, '#192b26');
      top += 43;
    }
    top += 17;
  }
  top += 20;
  line(top);
  top += 55;
  write(text.denomination.toUpperCase(), 76, top, 21, '#52645d');
  write(text.quantity.toUpperCase(), 747, top, 21, '#52645d', 'right');
  write(text.subtotal.toUpperCase(), 1124, top, 21, '#52645d', 'right');
  top += 23;
  for (const denomination of DENOMINATIONS) {
    line(top);
    top += 49;
    write(money(denomination, language), 76, top, 30, '#192b26');
    write(String(draft.counts[denomination]), 747, top, 30, '#192b26', 'right');
    write(money(denomination * draft.counts[denomination], language), 1124, top, 30, '#192b26', 'right');
    top += 18;
  }

  line(top);
  top += 77;
  const total = countedTotal(draft.counts);
  write(text.total, 76, top, 33, '#192b26');
  write(money(total, language), 1124, top, 49, '#13765f', 'right');
  top += 71;
  if (draft.expected.trim()) {
    const expected = parseExpected(draft.expected);
    if (expected === null) throw new Error('Invalid expected balance');
    write(text.expected, 76, top, 29, '#52645d');
    write(money(expected, language), 1124, top, 29, '#192b26', 'right');
    top += 60;
    write(text.difference, 76, top, 29, '#52645d');
    write(money(total - expected, language), 1124, top, 33, total - expected < 0 ? '#ba553e' : '#13765f', 'right');
  }
  const encoded = canvas.toDataURL('image/png').split(',')[1];
  const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: 'image/png' });
}