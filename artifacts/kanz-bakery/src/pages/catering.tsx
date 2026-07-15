import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, CalendarDays, Users, Phone, Mail, Clock } from "lucide-react";
import { useCreateCateringInquiry } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const cateringSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  requestType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Event date cannot be in the past").optional().or(z.literal("")),
  preferredDateTime: z.string().optional(),
  guestCount: z.coerce.number().min(1, "Guest count must be at least 1").optional().or(z.literal("").transform(() => undefined)),
  budgetRange: z.string().optional(),
  selectedProducts: z.string().optional(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
});

type CateringFormValues = z.infer<typeof cateringSchema>;

export default function Catering() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const createInquiryMutation = useCreateCateringInquiry();

  useEffect(() => {
    document.title = "Catering & Events | Kanz Bakery";
  }, []);

  const form = useForm<CateringFormValues>({
    resolver: zodResolver(cateringSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      requestType: "",
      eventDate: "",
      preferredDateTime: "",
      guestCount: undefined,
      budgetRange: "",
      selectedProducts: "",
      specialRequirements: "",
      notes: "",
    }
  });

  const onSubmit = (data: CateringFormValues) => {
    createInquiryMutation.mutate({
      data: {
        ...data,
        guestCount: data.guestCount ? Number(data.guestCount) : undefined
      }
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (error) => {
        toast({
          title: "Submission failed",
          description: error.error || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catering & Bulk Orders</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-light max-w-2xl mx-auto">
            Elevate your next event with artisanal breads, pastries, and custom cakes. From intimate gatherings to grand celebrations, we craft menus that leave a lasting impression.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto text-center bg-card border border-border p-12 rounded-xl shadow-sm">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Request Received</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for considering Kanz Bakery for your event. We have received your inquiry and our team will review the details.
            </p>
            <div className="bg-secondary/50 p-6 rounded-lg text-left mb-8">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2"><Clock className="w-5 h-5 shrink-0 text-primary" /> We typically respond within 24-48 hours.</li>
                <li className="flex gap-2"><Phone className="w-5 h-5 shrink-0 text-primary" /> One of our event coordinators will contact you to discuss your vision.</li>
                <li className="flex gap-2"><Users className="w-5 h-5 shrink-0 text-primary" /> We'll finalize the menu and provide a formal quote.</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground italic mb-8">
              Please note: This is an inquiry only and does not automatically confirm your order or reserve your date.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4">How it works</h2>
                <p className="text-muted-foreground mb-6">
                  Every event is unique. Fill out the form with as many details as you have, and we'll work with you to create the perfect artisan spread.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-serif font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Submit Details</h4>
                      <p className="text-sm text-muted-foreground">Tell us about your event, date, and general needs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-serif font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Consultation</h4>
                      <p className="text-sm text-muted-foreground">We'll review your request and suggest the best options from our bakery.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-serif font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Proposal & Tasting</h4>
                      <p className="text-sm text-muted-foreground">For large events, we provide a formal quote and optional tasting session.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 p-6 rounded-lg border border-border">
                <h3 className="font-serif font-bold text-lg mb-4">Need immediate help?</h3>
                <p className="text-sm text-muted-foreground mb-4">For events happening within the next 48 hours, please call us directly.</p>
                <a href="tel:+971501234567" className="flex items-center gap-2 text-primary font-medium hover:underline">
                  <Phone className="w-4 h-4" /> +971 50 123 4567
                </a>
                <a href="mailto:events@kanzbakery.com" className="flex items-center gap-2 text-primary font-medium hover:underline mt-2">
                  <Mail className="w-4 h-4" /> events@kanzbakery.com
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border p-6 md:p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6">Event Inquiry Form</h2>
              <p className="text-sm text-muted-foreground mb-8">Please fill out the details below. Fields marked with * are required.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Contact Info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+971 50 000 0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="requestType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="wedding">Wedding</SelectItem>
                                <SelectItem value="corporate">Corporate Event</SelectItem>
                                <SelectItem value="birthday">Birthday Party</SelectItem>
                                <SelectItem value="bulk_order">Bulk Order (No Event)</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Guest Count</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="e.g. 50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferredDateTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Delivery/Pickup Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under_500">Under $500</SelectItem>
                                <SelectItem value="500_1000">$500 - $1,000</SelectItem>
                                <SelectItem value="1000_2500">$1,000 - $2,500</SelectItem>
                                <SelectItem value="over_2500">$2,500+</SelectItem>
                                <SelectItem value="not_sure">Not sure yet</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Order Specifics */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">Order Preferences</h3>
                    
                    <FormField
                      control={form.control}
                      name="selectedProducts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Items of Interest</FormLabel>
                          <FormDescription>What kinds of baked goods are you looking for? (e.g. Sourdough loaves, mixed pastries, custom cake)</FormDescription>
                          <FormControl>
                            <Textarea placeholder="Tell us what you'd like to order..." className="min-h-[80px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary / Special Requirements</FormLabel>
                          <FormDescription>Any allergies, vegan, or gluten-free needs?</FormDescription>
                          <FormControl>
                            <Textarea placeholder="e.g. 5 vegan options, no nuts..." className="min-h-[80px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any other details we should know about your event?" className="min-h-[80px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end pt-6 border-t border-border">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={createInquiryMutation.isPending}
                      className="w-full md:w-auto px-10 text-base"
                    >
                      {createInquiryMutation.isPending ? "Sending Inquiry..." : "Submit Inquiry"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
