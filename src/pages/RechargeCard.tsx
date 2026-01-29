import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";

const cardTypes = [
  { value: "VIETTEL", label: "Viettel", discount: 20 },
  { value: "VINAPHONE", label: "Vinaphone", discount: 20 },
  { value: "MOBIFONE", label: "Mobifone", discount: 20 },
  { value: "ZING", label: "Zing", discount: 25 },
  { value: "GARENA", label: "Garena", discount: 25 },
];

const denominations = [
  10000, 20000, 50000, 100000, 200000, 500000, 1000000,
];

const RechargeCard = () => {
  const [formData, setFormData] = useState({
    cardType: "",
    denomination: "",
    serial: "",
    pin: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cardType || !formData.denomination || !formData.serial || !formData.pin) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Thẻ đang được xử lý! (Demo mode)",
      });
      setLoading(false);
      setFormData({ cardType: "", denomination: "", serial: "", pin: "" });
    }, 2000);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const selectedCardType = cardTypes.find((c) => c.value === formData.cardType);
  const selectedDenomination = formData.denomination ? parseInt(formData.denomination) : 0;
  const receiveAmount = selectedDenomination
    ? selectedDenomination * (1 - (selectedCardType?.discount || 0) / 100)
    : 0;

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-title flex items-center justify-center gap-2">
              <CreditCard className="h-8 w-8" />
              NẠP THẺ CÀO
            </h1>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          <div className="v-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Type */}
              <div>
                <Label htmlFor="cardType">Loại thẻ</Label>
                <Select
                  value={formData.cardType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, cardType: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn loại thẻ" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypes.map((card) => (
                      <SelectItem key={card.value} value={card.value}>
                        {card.label} (Chiết khấu {card.discount}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Denomination */}
              <div>
                <Label htmlFor="denomination">Mệnh giá</Label>
                <Select
                  value={formData.denomination}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, denomination: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn mệnh giá" />
                  </SelectTrigger>
                  <SelectContent>
                    {denominations.map((denom) => (
                      <SelectItem key={denom} value={denom.toString()}>
                        {formatMoney(denom)} đ
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Serial */}
              <div>
                <Label htmlFor="serial">Số Serial</Label>
                <Input
                  id="serial"
                  type="text"
                  placeholder="Nhập số serial"
                  value={formData.serial}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, serial: e.target.value }))
                  }
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              {/* PIN */}
              <div>
                <Label htmlFor="pin">Mã thẻ (PIN)</Label>
                <Input
                  id="pin"
                  type="text"
                  placeholder="Nhập mã thẻ"
                  value={formData.pin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pin: e.target.value }))
                  }
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              {/* Calculation */}
              {receiveAmount > 0 && (
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Mệnh giá:</span>
                    <span>{formatMoney(selectedDenomination)} đ</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Chiết khấu:</span>
                    <span className="text-destructive">
                      -{selectedCardType?.discount}%
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Thực nhận:</span>
                    <span className="text-primary">{formatMoney(receiveAmount)} đ</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Nạp thẻ
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/30">
              <h4 className="font-bold text-warning mb-2">Lưu ý:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Nhập sai mệnh giá sẽ mất thẻ</li>
                <li>• Thẻ sẽ được xử lý trong vòng 1-5 phút</li>
                <li>• Liên hệ hỗ trợ nếu thẻ bị lỗi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RechargeCard;
