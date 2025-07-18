import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            © 2025 AI to Anki. Alle Rechte vorbehalten.
          </div>
          <div className="flex space-x-6">
            <Link 
              href="/impressum" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
            <Link 
              href="/datenschutz" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Datenschutzerklärung
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}