import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  className,
  size = "sm",
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const value = i + 1;
        const isFilled = value <= rating;
        const isHalf = !isFilled && value - 0.5 <= rating;
        
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(value)}
            className={cn(
              "text-muted-foreground focus:outline-none",
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? "fill-amber-400 text-amber-400" : isHalf ? "fill-amber-400/50 text-amber-400" : "fill-transparent text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
