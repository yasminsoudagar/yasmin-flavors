import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageFoodPage from "./pages/admin/ManageFoodPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ManageCouponsPage from "./pages/admin/ManageCouponsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="food" element={<ManageFoodPage />} />
                  <Route path="orders" element={<ManageOrdersPage />} />
                  <Route path="coupons" element={<ManageCouponsPage />} />
                  <Route path="users" element={<ManageUsersPage />} />
                </Route>

                {/* Auth Routes (no navbar) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main Routes */}
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar />
                      <CartDrawer />
                      <ScrollToTop />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
