import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Wallet, 
  History, 
  Key, 
  ShoppingBag,
  LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  // Mock user data
  const user = {
    username: "user123",
    email: "user@example.com",
    money: 0,
    total_money: 0,
    create_date: "2024-01-01",
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-title">THÔNG TIN TÀI KHOẢN</h1>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-secondary">
              <TabsTrigger value="info" className="flex items-center gap-2 py-3">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 py-3">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Lịch sử</span>
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2 py-3">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Đã mua</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2 py-3">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Đổi mật khẩu</span>
              </TabsTrigger>
            </TabsList>

            {/* Account Info */}
            <TabsContent value="info">
              <div className="v-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Tên tài khoản</Label>
                      <p className="font-semibold text-lg">{user.username}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-semibold text-lg">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Ngày đăng ký</Label>
                      <p className="font-semibold text-lg">{user.create_date}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="v-card p-4 bg-primary/5 border-primary">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-primary" />
                        <div>
                          <Label className="text-muted-foreground">Số dư</Label>
                          <p className="text-2xl font-bold text-primary">
                            {formatMoney(user.money)} đ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="v-card p-4">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-success" />
                        <div>
                          <Label className="text-muted-foreground">Tổng nạp</Label>
                          <p className="text-2xl font-bold">
                            {formatMoney(user.total_money)} đ
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to="/recharge/bank">
                      <Button className="w-full">
                        <Wallet className="h-4 w-4 mr-2" />
                        Nạp tiền
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transaction History */}
            <TabsContent value="history">
              <div className="v-card p-6">
                <h3 className="font-bold text-lg mb-4">Lịch sử giao dịch</h3>
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có giao dịch nào
                </div>
              </div>
            </TabsContent>

            {/* Purchases */}
            <TabsContent value="purchases">
              <div className="v-card p-6">
                <h3 className="font-bold text-lg mb-4">Sản phẩm đã mua</h3>
                <div className="text-center py-8 text-muted-foreground">
                  Bạn chưa mua sản phẩm nào
                </div>
              </div>
            </TabsContent>

            {/* Change Password */}
            <TabsContent value="password">
              <div className="v-card p-6">
                <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                <form className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit">Cập nhật mật khẩu</Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link to="/logout">
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
