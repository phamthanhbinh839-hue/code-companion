import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Lỗi đăng nhập",
          description: error.message === "Invalid login credentials" 
            ? "Email hoặc mật khẩu không đúng" 
            : error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Thành công",
        description: "Đăng nhập thành công!",
      });
      
      // Navigate after a short delay to ensure auth state is updated
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm animate-scale-in">
          <form onSubmit={handleLogin} className="v-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold text-center text-foreground mb-1">
              ĐĂNG NHẬP TÀI KHOẢN
            </h1>
            <div className="w-32 border-t-2 border-primary mx-auto mb-6"></div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="font-semibold">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 text-lg font-semibold hover:scale-[1.02] transition-transform"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đăng Nhập"
                  )}
                </Button>

                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 w-full h-11 border border-border rounded-md bg-card hover:bg-secondary hover:scale-[1.02] transition-all text-lg font-medium"
                >
                  <UserPlus className="h-5 w-5" />
                  Tạo Tài Khoản
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
