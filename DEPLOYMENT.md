# Deployment Anleitung - AI to Anki

## Supabase Setup

### 1. Supabase Projekt erstellen
1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt
2. Wähle Region (Frankfurt für deutsche Nutzer)
3. Warte bis das Projekt vollständig initialisiert ist

### 2. Datenbank Schema einrichten
Führe die Migration aus:
```sql
-- supabase/migrations/001_initial_schema.sql wurde bereits erstellt
```

Oder manuell in der Supabase SQL-Konsole:
```sql
-- Create the decks table
CREATE TABLE IF NOT EXISTS public.decks (
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

### 3. Storage Setup
1. Gehe zu Storage im Supabase Dashboard
2. Erstelle einen neuen Bucket namens `ankidecks`
3. Setze ihn auf **private**
4. Führe diese Storage Policies aus:

```sql
-- Create storage policies
CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (bucket_id = 'ankidecks' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Authentication Setup
1. Gehe zu Authentication > Settings
2. Aktiviere E-Mail/Passwort Authentication
3. Site URL setzen: `http://localhost:3000` (für Development)
4. Für Production: Deine Domain hinzufügen

### 5. Edge Function Deploy
```bash
# Supabase CLI installieren
npm install -g supabase

# Login
supabase login

# Mit Projekt verknüpfen
supabase link --project-ref YOUR_PROJECT_REF

# Edge Function deployen
supabase functions deploy create-deck
```

### 6. Environment Variables setzen
Im Supabase Dashboard unter Settings > Edge Functions:
```
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## OpenAI API Setup

### 1. OpenAI Account erstellen
1. Gehe zu [platform.openai.com](https://platform.openai.com)
2. Erstelle einen Account
3. Gehe zu API Keys und erstelle einen neuen API Key

### 2. API Key konfigurieren
- Füge den API Key in die Supabase Edge Function Environment Variables ein
- Modell: `gpt-4o-mini` (kostengünstig und effektiv)

## Frontend Deployment

### 1. Environment Variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Vercel Deployment (empfohlen)
```bash
# Vercel CLI installieren
npm install -g vercel

# Deployen
vercel

# Environment Variables in Vercel Dashboard setzen:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Alternative: Netlify/andere Hosting
- Build Command: `npm run build`
- Publish Directory: `.next`
- Environment Variables wie oben setzen

## Testen der Anwendung

### 1. Registrierung testen
1. Neue Benutzer registrieren
2. E-Mail Bestätigung (falls aktiviert)
3. Login durchführen

### 2. Deck Erstellung testen
1. Text in das Eingabefeld einfügen (z.B. einen kurzen Artikel)
2. Deck Namen vergeben
3. "Deck generieren" klicken
4. Warten (30-60 Sekunden)
5. Erfolgreiche Weiterleitung zu "Meine Decks"

### 3. Download testen
1. Erstelltes Deck in "Meine Decks" anzeigen
2. Download-Button klicken
3. CSV-Datei sollte heruntergeladen werden
4. In Anki importieren mit Semikolon als Trennzeichen

## Troubleshooting

### Edge Function Logs
```bash
supabase functions logs create-deck
```

### Häufige Probleme
1. **OpenAI API Fehler**: API Key überprüfen, Guthaben prüfen
2. **Storage Fehler**: Bucket Permissions und Policies prüfen
3. **Auth Fehler**: RLS Policies und User Permissions prüfen
4. **CORS Fehler**: Site URL in Supabase Auth Settings prüfen

### Performance Optimierung
- OpenAI Requests cachen
- File Upload Größe limitieren
- Rate Limiting implementieren
- Error Monitoring hinzufügen

## Kosten
- **Supabase**: Free Tier für kleine Anwendungen
- **OpenAI**: ~$0.001-0.003 pro Deck (abhängig von Textlänge)
- **Vercel**: Free Tier ausreichend für Hobby-Projekte