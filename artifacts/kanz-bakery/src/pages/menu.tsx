import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  useListProducts,
  useListCategories
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ProductSkeletonCard } from "@/components/skeleton-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Menu() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialCategoryId ? parseInt(initialCategoryId, 10) : undefined
  );

  useEffect(() => {
    document.title = t("menu.pageTitle");
  }, [t]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: categories } = useListCategories();

  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = { limit: 100 };
    if (selectedCategory) params.categoryId = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [selectedCategory, debouncedSearch]);

  const { data: productsData, isLoading } = useListProducts(queryParams);
  const products = productsData?.items || [];

  const handleCategoryClick = (id?: number) => {
    setSelectedCategory(id);
    if (!id) {
      window.history.replaceState({}, "", "/menu");
    } else {
      window.history.replaceState({}, "", `/menu?category=${id}`);
    }
  };

  const hasFilters = !!(selectedCategory || debouncedSearch);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t("menu.title")}</h1>
          <p className="text-lg text-muted-foreground font-light">{t("menu.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">{t("menu.categories")}</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(undefined)}
                  className={`w-full text-start px-3 py-2 rounded-md text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t("menu.allProducts")}
                </button>
                {categories?.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-start px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                      selectedCategory === category.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded-full">{category.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col space-y-6 min-w-0">

            {/* Search + mobile filter */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={t("menu.searchPlaceholder")}
                  className="ps-9 bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t("menu.filterSheet")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif">{t("menu.sheetTitle")}</SheetTitle>
                    <SheetDescription>{t("menu.sheetDesc")}</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-serif font-bold text-lg mb-4">{t("menu.categories")}</h3>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <button
                            onClick={() => handleCategoryClick(undefined)}
                            className={`w-full text-start px-3 py-2 rounded-md text-sm transition-colors ${
                              !selectedCategory
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            {t("menu.allProducts")}
                          </button>
                        </SheetClose>
                        {categories?.map(category => (
                          <SheetClose asChild key={category.id}>
                            <button
                              onClick={() => handleCategoryClick(category.id)}
                              className={`w-full text-start px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                                selectedCategory === category.id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              }`}
                            >
                              <span>{category.name}</span>
                              <span className="text-[10px] bg-muted border px-1.5 py-0.5 rounded-full">{category.productCount}</span>
                            </button>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("menu.activeFilters")}</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-accent text-accent-foreground">
                    {t("menu.categoryLabel")} {categories?.find(c => c.id === selectedCategory)?.name || ""}
                    <X className="h-3 w-3 cursor-pointer ms-1 hover:text-primary" onClick={() => handleCategoryClick(undefined)} />
                  </Badge>
                )}
                {debouncedSearch && (
                  <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-accent text-accent-foreground">
                    {t("menu.searchLabel")} "{debouncedSearch}"
                    <X className="h-3 w-3 cursor-pointer ms-1 hover:text-primary" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                <button
                  onClick={() => {
                    handleCategoryClick(undefined);
                    setSearchQuery("");
                  }}
                  className="text-xs text-muted-foreground hover:text-primary underline ms-2"
                >
                  {t("menu.clearAll")}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {isLoading
                ? t("menu.loading")
                : t(`menu.showing_${products.length === 1 ? "one" : "other"}`, { count: products.length })}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <ProductSkeletonCard key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-lg border border-border border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-serif font-semibold mb-2">{t("menu.noProducts")}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("menu.noProductsDesc")}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCategoryClick(undefined);
                    setSearchQuery("");
                  }}
                >
                  {t("menu.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
