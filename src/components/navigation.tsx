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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              AI to Anki
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/create-deck">
              <Button variant="outline">
                Deck erstellen
              </Button>
            </Link>
            
            <Link href="/my-decks">
              <Button variant="outline">
                Meine Decks
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
            
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}