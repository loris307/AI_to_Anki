"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LogOut, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { user, signOut, session } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Bist du sicher, dass du deinen Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Decks werden gelöscht."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { action: 'delete' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Account wurde erfolgreich gelöscht - User abmelden und zur Startseite weiterleiten
      await signOut(); // Lokale Session löschen
      router.push('/?deleted=true');
    } catch (error: any) {
      console.error('Account deletion error:', error);
      alert(`Fehler beim Löschen des Accounts: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold text-foreground">
              AI to Anki
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/create-deck" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Deck erstellen
              </Button>
            </Link>
            
            <Link href="/my-decks" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Meine Decks
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Wird gelöscht...' : 'Account löschen'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}