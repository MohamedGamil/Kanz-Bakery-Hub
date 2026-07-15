import { useEffect } from "react";
import imgProcess1 from "@assets/generated_images/img_process1.jpg";
import imgProcess2 from "@assets/generated_images/img_process2.jpg";
import imgFounder from "@assets/generated_images/img_about_founder.jpg";
import heroBakery from "@assets/generated_images/hero_bakery.jpg";
import { Link } from "wouter";

export default function About() {
  useEffect(() => {
    document.title = "Our Story | Kanz Bakery";
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBakery} 
            alt="Warm golden-lit artisanal bakery" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-20">
          <span className="text-primary font-medium tracking-widest uppercase mb-4 block">Est. 2024</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">
            Our Story
          </h1>
        </div>
      </section>

      {/* The Beginning */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Born from a passion for real bread.</h2>
              <div className="w-20 h-1 bg-primary mb-8" />
              
              <div className="text-lg text-foreground/80 font-light space-y-6 leading-relaxed">
                <p>
                  Kanz Bakery started with a simple belief: the best things in life take time. In an era of instant gratification and fast food, we wanted to create a sanctuary where the ancient craft of baking is respected and celebrated.
                </p>
                <p>
                  The name "Kanz" means "treasure" in Arabic, reflecting our belief that truly artisanal food is a treasure to be shared. Our journey began in a small home kitchen, experimenting with wild yeast cultures and heritage grains until we found the perfect balance of flavor, texture, and nutrition.
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-muted">
                <img src={imgProcess1} alt="Baker's hands kneading fresh dough" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-16">Our Philosophy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-serif font-bold">Finest Ingredients</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                We source organic flours from stone mills, pure European butter, and local seasonal produce. We never use artificial additives or preservatives.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-serif font-bold">Slow Fermentation</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Time is our crucial ingredient. Our sourdough ferments for up to 48 hours, developing complex flavors and breaking down gluten for better digestion.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👐</span>
              </div>
              <h3 className="text-xl font-serif font-bold">Handcrafted Craft</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Every item is shaped by human hands. We embrace the slight variations that come with true artisanal baking—it's the mark of real food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Team / Process */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Meet the artisans behind the counter.</h2>
              <div className="w-20 h-1 bg-primary mb-8" />
              
              <div className="text-lg text-foreground/80 font-light space-y-6 leading-relaxed">
                <p>
                  Our team consists of passionate bakers, pastry chefs, and baristas who share a singular obsession: quality. 
                </p>
                <p>
                  Led by Head Baker and Founder, Tariq, who honed his craft in the boulangeries of Paris before returning home to Dubai. The team wakes up long before the sun rises to ensure that when we open our doors, the shelves are filled with fresh, warm treasures.
                </p>
                <p className="italic text-muted-foreground mt-4">
                  "Baking is a daily practice in humility. You have to listen to the dough, feel the humidity, respect the temperature. You can't rush it."
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-muted">
                  <img src={imgProcess2} alt="Golden bread loaves in oven" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-muted">
                  <img src={imgFounder} alt="Portrait of artisan baker" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-serif font-bold mb-6">Taste the difference</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            We'd love to share our craft with you. Visit us in-store or pre-order online.
          </p>
          <Link href="/menu" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-12 px-8 py-3 text-base">
            Explore the Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
