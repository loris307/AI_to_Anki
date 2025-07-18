import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-4xl mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Impressum
          </h1>
        </div>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Angaben gemäß § 5 TMG</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground">
            <div>
              <p className="font-medium">Loris Jaro Galler</p>
              <p>c/o IP-Management #5476</p>
              <p>Ludwig-Erhard-Str. 18</p>
              <p>20459 Hamburg</p>
              <p>Deutschland</p>
            </div>
            
            <div>
              <p className="font-medium">E-Mail:</p>
              <p>lorisgaller.business@gmail.com</p>
            </div>
            
            <div>
              <p className="font-medium">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</p>
              <p>Loris Jaro Galler</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}