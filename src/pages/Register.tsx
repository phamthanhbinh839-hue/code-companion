import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate registration - will be replaced with Supabase auth
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Đăng ký thành công! (Demo mode)",
      });
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <form onSubmit={handleRegister} className="v-card p-6">
            <h1 className="text-2xl font-extrabold text-center text-foreground mb-1">
              ĐĂNG KÝ TÀI KHOẢN
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
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="font-semibold">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                    "Đăng Ký"
                  )}
                </Button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full h-11 border border-border rounded-md bg-card hover:bg-secondary transition-colors text-lg font-medium"
                >
                  <LogIn className="h-5 w-5" />
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
