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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI to Anki
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Erstelle automatisch Anki-Decks aus beliebigen Texten
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anmelden</CardTitle>
                <CardDescription>
                  Melde dich an, um deine Decks zu erstellen und zu verwalten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button className="w-full">
                    Anmelden
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registrieren</CardTitle>
                <CardDescription>
                  Erstelle einen neuen Account
                </CardDescription>
              </CardHeader>
              <CardContent>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <main className="flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8 mt-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Willkommen zurück!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Erstelle automatisch Anki-Decks aus beliebigen Texten
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Neues Deck erstellen</CardTitle>
                <CardDescription>
                  Füge einen Text ein und erstelle automatisch ein Anki-Deck
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/create-deck">
                  <Button className="w-full">
                    Deck erstellen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meine Decks</CardTitle>
                <CardDescription>
                  Verwalte und downloade deine erstellten Decks
                </CardDescription>
              </CardHeader>
              <CardContent>
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