import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MiniStatProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
  iconClassName?: string;
}

export function MiniStat({ 
  icon: Icon, 
  label, 
  value, 
  className,
  iconClassName 
}: MiniStatProps) {
  return (
    <Card className={cn("hover:shadow-sm transition-shadow", className)}>
      <CardContent className="flex items-center space-x-3 p-4">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
          iconClassName
        )}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {label}
          </p>
          <p className="text-lg font-semibold truncate">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

