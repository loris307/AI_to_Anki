# AI to Anki - Deck Creator

Eine Next.js-Anwendung, die automatisch Anki-Decks aus beliebigen Texten erstellt.

## Features

- **Deck-Erstellung**: Füge beliebige Texte ein (z.B. YouTube-Skripte) und erstelle automatisch Anki-Karteikarten
- **Deck-Verwaltung**: Verwalte und downloade alle deine erstellten Decks
- **Benutzerauthentifizierung**: Sichere Anmeldung mit Supabase Auth
- **Responsive Design**: Optimiert für Desktop und Mobile mit Tailwind CSS

## Technologie-Stack

- **Frontend**: Next.js 14 mit TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **UI-Komponenten**: shadcn/ui
- **KI-Integration**: OpenAI API für Kartenerstellung

## Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd ai-to-anki
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
```bash
cp .env.example .env.local
```

Füge deine Supabase-Konfiguration in `.env.local` hinzu:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Entwicklungsserver starten:
```bash
npm run dev
```

## Supabase Setup

### Datenbank-Schema

Erstelle die folgende Tabelle in deiner Supabase-Datenbank:

```sql
-- Create the decks table
CREATE TABLE public.decks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_path TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own decks" ON public.decks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks" ON public.decks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Storage Setup

1. Erstelle einen Storage Bucket namens `anki_decks`
2. Konfiguriere ihn als privat
3. Erstelle entsprechende Storage-Policies für den Zugriff

## Projekt-Struktur

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Startseite
│   ├── login/             # Anmelde-Seite
│   ├── register/          # Registrierungs-Seite
│   ├── create-deck/       # Deck-Erstellung
│   └── my-decks/          # Deck-Verwaltung
├── components/
│   └── ui/                # shadcn/ui Komponenten
└── lib/
    ├── supabase.ts        # Supabase Client
    └── utils.ts           # Utility-Funktionen
```

## Verwendung

1. **Registrierung/Anmeldung**: Erstelle einen Account oder melde dich an
2. **Deck erstellen**: Navigiere zu "Deck erstellen", füge deinen Text ein und gib einen Namen ein
3. **Deck herunterladen**: Besuche "Meine Decks" und downloade deine erstellten Decks
4. **Anki-Import**: Importiere die CSV-Datei in Anki mit Semikolon als Trennzeichen

## Anki-Importformat

Die generierten Dateien sind CSV-Dateien mit folgendem Format:
- Trennzeichen: Semikolon (;)
- Feld 1: Vorderseite der Karte
- Feld 2: Rückseite der Karte
- Kodierung: UTF-8

## Entwicklung

```bash
# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build

# Linting
npm run lint
```

## Nächste Schritte

- [ ] Supabase Edge Function für KI-Integration implementieren
- [ ] Authentifizierung vollständig integrieren
- [ ] Error Handling und Loading States verbessern
- [ ] Tests hinzufügen
- [ ] Deployment-Konfiguration