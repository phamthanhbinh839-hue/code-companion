import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import RechargeBank from "./pages/RechargeBank";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Product Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* Cart */}
          <Route path="/cart" element={<Cart />} />
          
          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Recharge */}
          <Route path="/recharge/bank" element={<RechargeBank />} />
          
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Legacy routes */}
          <Route path="/client/login" element={<Login />} />
          <Route path="/client/register" element={<Register />} />
          <Route path="/client/list-code" element={<Products />} />
          <Route path="/client/view-code/:id" element={<ProductDetail />} />
          <Route path="/client/cart" element={<Cart />} />
          <Route path="/client/user-profile" element={<Profile />} />
          <Route path="/client/recharge" element={<RechargeBank />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
