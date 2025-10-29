import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import type { Club } from "@shared/schema";

interface ClubCardProps {
  club: Club;
  matchPercentage?: number;
}

export function ClubCard({ club, matchPercentage }: ClubCardProps) {
  const { t, i18n } = useTranslation();
  
  const getLocalizedText = (en: string, kz?: string | null, ru?: string | null) => {
    if (i18n.language === "kz" && kz) return kz;
    if (i18n.language === "ru" && ru) return ru;
    return en;
  };
  
  const name = getLocalizedText(club.name, club.nameKz, club.nameRu);
  const description = getLocalizedText(club.description, club.descriptionKz, club.descriptionRu);
  
  const enrollmentPercentage = (club.currentEnrollment / club.maxCapacity) * 100;
  const isAlmostFull = enrollmentPercentage > 80;
  
  return (
    <Card className="overflow-hidden card-hover glass-effect border-2" data-testid={`club-card-${club.id}`}>
      {club.imageUrl && (
        <div className="aspect-video bg-muted overflow-hidden relative">
          <img
            src={club.imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            data-testid={`club-image-${club.id}`}
          />
          {matchPercentage !== undefined && (
            <div className="absolute top-3 right-3">
              <span className="badge-success shadow-lg" data-testid={`match-percentage-${club.id}`}>
                ⭐ {matchPercentage}% {t("match") || "match"}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-xl text-card-foreground" data-testid={`club-name-${club.id}`}>
            {name}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`club-description-${club.id}`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <span className="badge-info" data-testid={`club-category-${club.id}`}>{club.category}</span>
          <span className="badge-info" data-testid={`club-age-${club.id}`}>{club.ageGroup}</span>
          <span className="badge-info" data-testid={`club-level-${club.id}`}>{club.skillLevel}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium" data-testid={`club-capacity-${club.id}`}>
              {club.currentEnrollment}/{club.maxCapacity} {t("enrolled")}
            </span>
            {isAlmostFull && (
              <span className="badge-warning">{t("almostFull") || "Almost full!"}</span>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isAlmostFull ? 'bg-orange-500' : 'bg-primary'
              }`}
              style={{ width: `${enrollmentPercentage}%` }}
            />
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span>📍</span>
            <span data-testid={`club-location-${club.id}`}>{club.location}</span>
          </div>
        </div>
        
        <Link href={`/clubs/${club.id}`}>
          <Button className="w-full shadow-md hover:shadow-lg transition-all" data-testid={`button-club-details-${club.id}`}>
            {t("learnMore")}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
