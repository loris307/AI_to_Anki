Technische Spezifikation: AI Anki-Deck-Ersteller

Dieses Dokument beschreibt die technische Architektur und die Spezifikationen für die Web-Anwendung "AI Anki-Deck-Ersteller".

1. Systemarchitektur & Technologie-Stack

Die Anwendung wird als moderne Web-Anwendung konzipiert, die auf einem Frontend-Framework aufbaut und serverseitige Logik über Serverless Functions abwickelt. Die gesamte Backend-Infrastruktur wird durch Supabase bereitgestellt.

Frontend-Framework: Next.js. Als führendes React-Framework bietet Next.js serverseitiges Rendering (SSR) und statische Seitengenerierung (SSG), was zu einer exzellenten Performance und SEO-Freundlichkeit führt. Es integriert sich nahtlos in die geplante Architektur.

Styling: Tailwind CSS. Ein "Utility-First"-CSS-Framework, das schnelles und konsistentes Design direkt im HTML ermöglicht. Es ist hochgradig anpassbar und skalierbar.

UI-Komponenten: shadcn/ui. Eine Sammlung von wiederverwendbaren UI-Komponenten, die auf Tailwind CSS und Radix UI aufbauen. Dies beschleunigt die Entwicklung von hochwertigen und zugänglichen Interfaces. Die Komponenten sind nicht als fertige Bibliothek, sondern als Code-Bausteine konzipiert, die direkt ins Projekt kopiert und angepasst werden.

Backend-as-a-Service (BaaS): Supabase. Supabase dient als zentrales Backend und stellt folgende Dienste bereit:

Datenbank: Eine dedizierte, auf PostgreSQL basierende Datenbank zur Speicherung von Benutzer- und Deck-Informationen.

Authentifizierung: Integriertes Supabase Auth für das komplette Account Management (Registrierung, Login, Passwort-Reset, Social Logins).

Storage: Supabase Storage zur sicheren Speicherung der generierten Anki-Deck-Dateien.

Serverless Functions: Supabase Edge Functions (auf Deno basierend) zur Ausführung der Kernlogik – der KI-gestützten Erstellung der Karteikarten.

KI-Modell: Ein leistungsstarkes Sprachmodell (LLM) über eine API, vorzugsweise die OpenAI API (z.B. mit dem Modell gpt-4o oder gpt-3.5-turbo). Dieses Modell ist für seine Fähigkeit bekannt, Texte zu analysieren und strukturierte Daten daraus zu extrahieren.

2. Detaillierte Seiten-Spezifikationen

Die Anwendung besteht aus zwei primären Seiten, die nur für eingeloggte Benutzer zugänglich sind. Ein vorgeschalteter Login- und Registrierungs-Flow ist ebenfalls notwendig.

Funktionalität: Bietet Formulare für die Registrierung mit E-Mail und Passwort sowie für den Login. Das gesamte Handling (Validierung, Bestätigungs-E-Mails, sichere Passwort-Speicherung) wird von Supabase Auth übernommen.

Technologie:

Next.js-Seiten im app-Verzeichnis.

Formulare werden mit shadcn/ui Komponenten (Card, Input, Button, Label) erstellt.

Die Interaktion mit Supabase Auth erfolgt über das offizielle supabase-js Client-Library.

Dies ist die Kernseite der Anwendung.

Layout & Komponenten (shadcn/ui):

Ein zentrierter Bereich, der eine Card-Komponente enthält.

Innerhalb der Card:

Ein CardHeader mit dem Titel "Neues Anki-Deck erstellen".

Ein CardContent mit den Eingabefeldern.

Ein großes Textarea-Feld mit der Beschriftung "Text hier einfügen (z.B. ein Youtube-Skript)".

Ein Input-Feld für den "Namen des Decks".

Ein CardFooter mit einem Button "Deck generieren". Während der Generierung wechselt der Button in einen Ladezustand (z.B. mit einem Lade-Spinner) und ist deaktiviert.

User Flow & Logik:

Der Benutzer fügt einen Text in das Textarea-Feld ein und gibt einen Namen für das Deck ein.

Bei Klick auf "Deck generieren" validiert das Frontend die Eingaben (Text nicht leer, Name nicht leer).

Das Frontend sendet die Daten (Text und Deck-Name) über einen sicheren API-Aufruf an eine Supabase Edge Function.

Die Anwendung zeigt dem Benutzer eine Ladeanzeige an (z.B. ein Toast von shadcn/ui), die über den Fortschritt informiert.

Nach erfolgreicher Generierung durch das Backend erhält der Benutzer eine Erfolgsmeldung (z.B. "Dein Deck wurde erstellt! Du findest es unter 'Meine Decks'.") und wird idealerweise direkt auf die "Meine Decks"-Seite weitergeleitet.

Diese Seite dient als Archiv und Download-Zentrale für den Benutzer.

Layout & Komponenten (shadcn/ui):

Ein Seitentitel "Meine Decks".

Eine Table-Komponente zur Darstellung der erstellten Decks.

Die Tabelle hat folgende Spalten:

Deck-Name: Der vom Benutzer vergebene Name.

Erstellt am: Das Datum der Generierung.

Aktionen: Ein Button oder DropdownMenu pro Zeile mit der Option "Download".

User Flow & Logik:

Beim Laden der Seite fragt das Frontend die Supabase-Datenbank nach allen Decks, die mit der ID des aktuell eingeloggten Benutzers verknüpft sind.

Die abgerufenen Daten werden in der Tabelle gerendert.

