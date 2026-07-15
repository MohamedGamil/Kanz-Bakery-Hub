import { useEffect } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Us | Kanz Bakery";
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <div className="bg-secondary/30 border-b border-border py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground font-light">
            We'd love to hear from you. Whether it's a question about our menu, a special request, or just to say hello.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Get in touch</h2>
              <p className="text-muted-foreground mb-8">
                Our bakery team is ready to answer your questions. Fill out the form, or reach out to us using the contact details below.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">Visit our Bakery</h3>
                  <p className="text-muted-foreground">123 Baker Street<br/>Dubai, United Arab Emirates</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-muted-foreground mb-1">For immediate questions or pre-orders.</p>
                  <a href="tel:+971501234567" className="text-primary font-medium hover:underline">+971 50 123 4567</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-muted-foreground mb-1">For catering, wholesale, or general inquiries.</p>
                  <a href="mailto:hello@kanzbakery.com" className="text-primary font-medium hover:underline">hello@kanzbakery.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">Opening Hours</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Monday - Saturday: 7:00 AM - 9:00 PM</li>
                    <li>Sunday: 8:00 AM - 6:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Map placeholder */}
          <div className="space-y-10">
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-6">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form submission handled."); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Write your message here..." className="min-h-[150px]" required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Dubai&zoom=13&size=800x400&sensor=false&style=feature:all|element:labels|visibility:off')] bg-cover bg-center opacity-30 grayscale sepia blur-[2px]" />
              <div className="relative z-10 flex flex-col items-center p-6 text-center bg-background/90 backdrop-blur-sm rounded-lg border border-border shadow-sm">
                <MapPin className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-serif font-bold text-lg">Kanz Bakery</h3>
                <p className="text-sm text-muted-foreground">123 Baker Street, Dubai</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
