"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function DeletedMessage() {
  const searchParams = useSearchParams();
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get('deleted') === 'true') {
      setShowDeletedMessage(true);
      setTimeout(() => setShowDeletedMessage(false), 8000);
    }
  }, [searchParams]);

  if (!showDeletedMessage) return null;

  return (
    <div className="p-3 text-sm text-green-400 bg-green-950/50 border border-green-800 rounded-md text-center">
      Account wurde erfolgreich gelöscht.
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lade...</p>
            <p className="text-xs text-muted-foreground mt-2">
              Falls das zu lange dauert, sind möglicherweise die Environment Variables nicht gesetzt.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8">
            <Suspense fallback={<div></div>}>
              <DeletedMessage />
            </Suspense>
            
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center p-4">
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
      <Footer />
    </div>
  );
}