Bei Klick auf den "Download"-Button wird der Supabase Storage-Dienst angesprochen. Das Frontend generiert eine temporäre, signierte Download-URL für die zugehörige Deck-Datei und löst den Download im Browser des Benutzers aus.

3. Supabase Backend-Spezifikationen

Es wird eine einzige Tabelle benötigt, um die Decks zu verwalten. Die Benutzerdaten werden automatisch in der auth.users-Tabelle von Supabase Auth gespeichert.

Tabelle: decks

id: uuid, Primärschlüssel (Standard: uuid_generate_v4()).

user_id: uuid, Fremdschlüssel, der auf auth.users.id verweist. Stellt die Verbindung zum Benutzer her.

deck_name: text, nicht null. Der vom Benutzer gewählte Name.

created_at: timestamp with time zone, nicht null (Standard: now()). Zeitstempel der Erstellung.

file_path: text, nicht null. Der Pfad zur generierten Datei im Supabase Storage.

Row Level Security (RLS): Die Tabelle decks muss mit RLS-Policys geschützt werden:

SELECT Policy: Ein Benutzer darf nur die Decks sehen (SELECT), bei denen die user_id mit seiner eigenen auth.uid() übereinstimmt.

INSERT Policy: Ein Benutzer darf nur ein Deck einfügen (INSERT), wenn er eingeloggt ist. Die user_id wird automatisch auf auth.uid() gesetzt.

DELETE / UPDATE Policies: Werden zunächst nicht benötigt, können aber bei Bedarf einfach hinzugefügt werden (z.B. um das Umbenennen oder Löschen von Decks zu ermöglichen).

Wird "out-of-the-box" verwendet. Die Konfiguration im Supabase Dashboard umfasst das Aktivieren von E-Mail/Passwort-Authentifizierung und das Anpassen der E-Mail-Vorlagen (z.B. für die Registrierungsbestätigung).

Bucket: Ein Storage Bucket mit dem Namen anki_decks wird erstellt.

Zugriffs-Policy: Der Bucket sollte als privat konfiguriert werden. Der Zugriff auf die Dateien erfolgt ausschließlich über signierte URLs, die von der Anwendung generiert werden. Dies stellt sicher, dass nur der Besitzer eines Decks die zugehörige Datei herunterladen kann.

Dies ist das Herzstück der Anwendung. Eine in TypeScript geschriebene Supabase Edge Function.

Trigger: Wird per HTTPS-Request vom Frontend aufgerufen.

Eingabe (Payload): Ein JSON-Objekt mit { deckName: string, textInput: string }.

Ablauf:

Authentifizierung prüfen: Die Funktion stellt sicher, dass der Aufruf von einem authentifizierten Benutzer kommt.

Prompt Engineering: Die Funktion formatiert den textInput in einen präzisen Prompt für die OpenAI API. Beispiel:

"Analysiere den folgenden Text und erstelle daraus eine Liste von Frage-Antwort-Paaren für Anki-Karteikarten. Jedes Paar sollte ein klares, präzises Konzept abfragen. Die Vorderseite soll die Frage enthalten und die Rückseite die Antwort. Gib das Ergebnis ausschließlich als JSON-Array von Objekten zurück, wobei jedes Objekt die Schlüssel 'front' und 'back' hat. Text: [Hier der User-Input einfügen]"

API-Aufruf: Die Funktion sendet den Prompt an die OpenAI API und wartet auf die Antwort. Fehlerbehandlung für den Fall, dass die API nicht erreichbar ist oder einen Fehler zurückgibt, ist hier entscheidend.

Datenformatierung (Anki-Format): Die KI gibt idealerweise ein JSON-Array zurück. Die Funktion parst dieses JSON und konvertiert es in ein Anki-importierbares Textformat. Das einfachste und robusteste Format ist eine CSV-Datei, bei der jede Zeile eine Karte darstellt und Vorder- und Rückseite durch ein Semikolon getrennt sind.

Beispiel-Output der Funktion (als String):

Generated code
"Was ist die Hauptstadt von Frankreich?";"Paris"
"Wie hoch ist der Eiffelturm?";"330 Meter"


Speicherung im Storage: Die Funktion speichert den generierten CSV-String als Datei im Supabase Storage Bucket anki_decks. Der Dateiname könnte eine Kombination aus der user_id und einer neuen uuid sein, um Eindeutigkeit zu gewährleisten (z.B. /benutzer-id/deck-uuid.csv).

Datenbankeintrag: Nach erfolgreicher Speicherung der Datei trägt die Funktion die Metadaten in die decks-Tabelle der Datenbank ein (user_id, deck_name, file_path).

Antwort an das Frontend: Die Funktion gibt einen Erfolgsstatus (z.B. 201 Created) an das Frontend zurück.

4. Anki-Importformat

Dateityp: .csv (Comma-Separated Values)

Struktur:

Keine Kopfzeile.

Jede Zeile repräsentiert eine einzelne Karteikarte.

Feld 1: Text für die Kartenvorderseite ("Front").

Feld 2: Text für die Kartenrückseite ("Back").

Trennzeichen: Semikolon (;). Dies ist eine robuste Wahl, da Kommas häufig in den Texten selbst vorkommen können.

Textkodierung: UTF-8, um alle Sonderzeichen korrekt darzustellen.

Beim Import in Anki kann der Benutzer dann einfach diese CSV-Datei auswählen, das Trennzeichen auf Semikolon setzen und die Felder korrekt zuweisen (Feld 1 -> Vorderseite, Feld 2 -> Rückseite).