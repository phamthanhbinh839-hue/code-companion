import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "CODE CHECKSCAM GIỐNG ADMIN.VN",
    price: 0,
    images: "https://i.imgur.com/PKy0Bhm.png",
    view: 7,
    sold: 0,
  },
  {
    id: 2,
    name: "CODE CLMM BẢN NODE JS V1",
    price: 0,
    images: "https://i.imgur.com/lNl0CEP.png",
    view: 3,
    sold: 0,
  },
  {
    id: 3,
    name: "CODE CLONE V6 BẢN CŨ CỦA TUẤN ORI",
    price: 0,
    images: "https://i.imgur.com/eyvWNvF.png",
    view: 1,
    sold: 0,
  },
  {
    id: 4,
    name: "CODE BÁN HOSTING CỦA TUẤN ORI V1",
    price: 0,
    images: "https://i.imgur.com/n3xe1Cu.png",
    view: 0,
    sold: 0,
  },
];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="section-title">DANH SÁCH MÃ NGUỒN</h1>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm mã nguồn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Đang tải...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"`
                  : "Chưa có sản phẩm nào."}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
