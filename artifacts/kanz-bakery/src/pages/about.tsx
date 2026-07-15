import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import imgProcess1 from "@assets/generated_images/img_process1.jpg";
import imgProcess2 from "@assets/generated_images/img_process2.jpg";
import imgFounder from "@assets/generated_images/img_about_founder.jpg";
import heroBakery from "@assets/generated_images/hero_bakery.jpg";
import { Link } from "wouter";

export default function About() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("about.pageTitle");
  }, [t]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBakery}
            alt="Warm golden-lit artisanal bakery"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl pt-20">
          <span className="text-primary font-medium tracking-widest uppercase mb-4 block">{t("about.heroLabel")}</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">
            {t("about.heroTitle")}
          </h1>
        </div>
      </section>

      {/* The Beginning */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">{t("about.beginningTitle")}</h2>
              <div className="w-20 h-1 bg-primary mb-8" />
              <div className="text-lg text-foreground/80 font-light space-y-6 leading-relaxed">
                <p>{t("about.beginningP1")}</p>
                <p>{t("about.beginningP2")}</p>
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
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-16">{t("about.philosophyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-serif font-bold">{t("about.pillar1Title")}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t("about.pillar1Body")}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-serif font-bold">{t("about.pillar2Title")}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t("about.pillar2Body")}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👐</span>
              </div>
              <h3 className="text-xl font-serif font-bold">{t("about.pillar3Title")}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t("about.pillar3Body")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">{t("about.teamTitle")}</h2>
              <div className="w-20 h-1 bg-primary mb-8" />
              <div className="text-lg text-foreground/80 font-light space-y-6 leading-relaxed">
                <p>{t("about.teamP1")}</p>
                <p>{t("about.teamP2")}</p>
                <p className="italic text-muted-foreground mt-4">{t("about.teamQuote")}</p>
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
          <h2 className="text-3xl font-serif font-bold mb-6">{t("about.ctaTitle")}</h2>
          <p className="text-muted-foreground mb-8 text-lg">{t("about.ctaSubtitle")}</p>
          <Link href="/menu" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-12 px-8 py-3 text-base">
            {t("about.ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
