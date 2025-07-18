import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-4xl mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Datenschutzerklärung
          </h1>
        </div>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Verantwortlich für die Datenverarbeitung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <div>
              <p className="font-medium">Loris Jaro Galler</p>
              <p>c/o IP-Management #5476</p>
              <p>Ludwig-Erhard-Str. 18</p>
              <p>20459 Hamburg</p>
              <p>Deutschland</p>
              <p className="mt-2"><strong>E-Mail:</strong> lorisgaller.business@gmail.com</p>
            </div>
            
            <hr className="border-border" />
            
            <div>
              <h2 className="text-lg font-semibold mb-3">1. Allgemeine Hinweise</h2>
              <p className="text-sm leading-relaxed">
                Diese WebApp („AI to Anki") verarbeitet personenbezogene Daten ausschließlich im Rahmen der geltenden Datenschutzgesetze, insbesondere der DSGVO. Diese Datenschutzerklärung informiert darüber, welche Daten zu welchem Zweck verarbeitet werden und welche Rechte dir zustehen.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">2. Erhobene Daten</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Registrierung & Login</h3>
                  <p className="text-sm leading-relaxed">
                    Zur Nutzung der App ist eine Registrierung mit <strong>E-Mail-Adresse und Passwort</strong> erforderlich. Die Daten werden ausschließlich zur Verwaltung deines Nutzerkontos verwendet.
                  </p>
                  <p className="text-sm leading-relaxed mt-2">
                    Das Passwort wird verschlüsselt gespeichert (via Supabase Auth mit bcrypt).
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Hochgeladene Inhalte</h3>
                  <p className="text-sm leading-relaxed">
                    Die von dir hochgeladenen Texte werden verarbeitet, um Karteikarten zu generieren. Die Verarbeitung erfolgt automatisiert durch die <strong>OpenAI API</strong>. Es findet keine dauerhafte Speicherung der Inhalte statt.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Server-Logs</h3>
                  <p className="text-sm leading-relaxed">
                    Der Hosting-Anbieter <strong>Vercel</strong> erhebt ggf. technische Daten (z. B. IP-Adresse, Browser-Typ, Zugriffszeitpunkt), um den Betrieb der App sicherzustellen.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">3. Zweck der Datenverarbeitung</h2>
              <ul className="text-sm leading-relaxed space-y-1">
                <li>• Bereitstellung der Funktionalitäten der WebApp</li>
                <li>• Nutzerverwaltung und Login</li>
                <li>• Erstellung von Karteikarten aus Texten über die OpenAI API</li>
                <li>• Systemsicherheit und Fehleranalyse</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">4. Rechtsgrundlage</h2>
              <p className="text-sm leading-relaxed">
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Betrieb und Sicherheit der App).
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">5. Empfänger der Daten</h2>
              <ul className="text-sm leading-relaxed space-y-1">
                <li>• <strong>Supabase Inc.</strong> (Auth & Datenbankdienste)</li>
                <li>• <strong>Vercel Inc.</strong> (Hosting)</li>
                <li>• <strong>OpenAI, L.L.C.</strong> (KI-Verarbeitung der Inhalte)</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Diese Dienstleister handeln als Auftragsverarbeiter im Sinne der DSGVO, ggf. mit Sitz in den USA. Es bestehen DSGVO-konforme Verträge (Standardvertragsklauseln).
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">6. Speicherdauer</h2>
              <ul className="text-sm leading-relaxed space-y-1">
                <li>• Nutzerdaten bleiben gespeichert, solange ein Konto besteht.</li>
                <li>• Textinhalte zur Kartenerstellung werden <strong>nicht dauerhaft gespeichert</strong>.</li>
                <li>• Server-Logs durch Vercel: laut Anbieter maximal 30 Tage.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">7. Deine Rechte</h2>
              <p className="text-sm leading-relaxed mb-2">Du hast jederzeit das Recht auf:</p>
              <ul className="text-sm leading-relaxed space-y-1">
                <li>• Auskunft über deine gespeicherten Daten</li>
                <li>• Berichtigung unrichtiger Daten</li>
                <li>• Löschung deiner Daten („Recht auf Vergessenwerden")</li>
                <li>• Einschränkung der Verarbeitung</li>
                <li>• Datenübertragbarkeit</li>
                <li>• Widerspruch gegen die Verarbeitung</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Bitte kontaktiere uns dazu unter: <strong>lorisgaller.business@gmail.com</strong>
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">8. SSL-Verschlüsselung</h2>
              <p className="text-sm leading-relaxed">
                Die Verbindung zu dieser WebApp erfolgt über eine gesicherte HTTPS-Verbindung.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">9. Änderungen</h2>
              <p className="text-sm leading-relaxed">
                Diese Datenschutzerklärung kann bei Bedarf angepasst werden. Die aktuelle Version ist jederzeit auf der Website einsehbar.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}