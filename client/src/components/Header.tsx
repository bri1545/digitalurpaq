import { MenuNavigation } from "@/components/MenuNavigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "wouter";
import { GraduationCap, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

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
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-effect border border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
            <div className="flex flex-col items-end text-xs leading-tight">
              <span className="font-semibold text-foreground">{formatTime(currentTime)}</span>
              <span className="text-muted-foreground text-[10px]">{formatDate(currentTime)}</span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
