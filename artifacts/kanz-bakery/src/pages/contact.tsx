import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("contact.pageTitle");
  }, [t]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 border-b border-border py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t("contact.heroTitle")}</h1>
          <p className="text-lg text-muted-foreground font-light">{t("contact.heroSubtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Contact info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">{t("contact.getInTouch")}</h2>
              <p className="text-muted-foreground mb-8">{t("contact.getInTouchSubtitle")}</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.visitTitle")}</h3>
                  <p className="text-muted-foreground">{t("contact.visitAddress")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.callTitle")}</h3>
                  <p className="text-muted-foreground mb-1">{t("contact.callSubtitle")}</p>
                  <a href="tel:+966112345678" className="text-primary font-medium hover:underline" dir="ltr">+966 11 234 5678</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.emailTitle")}</h3>
                  <p className="text-muted-foreground mb-1">{t("contact.emailSubtitle")}</p>
                  <a href="mailto:hello@kanzbakery.com" className="text-primary font-medium hover:underline">hello@kanzbakery.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.hoursTitle")}</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>{t("contact.satThu")}</li>
                    <li>{t("contact.fri")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="space-y-10">
            <div className="bg-card border border-border p-6 sm:p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-6">{t("contact.formTitle")}</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">{t("contact.name")}</label>
                    <Input id="name" placeholder={t("contact.namePlaceholder")} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">{t("contact.email")}</label>
                    <Input id="email" type="email" placeholder={t("contact.emailPlaceholder")} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">{t("contact.subject")}</label>
                  <Input id="subject" placeholder={t("contact.subjectPlaceholder")} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">{t("contact.message")}</label>
                  <Textarea id="message" placeholder={t("contact.messagePlaceholder")} className="min-h-[150px]" required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  {t("contact.send")}
                </Button>
              </form>
            </div>

            {/* Map placeholder */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative">
              <div className="relative z-10 flex flex-col items-center p-6 text-center bg-background/90 backdrop-blur-sm rounded-lg border border-border shadow-sm">
                <MapPin className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-serif font-bold text-lg">Kanz Bakery</h3>
                <p className="text-sm text-muted-foreground">{t("contact.visitAddress")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
