import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FileText, Calendar, UserPlus, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  const { t } = useTranslation();
  
  const actions = [
    {
      icon: FileText,
      title: t("viewRules"),
      description: t("rulesDesc"),
      link: "/rules",
      testId: "action-rules"
    },
    {
      icon: Calendar,
      title: t("viewSchedule"),
      description: t("scheduleDesc"),
      link: "/schedule",
      testId: "action-schedule"
    },
    {
      icon: UserPlus,
      title: t("registerNow"),
      description: t("registerDesc"),
      link: "/clubs",
      testId: "action-register"
    },
    {
      icon: Phone,
      title: t("contactUs"),
      description: t("contactDesc"),
      link: "/contacts",
      testId: "action-contacts"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="quick-actions-grid">
      {actions.map((action, index) => (
        <Link key={action.link} href={action.link}>
          <Card 
            className="p-6 card-hover cursor-pointer glass-effect border-2 fade-in-up" 
            data-testid={action.testId}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-full shadow-md">
                <action.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-card-foreground mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
