import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPI } from "@/lib/types";

interface KpiCardProps {
  kpi: KPI;
  className?: string;
}

export function KpiCard({ kpi, className }: KpiCardProps) {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'duration':
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      default:
        return value.toLocaleString();
    }
  };

  const getDeltaIcon = () => {
    if (!kpi.delta || !kpi.deltaType) return null;
    
    switch (kpi.deltaType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeltaColor = () => {
    if (!kpi.delta || !kpi.deltaType) return 'text-muted-foreground';
    
    switch (kpi.deltaType) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        {getDeltaIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(kpi.value, kpi.format)}</div>
        {kpi.delta && kpi.deltaType && (
          <p className={cn("text-xs flex items-center gap-1", getDeltaColor())}>
            {getDeltaIcon()}
            {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
            <span className="text-muted-foreground">from yesterday</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

