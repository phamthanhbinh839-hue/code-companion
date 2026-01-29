import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Eye, 
  ShoppingCart, 
  ExternalLink, 
  Loader2,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  images: string;
  list_images: string;
  intro: string;
  view: number;
  sold: number;
  link_demo: string;
}

// Mock data
const mockProductDetails: Record<number, ProductDetail> = {
  1: {
    id: 1,
    name: "CODE CHECKSCAM GIỐNG ADMIN.VN",
    price: 0,
    images: "https://i.imgur.com/PKy0Bhm.png",
    list_images: "https://i.imgur.com/PKy0Bhm.png",
    intro: "<p>Code có key log anh em tự tìm nhé</p>",
    view: 7,
    sold: 0,
    link_demo: "https://admin.vn/",
  },
  2: {
    id: 2,
    name: "CODE CLMM BẢN NODE JS V1",
    price: 0,
    images: "https://i.imgur.com/lNl0CEP.png",
    list_images: "https://i.imgur.com/lNl0CEP.png",
    intro: "<p>Cần hỗ trợ ib tele @DuyKhanhRealL</p>",
    view: 3,
    sold: 0,
    link_demo: "https://dichvuright.io.vn/",
  },
  3: {
    id: 3,
    name: "CODE CLONE V6 BẢN CŨ CỦA TUẤN ORI",
    price: 0,
    images: "https://i.imgur.com/eyvWNvF.png",
    list_images: "https://i.imgur.com/eyvWNvF.png\nhttps://i.imgur.com/9xd5kEQ.png\nhttps://i.imgur.com/G8PcmX5.jpg",
    intro: "<p>Cần hỗ trợ ib @DuyKhanhRealL</p>",
    view: 1,
    sold: 0,
    link_demo: "https://dichvuright.io.vn/",
  },
  4: {
    id: 4,
    name: "CODE BÁN HOSTING CỦA TUẤN ORI V1",
    price: 0,
    images: "https://i.imgur.com/n3xe1Cu.png",
    list_images: "https://i.imgur.com/n3xe1Cu.png\nhttps://i.imgur.com/tT0KIcq.png",
    intro: "<p>Cần hỗ trợ ib @DuykhanhRealL</p>",
    view: 0,
    sold: 0,
    link_demo: "https://hosting2w.vn/",
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const productId = id ? parseInt(id) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = mockProductDetails[productId];
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [productId]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleAddToCart = () => {
    toast({
      title: "Thành công",
      description: "Đã thêm sản phẩm vào giỏ hàng!",
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Thông báo",
      description: "Vui lòng đăng nhập để mua hàng (Demo mode)",
    });
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

  if (!product) {
    return (
      <MainLayout>
        <div className="py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
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

  const imageList = product.list_images.split("\n").filter(Boolean);

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Back button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-secondary">
                <img
                  src={imageList[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-80 object-contain"
                />
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev > 0 ? prev - 1 : imageList.length - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev < imageList.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {imageList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {imageList.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="v-badge bg-primary text-primary-foreground mb-2 inline-block">
                  #{product.id}
                </span>
                <h1 className="text-2xl font-bold text-foreground uppercase">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Lượt xem: {product.view}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Lượt mua: {product.sold}
                </span>
              </div>

              <div className="text-3xl font-bold text-primary">
                {product.price === 0 ? "Miễn phí" : `${formatMoney(product.price)} đ`}
              </div>

              {/* Description */}
              <div className="v-card p-4">
                <h3 className="font-bold mb-2">Mô tả sản phẩm</h3>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.intro }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleBuyNow} className="flex-1" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Mua Ngay
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {/* Demo Link */}
              {product.link_demo && (
                <a
                  href={product.link_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
