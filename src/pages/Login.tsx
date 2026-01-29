import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate login - will be replaced with Supabase auth
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Đăng nhập thành công! (Demo mode)",
      });
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="v-card p-6">
            <h1 className="text-2xl font-extrabold text-center text-foreground mb-1">
              ĐĂNG NHẬP TÀI KHOẢN
            </h1>
            <div className="w-32 border-t-2 border-primary mx-auto mb-6"></div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="font-semibold">
                  Tên tài khoản
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  className="w-full h-11 text-lg font-semibold"
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
                  className="flex items-center justify-center gap-2 w-full h-11 border border-border rounded-md bg-card hover:bg-secondary transition-colors text-lg font-medium"
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
