import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DietaryBadge({ label, className }: { label: string; className?: string }) {
  // Map standard dietary labels to specific colors
  const colorMap: Record<string, string> = {
    "Vegan": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    "Vegetarian": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    "Gluten-free": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    "Dairy-free": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    "Nut-free": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    "Organic": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
  };

  const defaultClasses = "bg-secondary text-secondary-foreground border-border";
  const mappedClass = colorMap[label] || defaultClasses;

  return (
    <Badge variant="outline" className={cn("font-medium text-[10px] px-1.5 py-0 rounded-sm uppercase tracking-wider", mappedClass, className)}>
      {label}
    </Badge>
  );
}
