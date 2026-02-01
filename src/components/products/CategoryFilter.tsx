import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Gamepad2, Share2, TrendingUp, Code, Bot, MoreHorizontal, LayoutGrid } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gamepad2,
  Share2,
  TrendingUp,
  Code,
  Bot,
  MoreHorizontal,
};

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, icon')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
        } else if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
          selectedCategory === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card border-border hover:bg-secondary hover:border-primary/50"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Tất cả
      </button>

      {categories.map((category) => {
        const IconComponent = category.icon ? iconMap[category.icon] : MoreHorizontal;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-secondary hover:border-primary/50"
            )}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
