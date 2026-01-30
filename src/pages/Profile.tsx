import { useEffect, useState } from "react";
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
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  status: string | null;
  created_at: string | null;
}

interface Purchase {
  id: string;
  amount: number;
  created_at: string | null;
  tool: {
    name: string;
    download_url: string | null;
  } | null;
}

const Profile = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchPurchases();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setTransactions(data);
    }
    setLoadingTransactions(false);
  };

  const fetchPurchases = async () => {
    setLoadingPurchases(true);
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        id,
        amount,
        created_at,
        tool:tools(name, download_url)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Type assertion to handle the response
      const formattedData = data.map(item => ({
        ...item,
        tool: Array.isArray(item.tool) ? item.tool[0] : item.tool
      })) as Purchase[];
      setPurchases(formattedData);
    }
    setLoadingPurchases(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Đã cập nhật mật khẩu",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="py-8 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return null;
  }

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
                      <p className="font-semibold text-lg">{profile.username}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-semibold text-lg">{profile.email || "-"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="v-card p-4 bg-primary/5 border-primary">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-primary" />
                        <div>
                          <Label className="text-muted-foreground">Số dư</Label>
                          <p className="text-2xl font-bold text-primary">
                            {formatMoney(profile.money)} đ
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
                            {formatMoney(profile.total_money)} đ
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
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Lịch sử giao dịch
                </h3>
                
                {loadingTransactions ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có giao dịch nào
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Mô tả</TableHead>
                          <TableHead className="text-right">Số tiền</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(tx.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {tx.type === "deposit" ? (
                                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                                )}
                                <span className="capitalize">
                                  {tx.type === "deposit" ? "Nạp tiền" : "Mua hàng"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {tx.description || "-"}
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                              {tx.amount > 0 ? "+" : ""}{formatMoney(tx.amount)} đ
                            </TableCell>
                            <TableCell>
                              <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                                {tx.status === "completed" ? "Hoàn thành" : tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Purchases */}
            <TabsContent value="purchases">
              <div className="v-card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm đã mua
                </h3>
                
                {loadingPurchases ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Bạn chưa mua sản phẩm nào
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-right">Giá</TableHead>
                          <TableHead>Tải xuống</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchases.map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(purchase.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {purchase.tool?.name || "Tool đã xóa"}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatMoney(purchase.amount)} đ
                            </TableCell>
                            <TableCell>
                              {purchase.tool?.download_url ? (
                                <a
                                  href={purchase.tool.download_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm" variant="outline">
                                    Tải xuống
                                  </Button>
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Change Password */}
            <TabsContent value="password">
              <div className="v-card p-6">
                <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="mt-1"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="mt-1"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={changingPassword}>
                    {changingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Cập nhật mật khẩu
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
