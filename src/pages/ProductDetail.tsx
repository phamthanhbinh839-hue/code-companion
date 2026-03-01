import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Eye, 
  Clock,
  ExternalLink, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Download
} from "lucide-react";

interface ToolDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  demo_url: string | null;
  download_url: string | null;
  view_count: number;
  sold_count: number;
}

type RentalUnit = 'hour' | 'day' | 'week' | 'month';

const UNIT_LABELS: Record<RentalUnit, string> = {
  hour: 'Giờ',
  day: 'Ngày',
  week: 'Tuần',
  month: 'Tháng',
};

const UNIT_MULTIPLIERS: Record<RentalUnit, number> = {
  hour: 1,
  day: 24,
  week: 24 * 7,
  month: 24 * 30,
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  // Rental state
  const [rentalUnit, setRentalUnit] = useState<RentalUnit>('hour');
  const [rentalDuration, setRentalDuration] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setTool(null);
      } else {
        setTool({
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image_url: data.image_url,
          demo_url: data.demo_url,
          download_url: data.download_url,
          view_count: data.view_count,
          sold_count: data.sold_count,
        });
      }
      setLoading(false);
    };

    fetchTool();
  }, [id]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const calculatedPrice = tool 
    ? tool.price * UNIT_MULTIPLIERS[rentalUnit] * rentalDuration 
    : 0;

  const handleRentNow = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Thông báo",
        description: "Vui lòng đăng nhập để thuê tool",
        variant: "destructive",
      });
      return;
    }

    setPurchasing(true);

    try {
      const { data, error } = await supabase.rpc('purchase_tool', {
        p_tool_id: id,
        p_duration: rentalDuration,
        p_unit: rentalUnit,
      });

      if (error) {
        toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        return;
      }

      const result = data as { success: boolean; message: string; download_url?: string; already_purchased?: boolean; expires_at?: string };

      if (result.success) {
        toast({
          title: result.already_purchased ? "Thông báo" : "Thành công",
          description: result.message,
        });
        if (result.download_url) setDownloadUrl(result.download_url);
        if (result.expires_at) setExpiresAt(result.expires_at);
      } else {
        toast({ title: "Không thể thuê", description: result.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi. Vui lòng thử lại.", variant: "destructive" });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!tool) {
    return (
      <MainLayout>
        <div className="py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy tool</h1>
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const imageList = tool.image_url ? [tool.image_url] : ['https://via.placeholder.com/400'];

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4 animate-fade-in">
              <div className="relative rounded-lg overflow-hidden bg-secondary">
                <img
                  src={imageList[currentImageIndex]}
                  alt={tool.name}
                  className="w-full h-80 object-contain"
                />
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : imageList.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background hover:scale-110 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => prev < imageList.length - 1 ? prev + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background hover:scale-110 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div>
                <span className="v-badge bg-primary text-primary-foreground mb-2 inline-flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  TOOL
                </span>
                <h1 className="text-2xl font-bold text-foreground uppercase">
                  {tool.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Lượt xem: {tool.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Lượt thuê: {tool.sold_count}
                </span>
              </div>

              {/* Description */}
              <div className="v-card p-4">
                <h3 className="font-bold mb-2">Mô tả Tool</h3>
                {tool.description ? (
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: tool.description }}
                  />
                ) : (
                  <p className="text-muted-foreground">Chưa có mô tả</p>
                )}
              </div>

              {/* Rental Unit Selector */}
              <div className="space-y-4">
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {(Object.keys(UNIT_LABELS) as RentalUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => { setRentalUnit(unit); setRentalDuration(1); }}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                        rentalUnit === unit
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {UNIT_LABELS[unit]}
                    </button>
                  ))}
                </div>

                {/* Duration selector */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRentalDuration(d => Math.max(1, d - 1))}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold hover:bg-secondary/80 transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-foreground">{rentalDuration}</span>
                    <span className="text-muted-foreground ml-2">{UNIT_LABELS[rentalUnit]}</span>
                  </div>
                  <button
                    onClick={() => setRentalDuration(d => d + 1)}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold hover:bg-secondary/80 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Price display */}
                <div className="v-card p-4 text-center bg-primary/5 border-primary">
                  <p className="text-sm text-muted-foreground mb-1">Tổng giá thuê</p>
                  <p className="text-3xl font-bold text-primary">
                    {tool.price === 0 ? "Miễn phí" : `${formatMoney(calculatedPrice)} đ`}
                  </p>
                  {tool.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ({formatMoney(tool.price)} đ/giờ × {UNIT_MULTIPLIERS[rentalUnit] * rentalDuration} giờ)
                    </p>
                  )}
                </div>
              </div>

              {/* Rent Button */}
              <Button 
                onClick={handleRentNow} 
                className="w-full hover:scale-[1.02] transition-transform text-lg" 
                size="lg"
                disabled={purchasing}
              >
                {purchasing ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Wrench className="h-5 w-5 mr-2" />
                )}
                {tool.price === 0 ? "Nhận Miễn Phí" : "THUÊ NGAY"}
              </Button>

              {/* Download URL after rental */}
              {downloadUrl && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm font-bold text-green-500 mb-2">🎉 Thuê thành công!</p>
                  {expiresAt && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Hết hạn: {new Date(expiresAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-500 hover:underline font-bold"
                  >
                    <Download className="h-4 w-4" />
                    Tải xuống tool
                  </a>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-col gap-2">
                {tool.demo_url && (
                  <a
                    href={tool.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline hover:scale-105 transition-transform w-fit"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Xem Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
