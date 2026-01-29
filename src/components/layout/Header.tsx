import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Wallet, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  user?: {
    username: string;
    money: number;
  } | null;
  cartCount?: number;
  logo?: string;
  isAdmin?: boolean;
}

export const Header = ({ user, cartCount = 0, logo, isAdmin = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-auto max-w-[200px] group-hover:scale-105 transition-transform" />
            ) : (
              <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors flex items-center gap-2">
                <Wrench className="h-7 w-7" />
                VIETOOL
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="nav-link hover:scale-105 transition-transform">
              TRANG CHỦ
            </Link>

            <Link to="/recharge/bank" className="nav-link flex items-center gap-1 hover:scale-105 transition-transform">
              <Wallet className="h-4 w-4" />
              NẠP TIỀN
            </Link>

            <Link to="/products" className="nav-link hover:scale-105 transition-transform">
              TOOL
            </Link>

            {isAdmin && (
              <Link to="/admin" className="nav-link text-primary hover:scale-105 transition-transform">
                QUẢN TRỊ
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary hover:scale-105 transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-bold">Giỏ hàng ({cartCount})</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary hover:scale-105 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="font-bold">
                    {user.username} - {formatMoney(user.money)}đ
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-bold">Đăng xuất</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary hover:scale-105 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="font-bold">Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-3 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all"
                >
                  <span className="font-bold">Đăng ký</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-1 px-2 py-1 border border-border rounded text-sm"
              >
                <User className="h-4 w-4" />
                <span className="font-bold truncate max-w-[100px]">
                  {user.username} - {formatMoney(user.money)}đ
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 border border-border rounded font-bold text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 border border-border rounded font-bold text-sm"
                >
                  Đăng ký
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border border-border"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                TRANG CHỦ
              </Link>
              <Link to="/recharge/bank" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                NẠP TIỀN
              </Link>
              <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                TOOL
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link text-primary" onClick={() => setMobileMenuOpen(false)}>
                  QUẢN TRỊ
                </Link>
              )}
              <Link
                to="/cart"
                className="nav-link flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Giỏ hàng ({cartCount})
              </Link>
              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="nav-link flex items-center gap-2 text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
