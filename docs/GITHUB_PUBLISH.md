# Öffentliches GitHub-Repository vorbereiten

Das lokale Repository verwendet `main`. Noch kein Remote, Commit oder Push wurde durch diese Vorbereitung angelegt. Eine Lizenz für den eigenen Projektcode wurde nicht ausgewählt.

## Erster Push

Auf GitHub ein leeres Repository erstellen. Beim Erstellen keine zusätzlichen README-, Lizenz- oder Gitignore-Dateien generieren lassen, damit der erste Push ohne Zusammenführung unterschiedlicher Anfangsstände funktioniert.

Vor dem Commit den Dateiumfang prüfen:

```sh
git status --short
git check-ignore .env node_modules dist
```

`.env` muss ignoriert sein; `.env.example` soll veröffentlicht werden. Danach:

```sh
git add .
git diff --cached --stat
git diff --cached --name-only
```

Die vorgemerkten Dateien vor dem Commit ansehen. Schlüssel niemals in Commit-Nachrichten oder öffentliche Screenshots übernehmen. `node_modules`, `dist` und persönliche `.env`-Dateien dürfen nicht enthalten sein. `package-lock.json` gehört zum Repository.

Anschließend selbst committen und die eigene Repository-URL einsetzen:

```sh
git commit -m "Initial commit: AVENOR storefront"
git remote add origin https://github.com/DEIN-NAME/DEIN-REPOSITORY.git
git push -u origin main
```

Die Platzhalter in der URL durch den tatsächlichen GitHub-Namen und Repository-Namen ersetzen. Das Projekt wird dadurch auf GitHub veröffentlicht, jedoch nicht als Website bereitgestellt.

## Repository-Inhalt

- README, lokale Startanleitung, Beitragsregeln und Sicherheitsinformationen sind vorhanden.
- Die Quality-Action führt Installation, Formatierung, ESLint und Build einschließlich Typprüfung aus. Keine automatisierten Tests und keine Stripe-Secrets nötig.
- `.env.example` enthält ausschließlich Platzhalter. Eigene `.env`-Dateien, Buildausgaben, TypeScript-Zwischendateien, lokale Hostingdaten und private Schlüsseldateien sind ignoriert.
- Die verwendeten Webbilder liegen unter `public/images/home`. Externe Quellen sind in `docs/ASSET_SOURCES.md` dokumentiert. Lokale Arbeitsnotizen und Quelldateien gehören nicht zum veröffentlichten Dateiumfang.

## Lizenz und Fremdmaterial

Für den eigenen Code ist noch keine Projektlizenz festgelegt. Eine Veröffentlichung wird daher nicht als pauschale Lizenzfreigabe beschrieben. Lizenzentscheidung gegebenenfalls als separaten Schritt treffen. `private: true` in `package.json` verhindert eine versehentliche npm-Veröffentlichung; es steht einem öffentlichen GitHub-Repository nicht entgegen.

Abhängigkeiten behalten ihre jeweiligen Lizenzen. Produktdaten, Produktbilder und darin sichtbare Marken stammen aus externen Quellen; die Herkunftsdokumentation erteilt dafür keine zusätzliche Nutzungserlaubnis. Angaben zu Bildern stehen in `docs/ASSET_SOURCES.md`.

## Bekannte offene Punkte

Vollständige Browserprüfung sowie die vollständige Stripe-Testzahlung mit eigenen Schlüsseln und signiertem Webhook sind weiterhin offen. Die lokale Zahlungseinrichtung steht in `docs/STRIPE_SETUP.md`. Der GitHub-Actions-Lauf selbst kann erst im GitHub-Repository bestätigt werden.
