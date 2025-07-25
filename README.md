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

⚠️ **Wichtig**: `.env.local` wird von Git ignoriert und sollte niemals committed werden!

4. Entwicklungsserver starten:
```bash
npm run dev
```


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

## Deployment

### Vercel Deployment
1. Verbinde dein GitHub Repository mit Vercel
2. Konfiguriere folgende Umgebungsvariablen im Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Siehe [SECURITY.md](SECURITY.md) für detaillierte Sicherheitsrichtlinien.

