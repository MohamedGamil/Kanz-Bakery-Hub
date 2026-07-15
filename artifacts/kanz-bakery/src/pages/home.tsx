import { useEffect } from "react";
import { Link } from "wouter";
import { 
  useGetFeaturedProducts, 
  useGetCatalogStats, 
  useListCategories, 
  useGetTopRatedProducts 
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ProductSkeletonCard } from "@/components/skeleton-card";
import { ArrowRight, Clock, MapPin, Phone, Star } from "lucide-react";
import heroBakery from "@assets/generated_images/hero_bakery.jpg";
import heroBread from "@assets/generated_images/hero_bread.jpg";
import imgProcess1 from "@assets/generated_images/img_process1.jpg";

export default function Home() {
  useEffect(() => {
    document.title = "Kanz Bakery | Artisan Breads & Pastries in Dubai";
  }, []);

  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: stats } = useGetCatalogStats();
  const { data: topRatedProducts, isLoading: loadingTopRated } = useGetTopRatedProducts({ limit: 4 });
  const { data: categories } = useListCategories();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBakery} 
            alt="Warm golden-lit artisanal bakery" 
            className="w-full h-full object-cover object-center opacity-40 dark:opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-4xl pt-20">
          <span className="text-primary font-medium tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">Established 2024</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            Handcrafted <br/><span className="text-primary italic">with love.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            Every loaf, pastry, and cake at Kanz Bakery is a labor of love, baked fresh daily using traditional methods and the finest ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <Link href="/menu" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-12 px-8 py-3 text-base">
              Explore Our Menu
            </Link>
            <Link href="/catering" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-12 px-8 py-3 text-base">
              Catering & Events
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Proof section */}
      <section className="py-12 border-y border-border/50 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-bold text-primary mb-2">{stats?.totalProducts || "50"}+</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Artisan Goods</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-bold text-primary mb-2">{stats?.totalCategories || "6"}</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Categories</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-bold text-primary mb-2 flex items-center gap-1">
                {stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "4.9"} <Star className="h-6 w-6 fill-primary" />
              </span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Average Rating</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-serif font-bold text-primary mb-2">{stats?.totalReviews || "500"}+</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Fresh from the oven</h2>
              <p className="text-muted-foreground text-lg">Our daily best-sellers, baked to golden perfection.</p>
            </div>
            <Link href="/menu" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline hover:underline-offset-4 pb-2">
              View full menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loadingFeatured 
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeletonCard key={i} />)
              : featuredProducts?.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/menu" className="inline-flex items-center gap-2 text-primary font-medium hover:underline hover:underline-offset-4">
              View full menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story / Values with Image */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl relative z-10">
                <img src={imgProcess1} alt="Baker kneading dough" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square rounded-lg overflow-hidden shadow-xl border-8 border-background z-20 hidden md:block">
                <img src={heroBread} alt="Fresh baked sourdough" className="w-full h-full object-cover" />
              </div>
              {/* Decorative blob behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div>
                <span className="text-primary font-medium tracking-widest uppercase mb-2 block">Our Philosophy</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Time is our most important ingredient.</h2>
                <div className="w-20 h-1 bg-primary mb-6" />
              </div>
              
              <div className="space-y-6 text-lg text-foreground/80 font-light">
                <p>
                  At Kanz Bakery, we believe there are no shortcuts to truly great bread. Our sourdough starters are fed daily, our doughs are slow-fermented for up to 48 hours, and every pastry is laminated by hand.
                </p>
                <p>
                  We source our organic flours from traditional mills, our butter from sustainable farms, and our inspiration from both classic French patisserie and our rich local heritage.
                </p>
              </div>
              
              <Link href="/about" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary shadow-sm hover:bg-primary hover:text-primary-foreground h-11 px-8">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-primary font-medium tracking-widest uppercase mb-2 block">Customer Favorites</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">Beloved by our regulars</h2>
            <p className="text-muted-foreground text-lg">The items our community keeps coming back for, day after day.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loadingTopRated 
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeletonCard key={i} />)
              : topRatedProducts?.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.map(category => (
              <Link key={category.id} href={`/menu?category=${category.id}`} className="group flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border/50 hover:border-primary transition-colors hover:shadow-md">
                <div className="w-16 h-16 rounded-full bg-secondary/50 mb-4 flex items-center justify-center overflow-hidden">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <span className="text-2xl font-serif text-primary">{category.name.charAt(0)}</span>
                  )}
                </div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catering CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Make your next event extraordinary</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 font-light">
            From intimate gatherings to lavish weddings, we provide artisan catering that your guests will remember long after the last crumb is gone.
          </p>
          <Link href="/catering" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-primary shadow hover:bg-background/90 h-12 px-8 py-3 text-base">
            Inquire About Catering
          </Link>
        </div>
      </section>

      {/* Info / Contact */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-4">123 Baker Street<br/>Dubai, UAE</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Get Directions</a>
            </div>
            
            <div className="flex flex-col items-center p-6 pt-12 md:pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Opening Hours</h3>
              <ul className="text-muted-foreground space-y-2">
                <li><strong className="text-foreground font-medium">Mon-Sat:</strong> 7am - 9pm</li>
                <li><strong className="text-foreground font-medium">Sun:</strong> 8am - 6pm</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center p-6 pt-12 md:pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Contact</h3>
              <p className="text-muted-foreground mb-4">Have a question or want to pre-order?</p>
              <div className="space-y-2">
                <a href="tel:+971501234567" className="block text-primary font-medium hover:underline">+971 50 123 4567</a>
                <a href="mailto:hello@kanzbakery.com" className="block text-primary font-medium hover:underline">hello@kanzbakery.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
