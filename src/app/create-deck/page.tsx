"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deckName.trim() || !textInput.trim()) {
      alert("Bitte fülle alle Felder aus");
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Implement Supabase Edge Function call
      console.log("Creating deck:", { deckName, textInput });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Show success message and redirect
      alert("Deck wurde erfolgreich erstellt! Du findest es unter 'Meine Decks'.");
      router.push("/my-decks");
    } catch (error) {
      console.error("Deck creation error:", error);
      alert("Fehler beim Erstellen des Decks. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              <div className="space-y-2">
                <Label htmlFor="deckName">Name des Decks</Label>
                <Input
                  id="deckName"
                  placeholder="z.B. Geschichte Kapitel 1"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  required
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
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Deck wird generiert..." : "Deck generieren"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}