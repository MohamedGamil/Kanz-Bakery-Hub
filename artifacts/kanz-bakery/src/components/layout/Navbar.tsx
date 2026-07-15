import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useCartStore, cartItemCount } from "@/store/cart";

function BaguetteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/*
        Baguette: a slim diagonal loaf rotated ~40°.
        Built from a rounded-rect body with pointed tips and three diagonal score slashes.
      */}
      <g transform="rotate(-40 16 16)">
        {/* Body */}
        <rect x="4" y="13" width="24" height="6" rx="3" fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        {/* Left pointed tip */}
        <path d="M4 16 Q2 16 4 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M4 16 Q2 16 4 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Right pointed tip */}
        <path d="M28 16 Q30 16 28 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M28 16 Q30 16 28 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Score marks — three diagonal slashes */}
        <line x1="11" y1="13.5" x2="9"  y2="18.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="16" y1="13.5" x2="14" y2="18.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="21" y1="13.5" x2="19" y2="18.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <button
      onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
      className={cn(
        "text-xs font-bold px-2.5 py-1.5 rounded border border-border bg-transparent hover:bg-accent hover:text-primary transition-colors tracking-wide min-w-[2.75rem] h-9 flex items-center justify-center",
        className
      )}
      aria-label={isAr ? "Switch to English" : "التبديل للعربية"}
    >
      {isAr ? "EN" : "عربي"}
    </button>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const count = cartItemCount(items);
  const { t } = useTranslation();

  const navLinks = [
    { key: "home", href: "/" },
    { key: "menu", href: "/menu" },
    { key: "catering", href: "/catering" },
    { key: "about", href: "/about" },
    { key: "findUs", href: "/find-us" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Kanz</span>
              <span className="font-serif text-2xl tracking-tight text-foreground">Bakery</span>
              {/* Baguette icon — always on the trailing (end) side of the wordmark */}
              <BaguetteIcon className="w-7 h-7 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors"
              aria-label={`${t("nav.cart")}${count > 0 ? ` (${count})` : ""}`}
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 rtl:right-auto rtl:-left-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 whitespace-nowrap"
            >
              {t("nav.orderNow")}
            </Link>
          </div>

          {/* Mobile: language + cart + hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <LanguageSwitcher />

            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors"
              aria-label={`${t("nav.cart")}${count > 0 ? ` (${count})` : ""}`}
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 rtl:right-auto rtl:-left-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent focus:outline-none transition-colors"
              aria-label={t("nav.openMenu")}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top-2">
          <div className="px-3 pt-2 pb-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-medium min-h-[44px] flex items-center",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent hover:text-primary"
                )}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            <div className="pt-3 pb-1 px-1">
              <Link
                href="/menu"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 min-h-[44px]"
              >
                {t("nav.orderNow")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
