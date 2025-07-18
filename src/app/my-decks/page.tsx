"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";


interface Deck {
  id: string;
  deck_name: string;
  created_at: string;
  file_path: string;
}

function SuccessMessage({ onSetMessage }: { onSetMessage: (message: string | null) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success message from URL params
    if (searchParams.get('success') === 'deck-created') {
      onSetMessage('Deck wurde erfolgreich erstellt!');
      // Clear the message after 5 seconds
      setTimeout(() => onSetMessage(null), 5000);
    }
  }, [searchParams, onSetMessage]);

  return null;
}

export default function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDecks = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('decks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching decks:', error);
          return;
        }

        setDecks(data || []);
      } catch (error) {
        console.error("Error fetching decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [user]);

  const handleDownload = async (deck: Deck) => {
    try {
      // Get signed URL for the file
      const { data, error } = await supabase.storage
        .from('ankidecks')
        .createSignedUrl(deck.file_path, 60); // URL valid for 60 seconds

      if (error) {
        console.error("Error creating signed URL:", error);
        alert("Fehler beim Download. Bitte versuche es erneut.");
        return;
      }

      // Download the file
      const response = await fetch(data.signedUrl);
      const csvContent = await response.text();

      // Create and trigger download
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${deck.deck_name}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Fehler beim Download. Bitte versuche es erneut.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Lade deine Decks...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="flex-1 max-w-6xl mx-auto p-4">
          <Suspense fallback={<div></div>}>
            <SuccessMessage onSetMessage={setSuccessMessage} />
          </Suspense>
          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-400 bg-green-950/50 border border-green-800 rounded-md">
              {successMessage}
            </div>
          )}
          
          {decks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-6">Du hast noch keine Decks erstellt.</p>
              <Link href="/create-deck">
                <Button>
                  Erstes Deck erstellen
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border">
                    <TableHead className="text-foreground font-medium">Stapel</TableHead>
                    <TableHead className="text-foreground font-medium text-center">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decks.map((deck) => (
                    <TableRow key={deck.id} className="border-b border-border hover:bg-accent/50">
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">+</span>
                          <span>{deck.deck_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownload(deck)}
                          className="h-8 w-8 p-0 hover:bg-accent"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Hier findest du deine Decks! 
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}