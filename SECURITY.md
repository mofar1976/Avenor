# Sicherheitsinformationen

AVENOR ist ein Lern- und Demoprojekt mit öffentlichen DummyJSON-Konten und Stripe ausschließlich im Testmodus. Es bietet keine produktive Kontoverwaltung oder vollständige Bestellabwicklung.

## Schwachstellen melden

Keine Schlüssel, Token, persönlichen Daten oder ausnutzbaren Details in öffentliche Issues schreiben. Falls im Repository aktiviert, GitHubs „Report a vulnerability“ unter „Security“ verwenden. Andernfalls den Repository-Inhaber über einen von ihm veröffentlichten privaten Kontaktweg erreichen.

## Geheimnisse

- Stripe-Schlüssel ausschließlich lokal in `.env` beziehungsweise in den serverseitigen Umgebungsvariablen des Hosts speichern.
- Keine geheimen Schlüssel mit `VITE_` präfixieren oder in Frontend-Dateien verwenden.
- Für Beiträge und Screenshots nur öffentliche Demozugänge sowie fiktive Zahlungs-/Kontaktdaten verwenden.
- Versehentlich veröffentlichte Zugangsschlüssel beim Anbieter widerrufen beziehungsweise ersetzen; das Entfernen aus dem aktuellen Dateistand allein entfernt sie nicht aus früheren Commits.

Die Vorlage `.env.example` ist öffentlich und enthält keine einsatzfähigen Schlüssel. Eigene `.env`-Dateien und private Schlüsseldateien werden ignoriert. Die lokalen Präventionsregeln ersetzen keine Prüfung der zu veröffentlichenden Dateien.
