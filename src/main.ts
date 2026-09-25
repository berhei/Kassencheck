import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/ibm-plex-mono/500.css';
import { createIcons, Download, Minus, Moon, Plus, RotateCcw, Share2, Sun, Trash2 } from 'lucide';
import { countedTotal, DENOMINATIONS, emptyCount, isCashCount, parseExpected, type CashCount, type Denomination } from './cash';
import { labels, money, type Language } from './labels';
import { createReceipt } from './receipt';
import './style.css';

const DRAFT_KEY = 'kassencheck:draft:v1';
const LANGUAGE_KEY = 'kassencheck:language';
const THEME_KEY = 'kassencheck:theme';
const app = document.querySelector<HTMLDivElement>('#app')!;
let draft: CashCount = emptyCount();
let language: Language = 'de';
let theme: 'light' | 'dark' = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
let working = false;

try {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved) {
    const parsed: unknown = JSON.parse(saved);
    if (isCashCount(parsed)) draft = parsed;
  }
  language = localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'de';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
} catch {
  // Private browsing can make storage unavailable; counting still works in this tab.
}

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!);

function store(): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    announce(labels[language].storageFailed);
  }
}

function announce(message: string): void {
  const status = document.querySelector<HTMLElement>('#status');
  if (status) status.textContent = message;
}

function render(): void {
  const text = labels[language];
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171d1b' : '#f4f5f1');
  document.title = `Kassencheck | ${text.title}`;
  const rows = (values: readonly Denomination[]) => values.map((value) => `
    <div class="cash-row" data-row="${value}">
      <div class="denomination"><span class="token ${value >= 500 ? 'note' : 'coin'}">${value >= 100 ? '€' : 'ct'}</span><strong>${money(value, language)}</strong></div>
      <div class="stepper">
        <button type="button" class="step-button" data-step="-1" data-value="${value}" aria-label="${escapeHtml(text.quantity)} ${money(value, language)} −1" title="−1"><i data-lucide="minus"></i></button>
        <input id="count-${value}" data-count="${value}" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="${escapeHtml(text.quantity)} ${money(value, language)}" value="${draft.counts[value]}" />
        <button type="button" class="step-button" data-step="1" data-value="${value}" aria-label="${escapeHtml(text.quantity)} ${money(value, language)} +1" title="+1"><i data-lucide="plus"></i></button>
      </div>
      <span class="row-total" data-subtotal="${value}">${money(value * draft.counts[value], language)}</span>
    </div>`).join('');

  app.innerHTML = `
    <header class="site-header">
      <div class="header-inner"><div class="brand"><span class="brand-mark">K<span>+</span></span><span>KASSENCHECK</span></div>
        <div class="header-actions"><button type="button" class="theme-toggle" data-action="theme" aria-label="${text.darkMode}" aria-pressed="${theme === 'dark'}" title="${theme === 'dark' ? text.enableLight : text.enableDark}"><i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}"></i></button>
          <div class="language-switch" role="group" aria-label="Language / Sprache">
            <button type="button" data-lang="de" aria-pressed="${language === 'de'}">DE</button>
            <button type="button" data-lang="en" aria-pressed="${language === 'en'}">EN</button>
          </div>
        </div>
      </div>
    </header>
    <main class="workspace">
      <div class="workspace-heading"><div><span class="eyebrow">01 / KASSENCHECK</span><h1>${text.title}</h1></div><span class="storage-indicator"><span class="indicator-dot"></span>${text.local}</span></div>
      <div class="workspace-grid">
        <section class="entry" aria-label="${text.title}">
          <div class="metadata">
            <label>${text.register}<input data-field="register" type="text" maxlength="80" placeholder="${text.registerPlaceholder}" value="${escapeHtml(draft.register)}" autocomplete="off" /></label>
            <label>${text.counter}<input data-field="counter" type="text" maxlength="80" placeholder="${text.counterPlaceholder}" value="${escapeHtml(draft.counter)}" autocomplete="off" /></label>
          </div>
          <div class="table-heading"><span>${text.denomination}</span><span>${text.quantity}</span><span>${text.subtotal}</span></div>
          <div class="group-heading"><span class="group-line"></span>${text.notes}</div>
          <div class="cash-rows">${rows(DENOMINATIONS.filter((value) => value >= 500))}</div>
          <div class="group-heading"><span class="group-line"></span>${text.coins}</div>
          <div class="cash-rows">${rows(DENOMINATIONS.filter((value) => value < 500))}</div>
        </section>
        <aside class="summary" id="summary">
          <div class="summary-top"><span class="eyebrow">02 / ${text.total.toUpperCase()}</span><div class="summary-amount" id="total"></div><span class="summary-caption" id="empty-note"></span></div>
          <div class="summary-body"><label for="expected">${text.expected}</label><div class="expected-input"><span>€</span><input id="expected" data-field="expected" type="text" inputmode="decimal" autocomplete="off" placeholder="${text.expectedPlaceholder}" value="${escapeHtml(draft.expected)}" aria-describedby="expected-error" /></div><span class="field-error" id="expected-error" role="alert"></span>
            <div class="difference"><span>${text.difference}</span><strong id="difference-value"></strong></div>
            <div class="export-actions"><button class="primary-button" type="button" data-action="share"><i data-lucide="share-2"></i>${text.share}</button><button class="secondary-button" type="button" data-action="download"><i data-lucide="download"></i>${text.download}</button></div>
            <div class="reset-actions"><button type="button" data-action="new"><i data-lucide="rotate-ccw"></i>${text.newCount}</button><button type="button" data-action="delete"><i data-lucide="trash-2"></i>${text.deleteDraft}</button></div>
          </div>
        </aside>
      </div>
      <a class="mobile-total" href="#summary"><span>${text.total}</span><strong id="mobile-total-value"></strong><span aria-hidden="true">↑</span></a>
      <div id="status" class="status-message" role="status" aria-live="polite"></div>
    </main>`;
  createIcons({ icons: { Download, Minus, Moon, Plus, RotateCcw, Share2, Sun, Trash2 }, attrs: { 'stroke-width': 1.8 } });
  updateSummary();
}

