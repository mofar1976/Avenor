# AVENOR

Minimalistischer Fashion- und Lifestyle-Demoshop mit React, TypeScript und Vite. Deutsch und Englisch, kuratierte DummyJSON-Produkte, Warenkorb, Merkliste, Demo-Anmeldung und Stripe Checkout im **Testmodus**.

## Lokal starten

Node.js 24 und npm verwenden:

```sh
npm ci
npm run dev
```

Frontend: `http://localhost:5173`. Katalog und Demo-Anmeldung benötigen keine eigenen API-Schlüssel. Demo-Zugang: `emilys` / `emilyspass`; im Anmeldeformular auch per Button eintragbar. Nur öffentliche Demo-Zugangsdaten verwenden.

Für Zahlungen zusätzlich `.env.example` nach `.env` kopieren, eigene Stripe-Testschlüssel eintragen und in einem zweiten Terminal starten:

```sh
npm run dev:api
```

Die vollständige Einrichtung einschließlich lokalem Webhook-Listener steht in [docs/STRIPE_SETUP.md](./docs/STRIPE_SETUP.md). Ohne Server/Schlüssel funktionieren die übrigen Shopbereiche; beim Zahlungsstart erscheint ein Fehler statt einer erfundenen Bestätigung. Eine vollständige Stripe-Zahlung ist noch nicht verifiziert, weil die eigenen Schlüssel fehlen.

## Befehle

```sh
npm run dev           # React-Frontend mit Proxy zur lokalen API
npm run dev:api       # Lokale Zahlungs-API, lädt .env
npm run build         # Frontend-/Server-Typprüfung und Frontend-Produktionsbuild
npm run typecheck     # Frontend und Server mit TypeScript prüfen
npm run lint          # ESLint
npm run format        # Prettier anwenden
npm run format:check  # Formatierung prüfen
npm run preview       # Frontend-Build ansehen, ohne Zahlungs-API-Proxy
```

Keine automatisierten Tests schreiben oder ausführen und keine Test-Infrastruktur hinzufügen; ausdrückliche Projektentscheidung. Verifikation über Build, TypeScript, ESLint, Formatierung und manuelle Prüfungen. Die vollständige Browserprüfung bleibt offen.

## Struktur

```text
api/                   # Serverless-Einstieg für Zahlungen
server/                # Stripe, serverseitiger Katalog, lokale API
src/
  app/                 # Einstieg, Router, Provider und Konfiguration
  pages/               # Seiten nach Shopbereich
  components/          # UI, Layout und fachliche Darstellung
  entities/            # Gemeinsame Modelle für Produkt, Warenkorb, Auth, Zahlung …
  services/            # Client-API-Zugriffe, Mapping und Browser-Persistenz
  queries/             # Produkt-Query-Optionen und Query-Hooks
  hooks/               # React-Hooks und Ablaufsteuerung
  context/             # Provider, Contexts und Reducer
  utils/               # Reine Regeln, Berechnungen und Hilfsfunktionen
  data/                # Kuratiertes Sortiment und Kollektionen
  locales/             # Deutsche und englische Übersetzungen
  styles/              # Globale Styles und Designtokens
```

`@/` verweist auf `src/`. Fachliche Modelle liegen gemeinsam unter `entities`; API-Antwortschemas bei den Services. Komponenten nutzen Hooks/Contexts; Query-Hooks verbinden API-Services mit TanStack Query. Der Stripe-Servercode wird nicht in das Frontend importiert. Gemeinsame Cent-/Versandregeln liegen in `src/entities/order/pricing.ts`.

## Shopfunktionen

- Sprachrouten `/de` und `/en`. Die URL bestimmt die Sprache; ohne Präfix folgen gespeicherte Auswahl, Browsersprache und englischer Fallback. Sprachwechsel erhält Route, Queryparameter und Anker.
- Redaktionelle Startseite mit Kampagne, Kategorien und festen Kollektionen `new-arrivals` / `everyday-essentials`. Editorial-Motive ersetzen keine Produktfotos. Externe Bildquellen stehen in [docs/ASSET_SOURCES.md](./docs/ASSET_SOURCES.md).
- 24 Fashion-/Lifestyle-Produkte aus sieben Kategorien. Lokale deutsche/englische Texte, explizite Quellidentitätsprüfung und Zod-Validierung. Keine erfundenen Größen-/Farbvarianten. EUR-Demopreise entsprechen numerischen API-Werten ohne Währungsumrechnung. Details: [docs/CATALOG_DATA.md](./docs/CATALOG_DATA.md).
- Katalog unter `/:language/products` mit Suche, Kategorie, Kollektion, Sortierung und zwölf Produkten pro Seite. URL-Parameter: `q`, `category`, `collection`, `sort`, `page`. Lokale Filterung vor Pagination; ungültige Parameter werden normalisiert.
- Produktdetails unter `/:language/products/:productId`: Galerie mit Bilddialog, Mengenwahl, verwandte Produkte, Merk- und Warenkorbaktionen sowie Fehler-Fallbacks.
- Warenkorb unter `/:language/cart`, Merkliste unter `/:language/wishlist`; getrennte Contexts und Reducer. Speicherung von IDs/Mengen, keine Auth-Token. Maximal 99 Stück je Artikel; Bestandsbegrenzung und sichtbare nicht verfügbare Positionen.
- Berechnung in Cent: 4,90 Euro Demo-Versand unter 100 Euro, darüber kostenlos. Stripe und Frontend verwenden dieselben Versandkonstanten.
- Responsive Navigation, Skip-Link, Formularbeschriftungen, Fokuszustände und reduzierte Bewegung. Radix übernimmt Dialogverhalten; Tailwind/shadcn-Konfiguration in `components.json`.
- Seiten werden bei Bedarf geladen; Editorial-Bilder verwenden responsive Quellen und feste Bildflächen. Systemschriften ohne externen Fontdienst.

