import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

    // Validate username - only alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      toast({
        title: "Lỗi",
        description: "Tên tài khoản chỉ được chứa chữ cái và số",
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

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", formData.username.toLowerCase())
      .single();

    if (existingUser) {
      toast({
        title: "Lỗi",
        description: "Tên tài khoản đã tồn tại",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Register with Supabase
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username.toLowerCase(),
        },
      },
    });

    if (error) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message === "User already registered" 
          ? "Email đã được sử dụng" 
          : error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Thành công",
      description: "Đăng ký thành công! Đang chuyển hướng...",
    });
    setLoading(false);
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm animate-scale-in">
          <form onSubmit={handleRegister} className="v-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
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
                  placeholder="Nhập tài khoản (chữ và số)"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dùng cho nội dung chuyển khoản nạp tiền
                </p>
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
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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
                  className="w-full h-11 text-lg font-semibold hover:scale-[1.02] transition-transform"
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
                  className="flex items-center justify-center gap-2 w-full h-11 border border-border rounded-md bg-card hover:bg-secondary hover:scale-[1.02] transition-all text-lg font-medium"
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
