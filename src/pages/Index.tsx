import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSlider from "@/components/ui/HeroSlider";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import NotificationModal from "@/components/ui/NotificationModal";
import { Loader2, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  view_count: number;
  sold_count: number;
}

const mockSliderImages = [
  "https://i.imgur.com/8AG01M4.jpg",
  "https://i.imgur.com/Je1CPro.jpg",
];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [showNotification, setShowNotification] = useState(true);
  const [notification, setNotification] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch tools
      let query = supabase
        .from('tools')
        .select('id, name, price, image_url, view_count, sold_count')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data: toolsData } = await query;

      if (toolsData) {
        setTools(toolsData);
      }

      // Fetch notification setting (only on first load)
      if (!notification) {
        const { data: settingData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'notification')
          .single();

        if (settingData?.value) {
          setNotification(settingData.value);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <MainLayout>
      {/* Notification Modal */}
      {notification && (
        <NotificationModal
          content={notification}
          isOpen={showNotification}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Hero Slider */}
      <section className="py-6">
        <div className="w-full max-w-6xl mx-auto px-4">
          <HeroSlider images={mockSliderImages} />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Wrench className="h-8 w-8 text-primary animate-pulse" />
              <h2 className="section-title">TOOL CỦA CHÚNG TÔI</h2>
              <Wrench className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="w-40 border-2 border-primary mx-auto mt-2"></div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Đang tải...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.map((tool, index) => (
                <div 
                  key={tool.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
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

          {!loading && tools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tool nào.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
