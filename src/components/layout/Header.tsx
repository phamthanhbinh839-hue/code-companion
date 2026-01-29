import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user?: {
    username: string;
    money: number;
    level: number;
  } | null;
  cartCount?: number;
  logo?: string;
}

export const Header = ({ user, cartCount = 0, logo }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <header className="sticky top-0 z-50 bg-card shadow">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-auto max-w-[200px]" />
            ) : (
              <span className="text-2xl font-bold text-primary">DICHVULIGHT</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="nav-link">
              TRANG CHỦ
            </Link>

            {/* Nạp tiền dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                NẠP TIỀN <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/recharge/card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    NẠP THẺ CÀO
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recharge/bank" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    NẠP QUA VÍ/ATM
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/products" className="nav-link">
              MÃ NGUỒN
            </Link>

            {/* Dịch vụ dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                DỊCH VỤ <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/services/cron">CRON JOB</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user?.level === 1 && (
              <Link to="/admin" className="nav-link">
                QUẢN TRỊ WEBSITE
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-bold">Giỏ hàng - ({cartCount})</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="font-bold">
                    {user.username} - {formatMoney(user.money)}đ
                  </span>
                </Link>
                <Link
                  to="/logout"
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-bold">Đăng xuất</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="font-bold">Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-3 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
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
          <nav className="lg:hidden pb-4 fade-in">
            <div className="flex flex-col gap-2">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                TRANG CHỦ
              </Link>
              <Link to="/recharge/card" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                NẠP THẺ CÀO
              </Link>
              <Link to="/recharge/bank" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                NẠP QUA VÍ/ATM
              </Link>
              <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                MÃ NGUỒN
              </Link>
              <Link to="/services/cron" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                CRON JOB
              </Link>
              <Link
                to="/cart"
                className="nav-link flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Giỏ hàng - ({cartCount})
              </Link>
              {user && (
                <Link
                  to="/logout"
                  className="nav-link flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