## Zustand und API-Daten

TanStack Query verwaltet den Produktcache über `['catalog', 'products']`. Sprache und lokale Filter ändern den API-Datensatz nicht. Daten sind 60 Sekunden frisch; inaktive Daten bleiben zehn Minuten im RAM. Veraltete Daten werden beim erneuten Mounten oder Wiederverbinden im Hintergrund aktualisiert; vorhandene Produkte bleiben sichtbar, auch bei einem Hintergrundfehler.

Keine automatischen Retries und kein Refetch beim Fensterfokus. `networkMode: 'always'` lässt Offline-Anfragen fehlschlagen, statt die Ladeanzeige unbegrenzt zu pausieren. Wiederholen ist manuell möglich. Fetch nutzt ein Abbruchsignal und einen Timeout; kein persistierter API-Cache.

Warenkorb und Merkliste verwenden Context + Reducer, Filter und Sprache die URL, das Loginformular React Hook Form und vorübergehende UI-Zustände lokalen React-State. Kein Zustand. Kein eigener Produkt-Context.

## Anmeldung und Checkout

- `/de/login`, `/en/login`: Demo-Anmeldung über DummyJSON; anschließend Profilprüfung mit `/auth/me`.
- `/de/account`, `/en/account`: geschütztes öffentliches Demoprofil mit Logout.
- Token und Profil liegen nur im RAM; Reload oder Sitzungsablauf erfordern erneute Anmeldung. Kein automatischer Refresh, keine Registrierung oder Passwortverwaltung. Logout entfernt die lokale Sitzung, widerruft aber keinen Token beim Demoanbieter.
- `/:language/checkout` erfordert Anmeldung, auch bei Direktaufruf. Login führt anschließend in der aktuellen Sprache zum Checkout zurück. Der Server prüft den Bearer-Token beim Erstellen der Stripe-Session erneut.
- Kontakt-, Liefer- und Zahlungsdaten werden direkt auf Stripe erfasst. Ausschließlich Stripe-Testkarten und fiktive Angaben verwenden; Lieferländer DE/AT.
- `/:language/checkout/return` zeigt einen serverseitig geprüften Stripe-Status. Ein Session-Link allein genügt nicht: Ein zusätzlicher Belegschlüssel bleibt im ursprünglichen Tab in sessionStorage. Die Rückkehrseite funktioniert damit trotz Verlust der RAM-Anmeldung beim Stripe-Redirect.
- Warenkorb wird erst nach bestätigter Testzahlung um bezahlte Mengen reduziert. Bereits verbuchte Stripe-Session-IDs werden mitgespeichert, damit Reload keine erneute Reduktion verursacht. Fehler oder Abbruch leeren den Warenkorb nicht.
- Warenkorb, Merkliste und Zahlungsbelege bleiben browserlokal und sind keinem DummyJSON-Konto zugeordnet. Keine Geräte- oder Tab-Synchronisierung. Bei Speicherfehlern gelten die dokumentierten Einschränkungen.

## Zahlungsgrenzen und Hosting

Stripe ausschließlich im Testmodus. Keine echte Warenlieferung, eigene Bestelldatenbank, Bestandsreservierung oder E-Mail-Abwicklung. Der signierte Webhook bestätigt Zahlungen und setzt einen idempotenten Marker bei Stripe; Stripe dient hier als dauerhafter Zahlungsdatensatz. Für reale Auftragsabwicklung fehlen bewusst weitere serverseitige Prozesse.

Die kleine Zahlungs-API erweitert die ursprüngliche Frontend-only-Entscheidung ausdrücklich auf Nutzerwunsch. Lokal reicht `npm run dev:api`; ein optionaler Serverless-Einstieg und Vercel-Routing sind vorbereitet. Es wurde nichts veröffentlicht. Ein anderer Host muss API-Routen bereitstellen und Sprach-/Seitenpfade für Direktaufrufe auf `index.html` zurückführen.

Der Stripe-Ablauf ersetzt die frühere rein lokale Checkout-Simulation.

## GitHub und Mitarbeit

Das Projekt ist für ein öffentliches Repository vorbereitet. Eigene `.env`-Dateien und erzeugte Artefakte sind ignoriert; `package-lock.json` und die sichere `.env.example` gehören ins Repository. `private: true` schützt vor versehentlicher npm-Veröffentlichung.

GitHub Actions prüft Formatierung, ESLint und Build einschließlich Frontend-/Server-Typprüfung, ohne Stripe-Schlüssel und ohne automatisierte Tests. Die erste tatsächliche CI-Ausführung erfolgt nach dem Push.

- [Erster GitHub-Push](docs/GITHUB_PUBLISH.md)
- [Beitragsregeln](CONTRIBUTING.md)
- [Sicherheitsinformationen](SECURITY.md)

Eine Projektlizenz für den eigenen Code wurde noch nicht gewählt. Herkunft der verwendeten Bilder und Daten bleibt separat dokumentiert; eine Veröffentlichung erteilt dafür keine zusätzliche Lizenz.
