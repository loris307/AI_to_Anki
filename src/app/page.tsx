"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navigation } from "@/components/navigation";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lade...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Falls das zu lange dauert, sind möglicherweise die Environment Variables nicht gesetzt.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI to Anki
            </h1>
            <p className="text-muted-foreground mb-8">
              Erstelle automatisch Anki-Decks aus beliebigen Texten
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-border">
              <CardContent className="p-6">
                <Link href="/login">
                  <Button className="w-full mb-4">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Registrieren
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Willkommen zurück!
            </h1>
            <p className="text-muted-foreground mb-8">
              Erstelle automatisch Anki-Decks aus beliebigen Texten
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-border">
              <CardContent className="p-6">
                <Link href="/create-deck">
                  <Button className="w-full mb-4">
                    Deck erstellen
                  </Button>
                </Link>
                <Link href="/my-decks">
                  <Button variant="outline" className="w-full">
                    Meine Decks anzeigen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}