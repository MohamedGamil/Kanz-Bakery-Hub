import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Kanz</span>
              <span className="font-serif text-2xl tracking-tight text-foreground">Bakery</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter / X">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.ourMenu")}</Link></li>
              <li><Link href="/catering" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.cateringEvents")}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.ourStory")}</Link></li>
              <li><Link href="/find-us" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.findUs")}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.contactUs")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("footer.address1")}</li>
              <li>{t("footer.address2")}</li>
              <li className="pt-2">
                <a href="tel:+966112345678" className="hover:text-primary transition-colors" dir="ltr">+966 11 234 5678</a>
              </li>
              <li>
                <a href="mailto:hello@kanzbakery.com" className="hover:text-primary transition-colors">hello@kanzbakery.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">{t("footer.hours")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between gap-4">
                <span>{t("footer.satThu")}</span>
                <span className="shrink-0 tabular-nums">{t("footer.satThuHours")}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>{t("footer.fri")}</span>
                <span className="shrink-0 tabular-nums">{t("footer.friHours")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kanz Bakery. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
