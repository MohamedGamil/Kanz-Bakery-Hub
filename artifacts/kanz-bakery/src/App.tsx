import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useTranslation } from 'react-i18next';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import Home from '@/pages/home';
import Menu from '@/pages/menu';
import ProductDetail from '@/pages/product-detail';
import Catering from '@/pages/catering';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import FindUs from '@/pages/find-us';
import CartPage from '@/pages/cart';
import CheckoutPage from '@/pages/checkout';
import OrderConfirmationPage from '@/pages/order-confirmation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Keeps <html dir> and <html lang> in sync with the active i18n language. */
function DirectionManager() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return null;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <DirectionManager />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/menu/:slug" component={ProductDetail} />
          <Route path="/catering" component={Catering} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/find-us" component={FindUs} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-confirmation" component={OrderConfirmationPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
