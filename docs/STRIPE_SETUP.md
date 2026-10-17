# Stripe Checkout lokal einrichten

Die Implementierung verwendet ausschließlich Stripe-Testzahlungen. Eigene Stripe-Schlüssel sind noch nicht eingetragen. Eine Zahlung bei Stripe und die Webhook-Zustellung konnten daher noch nicht vollständig durchgespielt werden. Es wurden keine automatisierten Tests geschrieben oder ausgeführt.

## Voraussetzungen

- Node.js 24 und `npm ci`.
- Ein Stripe-Konto mit Testumgebung beziehungsweise Sandbox und geheimem Testschlüssel `sk_test_…`.
- Für lokale Webhooks die [Stripe CLI](https://docs.stripe.com/stripe-cli).

## Konfiguration

`.env.example` nach `.env` kopieren und lokal bearbeiten:

```sh
cp .env.example .env
```

```dotenv
STRIPE_SECRET_KEY=sk_test_DEIN_GEHEIMER_TESTSCHLUESSEL
STRIPE_WEBHOOK_SECRET=whsec_DEIN_LOKALER_WEBHOOKSCHLUESSEL
APP_ORIGIN=http://localhost:5173
```

Die `.env` ist ignoriert. Geheimnisse niemals mit `VITE_` präfixieren, in React-Dateien eintragen oder in Nachrichten teilen. Es wird kein öffentlicher Stripe-Schlüssel benötigt: Der Server liefert eine gehostete Checkout-URL, zu der der Browser navigiert. Live-Schlüssel werden serverseitig abgelehnt.

## Drei Terminals

Frontend:

```sh
npm run dev
```

Zahlungs-API:

```sh
npm run dev:api
```

Webhook-Weiterleitung:

```sh
stripe login
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to http://127.0.0.1:4242/api/payments/webhook
```

Den von `stripe listen` ausgegebenen `whsec_…`-Wert in `.env` übernehmen und die Zahlungs-API neu starten. API-Schlüssel und CLI müssen dieselbe Testumgebung verwenden. Nach Änderungen an `.env` ist ebenfalls ein Neustart nötig.

Die Website über **http://localhost:5173** öffnen. Vite verwendet den festen Port und leitet `/api` an Port 4242 weiter. `APP_ORIGIN` muss exakt der Browser-Origin entsprechen, ohne abschließenden Slash. `npm run preview` startet keinen API-Proxy; für die lokale Integration die obigen Befehle verwenden.

## Manueller Ablauf

1. Produkt auswählen und zum Warenkorb hinzufügen.
2. Zur Kasse gehen und bei Bedarf mit `emilys` / `emilyspass` anmelden.
3. Auswahl prüfen und „Weiter zu Stripe · Testzahlung“ wählen.
4. Auf Stripe fiktive Kontakt- und Adressdaten eingeben. Lieferländer sind DE und AT.
5. Für eine erfolgreiche Testzahlung `4242 4242 4242 4242`, ein zukünftiges Ablaufdatum und einen beliebigen dreistelligen CVC verwenden. Weitere Szenarien stehen in [Stripes Testdokumentation](https://docs.stripe.com/testing).
6. Die Rückkehrseite zeigt erst nach dem Stripe-Abruf „Testzahlung bestätigt“. Der CLI-Listener sollte den Webhook mit HTTP 200 anzeigen.
7. Rückkehrseite neu laden und Sprache wechseln: Bezahlte Mengen dürfen nicht erneut abgezogen werden.
8. Abbrechen, eine abgelehnte Testkarte und erneutes Prüfen nach einem Verbindungsfehler ebenfalls manuell durchgehen. Bei fehlender Bestätigung bleibt der Warenkorb erhalten.

Nach dem externen Checkout ist die bisher nur im RAM gehaltene DummyJSON-Anmeldung nicht mehr vorhanden. Die Rückkehrseite nutzt deshalb einen separaten, zufälligen Belegschlüssel aus `sessionStorage`. Für einen weiteren Checkout erneut anmelden. Die Rückkehr muss im ursprünglichen Tab erfolgen; fehlen Schlüssel oder zugehörige Sitzung, wird keine Zahlung bestätigt.

## Aufbau und Datenfluss

- `server/payments.ts`: gemeinsamer Web-Request-Handler für Create, Status und Webhook.
- `server/catalog.ts`: serverseitiger Katalogabruf, Quellidentität, Bestands- und Preisprüfung. Der Client liefert IDs/Mengen und Vergleichsbeträge; berechnet wird ausschließlich mit aktuellen Serverdaten.
- `server/stripe.ts`: ausschließlich serverseitiges Stripe-SDK; akzeptiert nur `sk_test_…`.
- `server/dev.ts`: lokaler Node-Adapter desselben Handlers.
- `api/payments.ts`: vorbereiteter Serverless-Einstieg; `vercel.json` enthält optionales Routing. Nichts wurde veröffentlicht oder mit einem Hostingkonto verbunden.
- `src/hooks/payment`: Start des Checkouts mit Submit-Sperre und Abbruch beim Verlassen beziehungsweise Sitzungsablauf.
- `src/services/payment`: Client-API, Antwortvalidierung und Speicherung des Belegschlüssels.
- `src/pages/checkout/PaymentReturnPage.tsx`: Serverstatus über TanStack Query, begrenzte Wiederholungsabfragen und manuelles Wiederholen.

`POST /api/payments/create` prüft den Bearer-Token über DummyJSON `/auth/me`, erlaubt nur die konfigurierte Origin und validiert den Warenkorb. EUR-Centbeträge, Standardvariante, maximal 99 Stück je Produkt und die gemeinsame Versandregel werden geprüft. Maximaler Warenwert in dieser Testintegration: 10.000 Euro. Preis-/Bestandsänderungen liefern HTTP 409; ohne Zustimmung zur aktualisierten Übersicht entsteht keine Checkout-Session.

Stripe erhält lokalisierte Artikel, Mengen und serverseitig bestimmte Beträge. Kontakt- und Zahlungsdaten werden auf Stripe erfasst und dort verarbeitet, nicht durch das AVENOR-Formular. In Session-Metadaten stehen App-Kennung und Hash des Belegschlüssels; die öffentliche DummyJSON-ID steht als Kundenreferenz darin. Keine Passwörter oder Auth-Token werden an Stripe gesendet.

Der Stripe-Idempotenzschlüssel bleibt bei Wiederholungen derselben Auswahl innerhalb des geöffneten Checkouts gleich. Erfolg- und Abbruchziele entstehen aus `APP_ORIGIN`, niemals aus einer frei übergebenen URL.

`POST /api/payments/status` verlangt Session-ID und lokalen Belegschlüssel. Die Session-ID oder ein `canceled`-Parameter allein beweisen keine Zahlung. Der Server prüft Testmodus, Herkunft und `status=complete` sowie `payment_status=paid`, liest Artikel und Summen direkt aus Stripe und liefert keine Adresse oder E-Mail an die Rückkehrseite.

`POST /api/payments/webhook` prüft Stripes Signatur am unveränderten Rohbody. Relevante Events werden anhand einer erneut von Stripe gelesenen Session verarbeitet. Der bestätigte Status wird idempotent als `avenor_verified=paid` in Stripe-Metadaten markiert. Derselbe Schritt kann über die Rückkehrseite erfolgen. Stripe ist hier der dauerhafte Zahlungsdatensatz; eine manipulierte lokale Bestätigung ist keine Zahlungsquelle.

Der Warenkorb speichert Version 2 inklusive bereits verbuchter Stripe-Session-IDs und liest bestehende Version-1-Auswahlen weiter ein. Nach bestätigter Zahlung werden nur bezahlte Mengen abgezogen; später hinzugefügte Mengen und andere Artikel bleiben erhalten. Bei fehlendem localStorage funktioniert die Änderung im RAM und erhält einen Hinweis; dauerhafte Wiederholungsvermeidung setzt funktionierenden Speicher voraus. Eine Synchronisierung mehrerer Tabs ist weiterhin nicht implementiert.

## Grenzen dieser Integration

Es gibt keine eigene Bestelldatenbank, Bestandsreservierung, Versandabwicklung, Rückerstattungsoberfläche oder E-Mail-Abwicklung. Der Webhook speichert einen Zahlungsmarker bei Stripe; er simuliert keine Warenlieferung. Für eine echte Auftragsabwicklung wäre ein dauerhaftes Bestellmodell mit idempotenter Verarbeitung erforderlich. DummyJSON-Zugänge sind öffentlich und dienen ausschließlich der Demo. Diese Umsetzung ist bewusst auf Testmodus begrenzt.

Die alte lokale Demo-Bestellung, ihr Formular und die Route `checkout/confirmation/:orderId` wurden durch den Stripe-Ablauf ersetzt. Frühere `avenor.demo-order`-Daten werden nicht mehr verwendet. Alle aktuellen Rückkehrlinks verwenden `checkout/return`.

## Verifikation

Build einschließlich TypeScript für Frontend **und** Server sowie ESLint erfolgreich. Die lokale API wurde gestartet und manuell per HTTP aufgerufen: GET liefert 405, fehlende Serverkonfiguration bei Create und Webhook liefert 503 mit `not-configured` ohne Geheimnisse. Vollständige Stripe-Testzahlung, signierter Webhook und Browserbedienung stehen bis zum Eintragen der Schlüssel und zur manuellen Prüfung aus.

Technische Grundlage: [Stripe Hosted Checkout](https://docs.stripe.com/checkout/quickstart), [Checkout-Session erstellen](https://docs.stripe.com/api/checkout/sessions/create), [Webhook-Signaturen](https://docs.stripe.com/webhooks/signature).
