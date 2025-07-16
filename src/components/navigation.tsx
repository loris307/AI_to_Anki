"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Logout error:", error);
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
            
            <div className="flex items-center space-x-2 px-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}