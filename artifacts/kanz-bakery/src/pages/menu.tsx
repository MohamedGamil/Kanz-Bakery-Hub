import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
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
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialCategoryId ? parseInt(initialCategoryId, 10) : undefined
  );
  
  // Dietary filters (client side since API doesn't seem to support dietary params directly, we will filter after fetching if possible, or assume API might have a way. The ListProductsParams only has categoryId, search, featured, available, page, limit)
  // Let's rely on search for everything else or just use what we have
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    document.title = "Our Menu | Kanz Bakery";
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: categories } = useListCategories();
  
  const queryParams = useMemo(() => {
    const params: any = { limit: 100 };
    if (selectedCategory) params.categoryId = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    if (showAvailableOnly) params.available = true;
    return params;
  }, [selectedCategory, debouncedSearch, showAvailableOnly]);

  const { data: productsData, isLoading } = useListProducts(queryParams);
  const products = productsData?.items || [];

  const handleCategoryClick = (id?: number) => {
    setSelectedCategory(id);
    // Remove from URL if we click "All"
    if (!id) {
      window.history.replaceState({}, "", "/menu");
    } else {
      window.history.replaceState({}, "", `/menu?category=${id}`);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="bg-secondary/30 border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground font-light">
            Baked fresh daily. From our signature sourdough to delicate French pastries, explore our full artisanal collection.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(undefined)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    !selectedCategory 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  All Products
                </button>
                {categories?.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
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

            <div>
              <h3 className="font-serif font-bold text-lg mb-4">Filters</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Show available only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col space-y-6">
            
            {/* Mobile Controls & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto lg:hidden flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters & Categories
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader className="text-left mb-6">
                      <SheetTitle className="font-serif">Menu Options</SheetTitle>
                      <SheetDescription>
                        Filter our products by category or availability.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-serif font-bold text-lg mb-4">Categories</h3>
                        <div className="space-y-1">
                          <SheetClose asChild>
                            <button
                              onClick={() => handleCategoryClick(undefined)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                !selectedCategory 
                                  ? "bg-primary/10 text-primary font-medium" 
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              }`}
                            >
                              All Products
                            </button>
                          </SheetClose>
                          {categories?.map(category => (
                            <SheetClose asChild key={category.id}>
                              <button
                                onClick={() => handleCategoryClick(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
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

                      <div>
                        <h3 className="font-serif font-bold text-lg mb-4">Filters</h3>
                        <div className="space-y-4">
                          <label className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={showAvailableOnly}
                              onChange={(e) => setShowAvailableOnly(e.target.checked)}
                              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                            />
                            <span>Show available only</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || debouncedSearch || showAvailableOnly) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-accent text-accent-foreground">
                    Category: {categories?.find(c => c.id === selectedCategory)?.name || 'Selected'}
                    <X className="h-3 w-3 cursor-pointer ml-1 hover:text-primary" onClick={() => handleCategoryClick(undefined)} />
                  </Badge>
                )}
                {debouncedSearch && (
                  <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-accent text-accent-foreground">
                    Search: "{debouncedSearch}"
                    <X className="h-3 w-3 cursor-pointer ml-1 hover:text-primary" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {showAvailableOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1 font-normal bg-accent text-accent-foreground">
                    Available Only
                    <X className="h-3 w-3 cursor-pointer ml-1 hover:text-primary" onClick={() => setShowAvailableOnly(false)} />
                  </Badge>
                )}
                <button 
                  onClick={() => {
                    handleCategoryClick(undefined);
                    setSearchQuery("");
                    setShowAvailableOnly(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                "Loading menu..."
              ) : (
                `Showing ${products.length} product${products.length === 1 ? '' : 's'}`
              )}
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-lg border border-border border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-serif font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleCategoryClick(undefined);
                    setSearchQuery("");
                    setShowAvailableOnly(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
