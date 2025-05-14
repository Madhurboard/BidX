
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import AuctionsList from "./pages/AuctionsList";
import AuctionDetail from "./pages/AuctionDetail";
import SellItem from "./pages/SellItem";
import HowItWorks from "./pages/HowItWorks";
import Profile from "./pages/Profile";
import MyAuctions from "./pages/MyAuctions";
import MyBids from "./pages/MyBids";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Wrapper layout component that includes Navbar and Footer
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/how-it-works" element={
              <Layout>
                <HowItWorks />
              </Layout>
            } />
            <Route path="/auctions" element={
              <Layout>
                <AuctionsList />
              </Layout>
            } />
            <Route path="/auction/:id" element={
              <Layout>
                <AuctionDetail />
              </Layout>
            } />
            <Route path="/sell" element={
              <Layout>
                <ProtectedRoute>
                  <SellItem />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/my-auctions" element={
              <Layout>
                <ProtectedRoute>
                  <MyAuctions />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/my-bids" element={
              <Layout>
                <ProtectedRoute>
                  <MyBids />
                </ProtectedRoute>
              </Layout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
