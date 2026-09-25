export type Language = 'de' | 'en';

export const labels = {
  de: {
    title: 'Zählung', register: 'Kasse', registerPlaceholder: 'z. B. Theke 1 (optional)',
    counter: 'Gezählt von', counterPlaceholder: 'Name (optional)', expected: 'Sollbestand',
    expectedPlaceholder: '0,00', expectedError: 'Bitte einen gültigen Eurobetrag eingeben.',
    local: 'Lokal gespeichert', darkMode: 'Dunkelmodus', enableDark: 'Dunkelmodus einschalten', enableLight: 'Hellmodus einschalten', notes: 'Scheine', coins: 'Münzen', denomination: 'Stückelung',
    quantity: 'Anzahl', subtotal: 'Betrag', total: 'Gezählt', difference: 'Differenz',
    noExpected: 'Kein Sollbestand angegeben', share: 'Teilen', download: 'PNG speichern',
    newCount: 'Neue Zählung', deleteDraft: 'Entwurf löschen', empty: 'Noch kein Bargeld erfasst',
    confirmNew: 'Aktuelle Zählung ersetzen und einen neuen Entwurf beginnen?',
    confirmDelete: 'Aktuellen Entwurf und alle Eingaben löschen?',
    shared: 'Beleg geteilt.', saved: 'Bildbeleg gespeichert.',
    shareFailed: 'Teilen nicht verfügbar. Bitte das PNG speichern.',
    exportFailed: 'Der Bildbeleg konnte nicht erstellt werden.',
    storageFailed: 'Lokales Speichern ist in diesem Browser nicht verfügbar.',
    record: 'Zählbeleg', date: 'Erstellt am', file: 'kassencheck',
  },
  en: {
    title: 'Cash count', register: 'Register', registerPlaceholder: 'e.g. Front desk (optional)',
    counter: 'Counted by', counterPlaceholder: 'Name (optional)', expected: 'Expected balance',
    expectedPlaceholder: '0.00', expectedError: 'Enter a valid euro amount.',
    local: 'Saved locally', darkMode: 'Dark mode', enableDark: 'Switch to dark mode', enableLight: 'Switch to light mode', notes: 'Banknotes', coins: 'Coins', denomination: 'Denomination',
    quantity: 'Quantity', subtotal: 'Amount', total: 'Counted', difference: 'Difference',
    noExpected: 'No expected balance entered', share: 'Share', download: 'Save PNG',
    newCount: 'New count', deleteDraft: 'Delete draft', empty: 'No cash counted yet',
    confirmNew: 'Replace the current count with a new draft?',
    confirmDelete: 'Delete the current draft and all entries?',
    shared: 'Record shared.', saved: 'Image record saved.',
    shareFailed: 'Sharing is unavailable. Please save the PNG instead.',
    exportFailed: 'The image record could not be created.',
    storageFailed: 'Local storage is unavailable in this browser.',
    record: 'Count record', date: 'Created', file: 'cash-count',
  },
} as const;

export function money(cents: number, language: Language): string {
  return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-GB', {
    style: 'currency', currency: 'EUR',
  }).format(cents / 100);
}