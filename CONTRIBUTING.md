# Mitarbeit an AVENOR

## Einrichtung

Node.js 24 verwenden, Abhängigkeiten mit `npm ci` installieren und das Frontend mit `npm run dev` starten. Für Stripe die lokale Einrichtung in [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md) befolgen. Build und Codeprüfungen benötigen keine Stripe-Schlüssel.

## Projektregeln

- React und TypeScript; die Struktur nach Verantwortlichkeiten mit gemeinsamen Modellen unter `src/entities` beibehalten.
- API-Daten über TanStack Query, Warenkorb und Merkliste über Context + Reducer verwalten.
- Benutzertexte auf Deutsch und Englisch ergänzen.
- Geldbeträge in Cent berechnen; Stripe ausschließlich im Testmodus betreiben.
- Keine automatisierten Tests schreiben oder ausführen und keine Test-Infrastruktur ergänzen. Stattdessen passende manuelle Prüfschritte dokumentieren.
- `.env`, Schlüssel, Token, private Kontaktdaten und lokale Builddateien niemals committen. `.env.example` enthält ausschließlich Platzhalter.

## Änderungen prüfen

```sh
npm run format:check
npm run lint
npm run build
```

Der Build prüft auch die TypeScript-Dateien des Zahlungsservers. GitHub Actions führt dieselben Prüfungen ohne Stripe-Schlüssel und ohne automatisierte Tests aus. Der Workflow wurde lokal vorbereitet; der erste tatsächliche Actions-Lauf erfolgt nach dem Push.

Pull Requests sollten den Grund der Änderung, das neue Verhalten und die durchgeführten Prüfungen beschreiben. Für UI-Änderungen manuell beide Sprachen und kleine Bildschirmgrößen prüfen.
