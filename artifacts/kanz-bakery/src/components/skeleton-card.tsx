import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeletonCard() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
