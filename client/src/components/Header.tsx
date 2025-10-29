import { MenuNavigation } from "@/components/MenuNavigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "wouter";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-effect shadow-lg" data-testid="app-header">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MenuNavigation />
          <Link href="/">
            <button className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all" data-testid="button-home-logo">
              <div className="relative">
                <GraduationCap className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              </div>
              <span className="font-bold text-foreground hidden sm:inline gradient-text text-xl">
                Digitalurpaq
              </span>
            </button>
          </Link>
        </div>
        
        <LanguageSwitcher />
      </div>
    </header>
  );
}
