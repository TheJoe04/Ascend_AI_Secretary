import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LeadScore } from "@/lib/types";

interface LeadScoreBadgeProps {
  score: LeadScore;
  className?: string;
}

export function LeadScoreBadge({ score, className }: LeadScoreBadgeProps) {
  const getScoreConfig = (score: LeadScore) => {
    switch (score) {
      case 'Hot':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600 text-white',
          icon: '🔥'
        };
      case 'Warm':
        return {
          variant: 'warning' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          icon: '🟡'
        };
      case 'Cold':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-500 hover:bg-blue-600 text-white',
          icon: '❄️'
        };
    }
  };

  const config = getScoreConfig(score);

  return (
    <Badge 
      variant={config.variant}
      className={cn("font-medium flex items-center gap-1", config.className, className)}
    >
      <span>{config.icon}</span>
      {score}
    </Badge>
  );
}

