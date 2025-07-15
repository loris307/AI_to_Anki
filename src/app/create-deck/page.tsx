"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useAuth();

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!deckName.trim() || !textInput.trim()) {
      setError("Bitte fülle alle Felder aus");
      return;
    }

    if (!session) {
      setError("Du musst angemeldet sein, um ein Deck zu erstellen");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call Supabase Edge Function
      const { data, error: edgeFunctionError } = await supabase.functions.invoke('create-deck', {
        body: {
          deckName: deckName.trim(),
          textInput: textInput.trim()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (edgeFunctionError) {
        throw edgeFunctionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Success - redirect to my decks page
      router.push("/my-decks?success=deck-created");
    } catch (err: any) {
      console.error("Deck creation error:", err);
      setError(err.message || "Fehler beim Erstellen des Decks. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Neues Anki-Deck erstellen
            </h1>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Zurück zur Startseite
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Deck-Informationen</CardTitle>
              <CardDescription>
                Füge deinen Text ein und gib dem Deck einen Namen
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateDeck}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="deckName">Name des Decks</Label>
                  <Input
                    id="deckName"
                    placeholder="z.B. Geschichte Kapitel 1"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textInput">Text hier einfügen (z.B. ein YouTube-Skript)</Label>
                  <Textarea
                    id="textInput"
                    placeholder="Füge hier deinen Text ein, aus dem das Anki-Deck erstellt werden soll..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={12}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    Die KI wird aus diesem Text automatisch Frage-Antwort-Paare für Anki-Karteikarten erstellen.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Deck wird generiert... (dies kann 30-60 Sekunden dauern)" : "Deck generieren"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
}