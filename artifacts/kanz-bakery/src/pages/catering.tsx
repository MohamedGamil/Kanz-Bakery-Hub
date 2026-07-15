import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const createInquiryMutation = useCreateCateringInquiry();

  useEffect(() => {
    document.title = t("catering.pageTitle");
  }, [t]);

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
      onError: (error: unknown) => {
        const msg = error && typeof error === "object" && "error" in error
          ? String((error as { error: string }).error)
          : "An unexpected error occurred. Please try again.";
        toast({
          title: "Submission failed",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{t("catering.heroTitle")}</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-light max-w-2xl mx-auto">
            {t("catering.heroSubtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto text-center bg-card border border-border p-8 sm:p-12 rounded-xl shadow-sm">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">{t("catering.successTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("catering.successSubtitle")}</p>
            <div className="bg-secondary/50 p-6 rounded-lg text-start mb-8">
              <h3 className="font-semibold mb-2">{t("catering.successNext")}</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2"><Clock className="w-5 h-5 shrink-0 text-primary" />{t("catering.successStep1")}</li>
                <li className="flex gap-2"><Phone className="w-5 h-5 shrink-0 text-primary" />{t("catering.successStep2")}</li>
                <li className="flex gap-2"><Users className="w-5 h-5 shrink-0 text-primary" />{t("catering.successStep3")}</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground italic mb-8">{t("catering.successDisclaimer")}</p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              {t("catering.sendAnother")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-4">{t("catering.howItWorks")}</h2>
                <p className="text-muted-foreground mb-6">{t("catering.howItWorksDesc")}</p>
                <div className="space-y-6">
                  {[
                    { title: t("catering.step1Title"), desc: t("catering.step1Desc") },
                    { title: t("catering.step2Title"), desc: t("catering.step2Desc") },
                    { title: t("catering.step3Title"), desc: t("catering.step3Desc") },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-serif font-bold text-primary">{i + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/30 p-6 rounded-lg border border-border">
                <h3 className="font-serif font-bold text-lg mb-4">{t("catering.immediateHelp")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("catering.immediateHelpDesc")}</p>
                <a href="tel:+966112345678" className="flex items-center gap-2 text-primary font-medium hover:underline" dir="ltr">
                  <Phone className="w-4 h-4 shrink-0" /> +966 11 234 5678
                </a>
                <a href="mailto:events@kanzbakery.com" className="flex items-center gap-2 text-primary font-medium hover:underline mt-2">
                  <Mail className="w-4 h-4 shrink-0" /> events@kanzbakery.com
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-card border border-border p-6 md:p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-2">{t("catering.formTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-8">{t("catering.formSubtitle")}</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* Contact */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">{t("catering.contactSection")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.customerName")}</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.email")}</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.phone")}</FormLabel>
                          <FormControl><Input type="tel" placeholder="+966 5X XXX XXXX" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">{t("catering.eventSection")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="requestType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.requestType")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={t("catering.requestTypePlaceholder")} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wedding">{t("catering.eventTypes.wedding")}</SelectItem>
                              <SelectItem value="corporate">{t("catering.eventTypes.corporate")}</SelectItem>
                              <SelectItem value="birthday">{t("catering.eventTypes.birthday")}</SelectItem>
                              <SelectItem value="bulk_order">{t("catering.eventTypes.bulk_order")}</SelectItem>
                              <SelectItem value="other">{t("catering.eventTypes.other")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="guestCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.guestCount")}</FormLabel>
                          <FormControl><Input type="number" min="1" placeholder={t("catering.guestCountPlaceholder")} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="eventDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.eventDate")}</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="preferredDateTime" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.preferredDateTime")}</FormLabel>
                          <FormControl><Input type="time" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="budgetRange" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("catering.budgetRange")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder={t("catering.budgetPlaceholder")} /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under_500">{t("catering.budgetRanges.under_500")}</SelectItem>
                              <SelectItem value="500_1000">{t("catering.budgetRanges.500_1000")}</SelectItem>
                              <SelectItem value="1000_2500">{t("catering.budgetRanges.1000_2500")}</SelectItem>
                              <SelectItem value="over_2500">{t("catering.budgetRanges.over_2500")}</SelectItem>
                              <SelectItem value="not_sure">{t("catering.budgetRanges.not_sure")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Order preferences */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-border pb-2">{t("catering.orderSection")}</h3>
                    <FormField control={form.control} name="selectedProducts" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("catering.selectedProducts")}</FormLabel>
                        <FormDescription>{t("catering.selectedProductsDesc")}</FormDescription>
                        <FormControl>
                          <Textarea placeholder={t("catering.selectedProductsPlaceholder")} className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="specialRequirements" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("catering.specialRequirements")}</FormLabel>
                        <FormDescription>{t("catering.specialRequirementsDesc")}</FormDescription>
                        <FormControl>
                          <Textarea placeholder={t("catering.specialRequirementsPlaceholder")} className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("catering.notes")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("catering.notesPlaceholder")} className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex items-center justify-end pt-6 border-t border-border">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={createInquiryMutation.isPending}
                      className="w-full md:w-auto px-10 text-base"
                    >
                      {createInquiryMutation.isPending ? t("catering.submitting") : t("catering.submit")}
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
