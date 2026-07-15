import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Product } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { DietaryBadge } from "./dietary-badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={`/menu/${product.slug}`} className={cn("block group h-full", className)}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
              <span className="font-serif italic text-lg opacity-50">Kanz Bakery</span>
            </div>
          )}

          {/* Category badge — logical start position (LTR: top-left, RTL: top-right) */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm font-medium">
              {product.categoryName}
            </Badge>
          </div>

          {/* Featured badge — logical end position */}
          {product.featured && (
            <div className="absolute top-2 end-2">
              <Badge className="bg-primary text-primary-foreground shadow-sm font-medium border-none">
                {t("productCard.featured")}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col h-[calc(100%-100%)]">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="font-semibold text-primary shrink-0">${Number(product.price).toFixed(2)}</span>
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-grow">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-auto space-y-3 pt-2">
            {product.dietaryLabels && product.dietaryLabels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.dietaryLabels.slice(0, 3).map(label => (
                  <DietaryBadge key={label} label={label} />
                ))}
                {product.dietaryLabels.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{product.dietaryLabels.length - 3} {t("productCard.more")}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.averageRating || 0} />
                <span>({product.reviewCount || 0})</span>
              </div>
              <span className={product.available ? "text-green-600 dark:text-green-400" : "text-destructive"}>
                {product.available ? t("productCard.available") : t("productCard.soldOut")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