function updateSummary(): void {
  const text = labels[language];
  const total = countedTotal(draft.counts);
  document.querySelector<HTMLElement>('#total')!.textContent = money(total, language);
  document.querySelector<HTMLElement>('#mobile-total-value')!.textContent = money(total, language);
  document.querySelector<HTMLElement>('#empty-note')!.textContent = total === 0 ? text.empty : '';
  const expected = parseExpected(draft.expected);
  const invalid = draft.expected.trim() !== '' && expected === null;
  const error = document.querySelector<HTMLElement>('#expected-error')!;
  error.textContent = invalid ? text.expectedError : '';
  document.querySelector<HTMLInputElement>('#expected')!.setAttribute('aria-invalid', String(invalid));
  const difference = document.querySelector<HTMLElement>('#difference-value')!;
  difference.textContent = expected === null ? text.noExpected : money(total - expected, language);
  difference.classList.toggle('negative', expected !== null && total < expected);
  difference.classList.toggle('muted', expected === null);
  app.querySelectorAll<HTMLButtonElement>('[data-action="share"], [data-action="download"]').forEach((button) => {
    button.disabled = invalid || working;
  });
}

app.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const field = target.dataset.field;
  if (field === 'register' || field === 'counter' || field === 'expected') {
    draft[field] = target.value;
    store();
    if (field === 'expected') updateSummary();
    return;
  }
  const denomination = Number(target.dataset.count) as Denomination;
  if (!DENOMINATIONS.includes(denomination)) return;
  if (!/^\d*$/.test(target.value)) return;
  const quantity = target.value === '' ? 0 : Number(target.value);
  if (!Number.isSafeInteger(quantity) || !Number.isSafeInteger(quantity * denomination)) return;
  draft.counts[denomination] = quantity;
  document.querySelector<HTMLElement>(`[data-subtotal="${denomination}"]`)!.textContent = money(denomination * quantity, language);
  store();
  updateSummary();
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.dataset.count) return;
  const denomination = Number(target.dataset.count) as Denomination;
  target.value = String(draft.counts[denomination]);
});

app.addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!button) return;
  if (button.dataset.action === 'theme') {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* Optional preference. */ }
    render();
    return;
  }
  if (button.dataset.lang === 'de' || button.dataset.lang === 'en') {
    language = button.dataset.lang;
    const expected = parseExpected(draft.expected);
    if (expected !== null) {
      draft.expected = (expected / 100).toFixed(2).replace('.', language === 'de' ? ',' : '.');
      store();
    }
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Optional preference. */ }
    render();
    return;
  }
  if (button.dataset.step) {
    const denomination = Number(button.dataset.value) as Denomination;
    const next = draft.counts[denomination] + Number(button.dataset.step);
    if (next < 0 || !Number.isSafeInteger(next * denomination)) return;
    draft.counts[denomination] = next;
    document.querySelector<HTMLInputElement>(`[data-count="${denomination}"]`)!.value = String(next);
    document.querySelector<HTMLElement>(`[data-subtotal="${denomination}"]`)!.textContent = money(next * denomination, language);
    store();
    updateSummary();
    return;
  }
  if (button.dataset.action === 'new' || button.dataset.action === 'delete') {
    if (!window.confirm(labels[language][button.dataset.action === 'new' ? 'confirmNew' : 'confirmDelete'])) return;
    draft = emptyCount();
    if (button.dataset.action === 'delete') {
      try { localStorage.removeItem(DRAFT_KEY); } catch { announce(labels[language].storageFailed); }
    } else store();
    render();
    return;
  }
  if ((button.dataset.action !== 'share' && button.dataset.action !== 'download') || working) return;
  if (draft.expected.trim() && parseExpected(draft.expected) === null) return;
  working = true;
  updateSummary();
  try {
    const date = new Date();
    const blob = createReceipt(draft, language, date);
    const filename = `${labels[language].file}-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.png`;
    if (button.dataset.action === 'share') {
      const file = new File([blob], filename, { type: 'image/png' });
      if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
        announce(labels[language].shareFailed);
      } else {
        try {
          await navigator.share({ files: [file] });
          announce(labels[language].shared);
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) announce(labels[language].shareFailed);
        }
      }
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      announce(labels[language].saved);
    }
  } catch {
    announce(labels[language].exportFailed);
  } finally {
    working = false;
    updateSummary();
  }
});

render();