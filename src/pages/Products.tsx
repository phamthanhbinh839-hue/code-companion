import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  view_count: number;
  sold_count: number;
  category_id: string | null;
}

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      let query = supabase
        .from('tools')
        .select('id, name, price, image_url, view_count, sold_count, category_id')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data } = await query;

      if (data) {
        setTools(data);
      }
      setLoading(false);
    };

    fetchTools();
  }, [selectedCategory]);

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="section-title">DANH SÁCH TOOL</h1>
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm tool..."
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
              {filteredTools.map((tool, index) => (
                <div 
                  key={tool.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={{
                      id: tool.id,
                      name: tool.name,
                      price: Number(tool.price),
                      images: tool.image_url || 'https://via.placeholder.com/300',
                      view: tool.view_count,
                      sold: tool.sold_count,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? `Không tìm thấy tool nào với từ khóa "${searchTerm}"`
                  : "Chưa có tool nào."}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
