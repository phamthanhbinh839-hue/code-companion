import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle, Wallet, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bankInfo = {
  bank_name: "Vietcombank",
  short_name: "VCB",
  account_number: "0978009289",
  account_name: "NGUYEN DUY KHANH",
  transfer_content: "dichvuright",
  min_amount: 10000,
};

const RechargeBank = () => {
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      toast({
        title: "Đã sao chép",
        description: `${text}`,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép",
        variant: "destructive",
      });
    }
  };

  const quickAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-title flex items-center justify-center gap-2">
              <Wallet className="h-8 w-8" />
              NẠP QUA NGÂN HÀNG
            </h1>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Info */}
            <div className="v-card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Thông tin chuyển khoản
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân hàng</p>
                    <p className="font-bold">{bankInfo.bank_name}</p>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center p-3 bg-secondary rounded cursor-pointer hover:bg-secondary/80"
                  onClick={() => copyToClipboard(bankInfo.account_number, "account")}
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Số tài khoản</p>
                    <p className="font-bold text-primary">{bankInfo.account_number}</p>
                  </div>
                  {copied === "account" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Chủ tài khoản</p>
                    <p className="font-bold">{bankInfo.account_name}</p>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center p-3 bg-secondary rounded cursor-pointer hover:bg-secondary/80"
                  onClick={() => copyToClipboard(bankInfo.transfer_content, "content")}
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
                    <p className="font-bold text-primary">{bankInfo.transfer_content}</p>
                  </div>
                  {copied === "content" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="v-card p-6">
              <h3 className="font-bold text-lg mb-4">Số tiền nạp</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Nhập số tiền</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Tối thiểu ${formatMoney(bankInfo.min_amount)} đ`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                    min={bankInfo.min_amount}
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground">Chọn nhanh</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant={amount === amt.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(amt.toString())}
                      >
                        {formatMoney(amt)}đ
                      </Button>
                    ))}
                  </div>
                </div>

                {amount && parseInt(amount) >= bankInfo.min_amount && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary">
                    <p className="text-sm text-muted-foreground mb-1">Số tiền nhận được:</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatMoney(parseInt(amount))} đ
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 v-card p-6">
            <h3 className="font-bold text-lg mb-4">Hướng dẫn nạp tiền</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  Chuyển khoản đến số tài khoản <strong>{bankInfo.account_number}</strong> - {bankInfo.bank_name}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  Nội dung chuyển khoản ghi: <strong>{bankInfo.transfer_content}</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>Tiền sẽ được cộng tự động trong vòng 1-5 phút</span>
              </li>
            </ol>

            <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/30">
              <p className="text-sm text-muted-foreground">
                <strong className="text-warning">Lưu ý:</strong> Nếu sau 10 phút không nhận được tiền, 
                vui lòng liên hệ hỗ trợ kèm ảnh chụp giao dịch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RechargeBank;
