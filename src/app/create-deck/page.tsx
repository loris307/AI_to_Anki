"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const MAX_TEXT_LENGTH = 15000;
const MAX_DECKS_PER_USER = 7;

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdDecksCount, setCreatedDecksCount] = useState<number | null>(null);
  const [loadingDeckCount, setLoadingDeckCount] = useState(true);
  const router = useRouter();
  const { session, user } = useAuth();

  // Fetch current created decks count (absolute limit)
  useEffect(() => {
    const fetchDeckCount = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('created_decks_count')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching deck count:', error);
        } else {
          setCreatedDecksCount(data?.created_decks_count || 0);
        }
      } catch (error) {
        console.error('Error fetching deck count:', error);
      } finally {
        setLoadingDeckCount(false);
      }
    };

    fetchDeckCount();
  }, [user]);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!deckName.trim() || !textInput.trim()) {
      setError("Bitte fülle alle Felder aus");
      return;
    }

    if (textInput.length > MAX_TEXT_LENGTH) {
      setError(`Der Text ist zu lang. Maximal ${MAX_TEXT_LENGTH.toLocaleString()} Zeichen erlaubt.`);
      return;
    }

    if (createdDecksCount !== null && createdDecksCount >= MAX_DECKS_PER_USER) {
      setError(`Du hast das Limit von ${MAX_DECKS_PER_USER} Decks erreicht. Dies ist ein kostenloses Test-Konto mit begrenzter Nutzung.`);
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

      // Success - update deck count and redirect to my decks page
      setCreatedDecksCount(prev => prev ? prev + 1 : 1);
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
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Neues Anki-Deck erstellen
              </h1>
            </div>
          
          <Card className="border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground">Deck-Informationen</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Füge deinen Text ein und gib dem Deck einen Namen
                  </CardDescription>
                </div>
                <div className="text-right">
                  {loadingDeckCount ? (
                    <div className="text-xs text-muted-foreground">Lade...</div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Erstellt: {createdDecksCount || 0} / {MAX_DECKS_PER_USER}
                      <div className="text-xs text-yellow-400 mt-1">
                        {createdDecksCount === MAX_DECKS_PER_USER ? "Limit erreicht" : "Test-Konto"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleCreateDeck}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}
                
                {!loadingDeckCount && createdDecksCount !== null && createdDecksCount >= MAX_DECKS_PER_USER && (
                  <div className="p-3 text-sm text-yellow-400 bg-yellow-950/50 border border-yellow-800 rounded-md">
                    Du hast das Limit von {MAX_DECKS_PER_USER} Decks erreicht. 
                    Dies ist ein kostenloses Test-Konto mit begrenzter Nutzung.
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="deckName" className="text-foreground">Name des Decks</Label>
                  <Input
                    id="deckName"
                    placeholder="z.B. Geschichte Kapitel 1"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="textInput" className="text-foreground">Text hier einfügen (z.B. ein YouTube-Skript)</Label>
                    <span className={`text-xs ${textInput.length > MAX_TEXT_LENGTH * 0.9 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {textInput.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
                    </span>
                  </div>
                  <Textarea
                    id="textInput"
                    placeholder="Füge hier deinen Text ein, aus dem das Anki-Deck erstellt werden soll..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    maxLength={MAX_TEXT_LENGTH}
                    rows={12}
                    required
                    disabled={loading}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Die KI wird aus diesem Text automatisch Frage-Antwort-Paare für Anki-Karteikarten erstellen.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || loadingDeckCount || (createdDecksCount !== null && createdDecksCount >= MAX_DECKS_PER_USER)}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generiere Deck...
                    </div>
                  ) : 
                   loadingDeckCount ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Lade...
                    </div>
                   ) :
                   (createdDecksCount !== null && createdDecksCount >= MAX_DECKS_PER_USER) ? "Deck-Limit erreicht" :
                   "Deck generieren"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}