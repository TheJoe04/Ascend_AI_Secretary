import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function StatusPill({ status, children, className }: StatusPillProps) {
  const getVariant = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'secondary';
      case 'neutral':
      default:
        return 'outline';
    }
  };

  return (
    <Badge 
      variant={getVariant() as any} 
      className={cn("font-medium", className)}
    >
      {children}
    </Badge>
  );
}

