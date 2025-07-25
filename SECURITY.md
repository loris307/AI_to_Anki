# Sicherheitsrichtlinien

## Umgebungsvariablen

### Lokale Entwicklung
- Kopiere `.env.example` zu `.env.local`
- Füge deine eigenen Supabase-Credentials hinzu
- **NIEMALS** committen: `.env.local` ist bereits in `.gitignore`

### Produktion (Vercel)
Die folgenden Umgebungsvariablen müssen im Vercel Dashboard konfiguriert werden:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Supabase Edge Functions
Zusätzliche Variablen im Supabase Dashboard:
```
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Deployment-Checklist

- [ ] `.env.local` niemals committen
- [ ] Alle Secrets im Vercel Dashboard konfiguriert
- [ ] Supabase RLS-Policies aktiviert
- [ ] Storage-Policies konfiguriert

## Sicherheitsmeldungen

Bei Sicherheitsproblemen, kontaktiere: [Deine E-Mail]