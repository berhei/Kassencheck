# Kassencheck

Kassencheck is a browser-based tool for counting the full physical contents of one euro cash register. It totals coins from 10 cents to 2 euros and banknotes from 5 to 200 euros. An optional manually entered expected balance shows the signed difference; the app does not calculate balances from transactions.

![Test and deploy status](https://github.com/berhei/Kassencheck/actions/workflows/deploy.yml/badge.svg)

[English](#english) | [Deutsch](#deutsch)

## English

### Use

Open the [GitHub Pages site](https://berhei.github.io/Kassencheck/), enter the quantities per denomination using the numeric keyboard or plus/minus controls, and optionally enter a register label, counter name, and expected balance. The counter name and register label are not required. The interface defaults to German and can be switched to English. The moon/sun button toggles dark mode; the first visit follows the device setting, and your choice is remembered in this browser. The image record remains light for readability. Money, dates, and the exported image follow the selected language.

The total and, when an expected balance is provided, the difference update immediately. All eleven denominations appear in the image record, including quantities of zero. The record has a creation timestamp and contains no input controls. Use **Share** to send the PNG through a supported browser's native share sheet (including compatible iOS browsers), or **Save PNG** to download it. If file sharing is unavailable, use the download button.

One draft is kept in this browser's local storage and survives a reload. **New count** asks before replacing it; **Delete draft** asks before clearing it. Exporting does not remove the draft. This is not an audit-proof record or a stored history: download or share the image if you need to keep it. Anyone with access to the same browser profile can see the draft, including an optional counter name. The application has no accounts, server storage, or backend. A network connection is needed to load the site; offline startup is not provided.

### Development

Requires Node.js 22 or later. From the project root:

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run dev` starts Vite locally. `npm test` runs the Vitest calculation and draft-validation tests. `npm run build` typechecks the code and generates the static site in `dist/`. Vite uses relative asset paths so the result also works under a GitHub Pages project subpath. No backend or environment variables are needed.

### Deployment

1. Push the repository to GitHub with `main` as the default branch.
2. In **Settings > Pages > Build and deployment**, select **GitHub Actions** as the source.
3. The status badge above will start reporting results after the first workflow run.

The [Test and deploy workflow](.github/workflows/deploy.yml) runs on pull requests, pushes to `main`, and manual dispatch. It installs dependencies from the lockfile, runs tests, then typechecks and builds. A push or manual run deploys to GitHub Pages only if those checks succeed. Pull requests are checked but never deployed. The badge reports the workflow status; a failed test or build prevents publication.

## Deutsch

Kassencheck ist ein browserbasiertes Werkzeug, um den gesamten Bargeldbestand einer Euro-Kasse zu zählen. Es summiert Münzen von 10 Cent bis 2 Euro und Scheine von 5 bis 200 Euro. Ein optionaler, manuell eingegebener Sollbestand zeigt die Differenz mit Vorzeichen an; die App berechnet keinen Sollbestand aus Buchungen.

### Nutzung

Öffne die [GitHub-Pages-Seite](https://berhei.github.io/Kassencheck/) und gib die Stückzahl je Stückelung über die Zifferntastatur oder die Plus-/Minus-Tasten ein. Kassenbezeichnung, Name der zählenden Person und Sollbestand sind optional. Die Oberfläche ist standardmäßig auf Deutsch und lässt sich auf Englisch umschalten. Über die Mond-/Sonnen-Schaltfläche wechselst du zwischen Hell- und Dunkelmodus: Beim ersten Besuch gilt die Geräteeinstellung, danach merkt sich der Browser deine Auswahl. Der Bildbeleg bleibt für gute Lesbarkeit hell. Währungs- und Datumsformat sowie die Sprache des Bildbelegs richten sich nach der gewählten Sprache.

Die gezählte Summe und, falls ein Sollbestand eingegeben wurde, die Differenz werden sofort aktualisiert. Im Bildbeleg erscheinen alle elf Stückelungen, auch solche mit Stückzahl null. Er enthält den Erstellungszeitpunkt, aber keine Eingabefelder oder Schaltflächen. Über **Teilen** kannst du das PNG mit der nativen Teilen-Funktion eines unterstützten Browsers versenden (auch auf kompatiblen iOS-Browsern). Über **PNG speichern** lädst du es herunter, falls das Teilen von Dateien nicht verfügbar ist.

Der Browser speichert genau einen Entwurf lokal; er bleibt nach einem Neuladen erhalten. **Neue Zählung** fragt vor dem Ersetzen nach, **Entwurf löschen** vor dem Entfernen aller Eingaben. Ein Export löscht den Entwurf nicht. Die App führt weder eine Beleg-Historie noch erstellt sie revisionssichere Nachweise: Lade das Bild herunter oder teile es, wenn du es aufbewahren musst. Personen mit Zugriff auf dasselbe Browserprofil können den Entwurf einschließlich eines optional eingetragenen Namens sehen. Es gibt keine Benutzerkonten, keine serverseitige Speicherung und kein Backend. Zum Laden der Seite ist eine Internetverbindung erforderlich; ein vollständig offlinefähiger Start ist nicht vorgesehen.

### Entwicklung

Benötigt Node.js 22 oder neuer. Im Projektverzeichnis:

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run dev` startet Vite lokal. `npm test` führt die Vitest-Tests für Berechnung und Entwurfsvalidierung aus. `npm run build` prüft die TypeScript-Typen und erzeugt die statische Seite in `dist/`. Vite verwendet relative Asset-Pfade, damit der Build auch unter dem Unterpfad eines GitHub-Pages-Projekts funktioniert. Ein Backend oder Umgebungsvariablen sind nicht erforderlich.

### Veröffentlichung

1. Übertrage das Repository mit `main` als Standardbranch nach GitHub.
2. Wähle unter **Settings > Pages > Build and deployment** die Quelle **GitHub Actions**.
3. Der Status-Badge oben zeigt nach dem ersten Workflow-Lauf ein Ergebnis an.

Der [Test- und Deployment-Workflow](.github/workflows/deploy.yml) läuft bei Pull Requests, Pushes auf `main` und manuellem Start. Er installiert die Abhängigkeiten aus dem Lockfile, führt Tests aus, prüft die Typen und erstellt den Build. Nur wenn diese Schritte erfolgreich sind, wird bei einem Push oder manuellem Start auf GitHub Pages veröffentlicht. Pull Requests werden geprüft, aber nicht veröffentlicht. Der Badge zeigt den Workflow-Status an; fehlgeschlagene Tests oder Builds verhindern die Veröffentlichung.

