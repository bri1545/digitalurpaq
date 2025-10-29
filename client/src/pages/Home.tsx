import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { AssistantCharacter } from "@/components/AssistantCharacter";
import { QuickActions } from "@/components/QuickActions";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section with Assistant */}
        <div className="text-center space-y-8 fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold gradient-text" data-testid="text-welcome">
              {t("welcome")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              {t("findYourClub")}
            </p>
          </div>
          
          {/* Assistant Character with floating animation */}
          <div className="py-8 floating-animation">
            <AssistantCharacter />
          </div>
          
          {/* Take Quiz CTA with enhanced styling */}
          <div>
            <Link href="/quiz">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                data-testid="button-take-quiz"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                {t("takeQuiz")}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Quick Actions with glass effect */}
        <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold text-center gradient-text">{t("quickAccess")}</h2>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
