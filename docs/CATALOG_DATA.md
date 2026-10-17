# Produktdaten von AVENOR

Geprüft am 17. Oktober 2026. Grundlage ist die öffentliche [DummyJSON-Produkt-API](https://dummyjson.com/docs/products).

## Sortiment und Quellen

Der beim Aufbau geprüfte Katalog umfasst 194 Produkte. AVENOR nutzt eine explizite Auswahl von 24 Produkten, keine zufällige Auswahl aus der API. Die Reihenfolge in `src/data/catalog/curated-products.json` definiert die kuratierte Sortierung.

| Shopkategorie | API-Kategorie                | Produkt-IDs             |
| ------------- | ---------------------------- | ----------------------- |
| Hemden        | mens-shirts                  | 83, 85, 86, 87          |
| Kleider       | tops, womens-dresses         | 162, 164, 166, 177, 180 |
| Taschen       | womens-bags                  | 172, 173, 175, 176      |
| Schuhe        | mens-shoes, womens-shoes     | 90, 185, 186, 188       |
| Uhren         | mens-watches, womens-watches | 93, 194                 |
| Sonnenbrillen | sunglasses                   | 154, 155, 158           |
| Schmuck       | womens-jewellery             | 182, 183                |

Einige Kleider liegen bei DummyJSON unter `tops`. Die eigene Shopkategorie ist daher bewusst unabhängig von der API-Kategorie. Originalkategorie, Originalname, Originalbeschreibung und numerischer Originalpreis bleiben im Feld `source` erhalten; Marke, Bestand und Bewertung werden aus der API übernommen.

Deutsch und Englisch erhalten eigene, kurze Produkttexte in `src/locales/{de,en}/products.json`. Die Zuordnung verlangt neben der ID auch den erwarteten Quellnamen und die erwartete Quellkategorie. Fehlende oder unter derselben ID ausgetauschte Produkte werden ausgelassen, damit keine falschen Übersetzungen angehängt werden.

## API und Abfragen

Die Anwendung lädt `GET https://dummyjson.com/products?limit=0&select=id,title,description,category,price,stock,rating,brand,thumbnail,images`.

Zod prüft die Antwort zur Laufzeit. Eine unvollständige Antwort (`products.length` ungleich `total`) wird abgelehnt, damit lokale Filter keine unvollständigen Ergebnisse als vollständiges Sortiment ausgeben. HTTP-Fehler, fehlerhaftes JSON und unerwartete Daten führen zum übersetzten Fehlerzustand mit erneutem Versuch. Ein leeres Ergebnis wird separat dargestellt.

Live-Prüfung der Query-Kombinationen:

- `/products/search?q=shirt&category=womens-bags&limit=0` lieferte fünf Hemden. Der Kategorieparameter beschränkte das Suchergebnis nicht.
- `/products/category/womens-bags?sortBy=price&order=asc&limit=0` sortierte die Taschenpreise aufsteigend.
- `/products/search?q=shirt&sortBy=price&order=desc&limit=0` sortierte die Suchergebnisse absteigend.

Für konsistente Kombinationen und deutsche Suchbegriffe verarbeitet `queryProducts` das gesamte kuratierte Sortiment lokal: Kategorie und Suche, anschließend Sortierung, dann Pagination. Namenssuche/-sortierung verwenden die ausgewählte Sprache. Die Funktion verändert ihre Eingabe nicht und begrenzt ungültige Seitenparameter. Die Bedienoberfläche aus Schritt 4 verwendet diese Funktion mit zwölf Produkten pro Seite. Suche, Kategorie, Sortierung und Seite werden über URL-Parameter gesteuert.

## Preise und Varianten

Das verwendete API-Produktmodell liefert numerische Preise ohne Währungsfeld. AVENOR interpretiert diese Zahlen als EUR-Demopreise; dies ist keine USD/EUR-Umrechnung. `price.basis = 'demo-eur'` kennzeichnet die Entscheidung im Modell. Die Oberfläche weist darauf hin. Geldwerte werden als ganzzahlige Centbeträge gespeichert und mit `Intl` formatiert.

Die geprüften Datensätze enthalten keine wählbaren Größen-/Farbvarianten oder Bestände pro Variante. Solche Varianten werden in diesem Schritt nicht erfunden. Gegebenenfalls spätere lokale Demovarianten müssen separat modelliert werden. Die zufälligen API-Mindestbestellmengen werden nicht als Einzelhandelsregeln übernommen; Für den Warenkorb gilt eine Mindestmenge von eins und maximal min(Bestand, 99) je Position.

## Bilder und Prüfung

Beim Audit waren alle 24 Produkte übersetzt und bebildert. Die ausgewählten Datensätze enthielten 85 Galeriebilder und 24 Thumbnail-URLs. Alle 109 URLs lieferten HTTP 200 mit einem Bild-Dateityp. Repräsentative Bilder für Hemd, Kleid, Rucksack, Sneaker, Uhr und Ohrring wurden zusätzlich visuell angesehen. Die Daten zeigen teilweise Markenprodukte und unterschiedliche Bildqualität; die Gestaltung des Shops vereinheitlicht diese nicht durch veränderte Produktfakten.

Das Mapping akzeptiert ausschließlich HTTPS-Bilder von `cdn.dummyjson.com`. Fehlende Thumbnails verwenden das erste geeignete Galeriebild. Nicht ladbare Bilder erhalten in der Oberfläche einen beschrifteten Platzhalter. Bilder laden verzögert und haben feste Abmessungen, um Layoutsprünge zu reduzieren.

Die HTTP-Prüfung ist eine Momentaufnahme, keine Garantie für zukünftige API-Verfügbarkeit. Automatisierte Tests sind auf Nutzerwunsch nicht Teil dieses Projekts. Die visuelle Prüfung der kompletten Seite im Browser steht weiterhin aus.

## Produktdetails und Auswahl

Die Detailseiten nutzen denselben validierten und kuratierten Sortimentsdatensatz. Unbekannte IDs werden bereits anhand der lokalen Auswahl abgefangen; bekannte IDs, die im aktuellen API-Datensatz fehlen oder ihre Identität geändert haben, erhalten ebenfalls eine „Produkt nicht gefunden“-Ansicht. Netzwerkfehler bleiben davon getrennt.

Die Galerie zeigt die validierten `images`; ersatzweise wird das Thumbnail verwendet. Zur Laufzeit fehlgeschlagene Bilder werden aus der aktuellen Galerie entfernt. Es werden keine neuen Produktbilder oder Farbvarianten generiert.

Der Bestand begrenzt die auswählbare Menge. `createProductSelection` erzeugt eine Auswahl mit Produkt-ID, `variantId: 'default'` und ganzzahliger Menge oder `null` bei nicht verfügbarem Bestand. Diese Standardvariante steht für das vorhandene Produkt, ohne zusätzliche Größen- oder Farbausprägung. Die eigene Artikelreferenz `AV-<Produkt-ID>` ist eine AVENOR-Demoreferenz und kein übernommener Hersteller-SKU.

Die angezeigte Bewertung ist der API-Ratingwert von maximal fünf; die Oberfläche erfindet dazu keine Anzahl an Rezensionen. Lieferzeiten, Rückgaberegeln und Materialangaben werden nicht zusätzlich erfunden. Warenkorbaktionen aus Schritt 6 verwenden die Standardausführung und berücksichtigen den Bestand sowie die bereits gespeicherte Menge.

## Warenkorbpreise und Verfügbarkeit

Der Warenkorb speichert bewusst keine Produktpreise, Beschreibungen oder Bilder. Beim Öffnen werden gespeicherte Produkt-IDs mit dem aktuellen Katalog aufgelöst. Preise, Produkttexte und Bestandsgrenzen stammen dadurch aus dem validierten Datensatz und den lokalen Übersetzungen.

Gesunkene Bestände begrenzen positive Mengen. Fehlende oder ausverkaufte Produkte bleiben als nicht verfügbare Positionen sichtbar, werden von Zwischensumme und Versandberechnung ausgeschlossen und können explizit entfernt werden. Bei fehlgeschlagenem API-Abruf bleiben gespeicherte Positionen unverändert erhalten; es werden keine unbestätigten Summen angezeigt.

Die Demo-Versandregel beträgt 490 Cent bei positivem verfügbarem Warenkorb unter 10000 Cent Warenwert und null Cent ab 10000 Cent. Ein Warenkorb ohne verfügbare Produkte erhält ebenfalls keine Versandkosten. Diese Regeln sind lokale Demoentscheidungen und stammen nicht aus DummyJSON.

## Merkliste

Die Merkliste speichert ausschließlich bekannte Produkt-IDs, keine Produktdaten oder Preise. Sie nutzt beim Öffnen denselben validierten Katalogabruf wie die übrigen Produktansichten. Die lokale Reihenfolge entspricht der Reihenfolge des Merkens.

Fehlt ein gemerktes Produkt im aktuell aufgelösten Sortiment, bleibt die ID als explizit entfernbarer Eintrag erhalten. Ein API-Fehler leert die Merkliste nicht. Ausverkaufte Produkte dürfen gemerkt bleiben, da keine Bestellung oder Bestandsreservierung ausgelöst wird. Warenkorb und Merkliste haben getrennte Speicher-Schlüssel und eigene Contexts.

## Redaktionelle Kollektionen

Die Startseite nutzt zwei explizite Teilmengen in `src/data/catalog/product-collections.ts`: `new-arrivals` und `everyday-essentials`. Beide enthalten jeweils acht Produkt-IDs aus dem kuratierten Sortiment. Sie sind redaktionelle Entscheidungen und werden nicht aus zufälligen API-Erstellungsdaten abgeleitet.

`queryProducts` beschränkt zuerst die Kollektion und Kategorie sowie den Suchbegriff, sortiert danach und paginiert zuletzt. `collection` wird mit den übrigen Katalogparametern in der URL erhalten, normalisiert und bei vollständigem Zurücksetzen entfernt. Kategorieanzahlen beziehen sich auf die aktive Kollektion vor Suche und Kategorie. Herkunft der Startseitenbilder ist separat in [HOME_ASSETS.md](./HOME_ASSETS.md) dokumentiert.

## Demo-Abschluss

Vor dem Demo-Abschluss wird das gesamte kuratierte Sortiment erneut geladen. Die Abschlussprüfung vergleicht verfügbare Positionen, Mengen und Stückpreise mit der angezeigten Übersicht. Abweichungen erzeugen keine Bestellung, sondern aktualisieren die Ansicht und verlangen ein erneutes Absenden. Netzwerkfehler erhalten den Warenkorb.

Ein erfolgreicher Abschluss erzeugt ausschließlich einen lokalen Demo-Snapshot mit Artikel-IDs, Standardvarianten-ID, Mengen, zweisprachigen Namen, Stückpreisen und Summen. Die letzte Bestätigung bleibt im sessionStorage verfügbar, ohne Name, E-Mail oder Lieferadresse. Ihre Summen werden beim Wiederherstellen aus den Positionen und Demo-Versandregeln geprüft. Es gibt keinen Order-POST an DummyJSON, keine Zahlungsintegration und keinen echten Bestell-/Versand-/E-Mail-Prozess.
