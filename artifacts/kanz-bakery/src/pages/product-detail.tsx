import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, ChevronRight, Info, Minus, Plus, ShoppingBag } from "lucide-react";
import { 
  useGetProductBySlug, 
  useListReviews,
  useCreateReview
} from "@workspace/api-client-react";
import { getGetProductBySlugQueryKey, getListReviewsQueryKey } from "@workspace/api-client-react";
import { DietaryBadge } from "@/components/dietary-badge";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

const reviewFormSchema = z.object({
  reviewerName: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").optional().or(z.literal(""))
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: product, isLoading: productLoading, error: productError } = useGetProductBySlug(slug || "");
  
  const productId = product?.id;
  
  const { data: reviewsData, isLoading: reviewsLoading } = useListReviews(
    { productId: productId as number, limit: 10 },
    { query: { enabled: !!productId } }
  );

  const createReviewMutation = useCreateReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerName: "",
      rating: 5,
      comment: ""
    }
  });

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Kanz Bakery`;
    }
  }, [product]);

  if (productError) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-destructive mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/menu">
          <Button>Return to Menu</Button>
        </Link>
      </div>
    );
  }

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => q + 1);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product?.name} has been added to your bag.`,
      duration: 3000,
    });
  };

  const onSubmitReview = (data: ReviewFormValues) => {
    if (!productId) return;
    
    createReviewMutation.mutate({
      data: {
        productId,
        rating: data.rating,
        reviewerName: data.reviewerName || undefined,
        comment: data.comment || undefined,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
        setIsReviewOpen(false);
        form.reset();
        // Invalidate reviews to refetch
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey({ productId }) });
        queryClient.invalidateQueries({ queryKey: getGetProductBySlugQueryKey(slug as string) });
      },
      onError: (error) => {
        toast({
          title: "Failed to submit review",
          description: error.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  if (productLoading || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.items || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-card border-b border-border/50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/menu" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Menu
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-border" />
            <Link href={`/menu?category=${product.categoryId}`} className="hover:text-primary transition-colors">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-border" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border shadow-sm">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                  <span className="font-serif italic text-2xl opacity-50">Kanz Bakery</span>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button key={i} className="aspect-square rounded-md overflow-hidden bg-muted border border-border/50 hover:border-primary transition-colors">
                    <img src={img} alt={`${product.name} detail ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 mb-4">
                {product.categoryName}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl font-semibold text-primary">
                  ${Number(product.price).toFixed(2)}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm">
                  <StarRating rating={product.averageRating || 0} />
                  <span className="font-medium">{product.averageRating ? Number(product.averageRating).toFixed(1) : "New"}</span>
                  <span className="text-muted-foreground">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-foreground/80 font-light leading-relaxed mb-8">
              {product.description || product.shortDescription || "A delicious artisanal creation from our bakery."}
            </p>

            {product.dietaryLabels && product.dietaryLabels.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="font-serif font-medium text-lg">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {product.dietaryLabels.map(label => (
                    <DietaryBadge key={label} label={label} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <span className={product.available ? "text-green-600 dark:text-green-400 font-medium flex items-center gap-1" : "text-destructive font-medium"}>
                  {product.available ? <><CheckCircle2 className="w-4 h-4" /> Available today</> : "Sold out"}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-input rounded-md h-12">
                  <button 
                    onClick={handleDecrease}
                    disabled={!product.available}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-full flex items-center justify-center font-medium text-foreground border-x border-input">
                    {quantity}
                  </div>
                  <button 
                    onClick={handleIncrease}
                    disabled={!product.available}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className="flex-1 h-12 text-base shadow-sm gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart — ${(Number(product.price) * quantity).toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Ingredients & Allergens Accordion/Section */}
            <div className="space-y-6 pt-6 border-t border-border">
              {product.ingredients && (
                <div>
                  <h3 className="font-serif font-medium text-lg mb-2">Ingredients</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}
              
              {product.allergens && product.allergens.length > 0 && (
                <div>
                  <h3 className="font-serif font-medium text-lg flex items-center gap-2 mb-2 text-destructive">
                    <Info className="w-4 h-4" /> Allergens Info
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    Contains: {product.allergens.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baked in a facility that handles nuts, dairy, eggs, and gluten.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-12 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <StarRating rating={product.averageRating || 0} size="md" />
                <span className="font-medium text-lg">{product.averageRating ? Number(product.averageRating).toFixed(1) : 0} out of 5</span>
                <span className="text-muted-foreground">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <Button onClick={() => setIsReviewOpen(!isReviewOpen)} variant={isReviewOpen ? "outline" : "default"}>
              {isReviewOpen ? "Cancel" : "Write a Review"}
            </Button>
          </div>

          {isReviewOpen && (
            <div className="bg-card border border-border p-6 md:p-8 rounded-lg mb-12 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-serif font-bold mb-6">Share your thoughts</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="reviewerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="How should we call you?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating *</FormLabel>
                          <FormControl>
                            <div className="py-2">
                              <StarRating 
                                rating={field.value} 
                                interactive 
                                onRatingChange={field.onChange}
                                size="lg"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What did you think about this product?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={createReviewMutation.isPending}
                    >
                      {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          <div className="space-y-6">
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-border/50 rounded-lg p-6 bg-card/50">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border/80 rounded-lg p-6 bg-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="font-medium">{review.reviewerName || "Anonymous"}</span>
                        <div className="mt-1">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    {review.comment ? (
                      <p className="text-foreground/80 text-sm leading-relaxed">{review.comment}</p>
                    ) : (
                      <p className="text-muted-foreground/50 text-sm italic">No comment provided.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-border border-dashed rounded-lg bg-card/50">
                <p className="text-muted-foreground">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
