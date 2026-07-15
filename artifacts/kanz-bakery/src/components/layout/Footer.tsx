import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Kanz</span>
              <span className="font-serif text-2xl tracking-tight text-foreground">Bakery</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Artisan breads, delicate pastries, and custom cakes crafted with love and the finest ingredients in Dubai.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link href="/catering" className="text-muted-foreground hover:text-primary transition-colors">Catering & Events</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Baker Street</li>
              <li>Dubai, UAE</li>
              <li className="pt-2"><a href="tel:+971501234567" className="hover:text-primary transition-colors">+971 50 123 4567</a></li>
              <li><a href="mailto:hello@kanzbakery.com" className="hover:text-primary transition-colors">hello@kanzbakery.com</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Monday - Saturday</span>
                <span>7:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kanz Bakery. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
