"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Deck {
  id: string;
  deck_name: string;
  created_at: string;
  file_path: string;
}

export default function MyDecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        // TODO: Implement Supabase query
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDecks: Deck[] = [
          {
            id: "1",
            deck_name: "Geschichte Kapitel 1",
            created_at: "2024-01-15T10:30:00Z",
            file_path: "/user-123/deck-1.csv"
          },
          {
            id: "2",
            deck_name: "Mathematik Grundlagen",
            created_at: "2024-01-14T14:20:00Z",
            file_path: "/user-123/deck-2.csv"
          },
          {
            id: "3",
            deck_name: "YouTube Video - Physik",
            created_at: "2024-01-13T09:15:00Z",
            file_path: "/user-123/deck-3.csv"
          }
        ];
        
        setDecks(mockDecks);
      } catch (error) {
        console.error("Error fetching decks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleDownload = async (deck: Deck) => {
    try {
      // TODO: Implement Supabase Storage download
      console.log("Downloading deck:", deck.file_path);
      
      // Simulate download
      const blob = new Blob(['"Was ist 2+2?";"4"\n"Hauptstadt von Deutschland?";"Berlin"'], {
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade deine Decks...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meine Decks
          </h1>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Zurück zur Startseite
            </Link>
            <Link href="/create-deck" className="text-blue-600 hover:underline">
              Neues Deck erstellen
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deine erstellten Decks</CardTitle>
            <CardDescription>
              Hier findest du alle deine generierten Anki-Decks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {decks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Du hast noch keine Decks erstellt.</p>
                <Link href="/create-deck">
                  <Button>
                    Erstes Deck erstellen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deck-Name</TableHead>
                      <TableHead>Erstellt am</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decks.map((deck) => (
                      <TableRow key={deck.id}>
                        <TableCell className="font-medium">
                          {deck.deck_name}
                        </TableCell>
                        <TableCell>
                          {formatDate(deck.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(deck)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}