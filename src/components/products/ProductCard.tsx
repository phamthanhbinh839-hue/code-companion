import { Link } from "react-router-dom";
import { Eye, ShoppingCart, Wrench } from "lucide-react";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  images: string;
  view: number;
  sold: number;
  categoryName?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div className="product-card fade-in group">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="relative">
          <img
            src={product.images}
            alt={product.name}
            className="h-56 md:h-40 w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-2 right-2 v-badge bg-primary text-primary-foreground flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            {product.categoryName || "TOOL"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="py-2 bg-secondary px-3 text-center">
        <p className="font-bold truncate uppercase text-foreground">{product.name}</p>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
          <div className="text-center flex items-center justify-center gap-1">
            <Eye className="h-4 w-4" />
            <span>Lượt xem: {product.view}</span>
          </div>
          <div className="text-center flex items-center justify-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Lượt mua: {product.sold}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="border border-primary rounded text-center py-1.5 px-2">
            <span className="v-price text-sm">
              {product.price === 0 ? "Miễn phí" : `${formatMoney(product.price)} đ`}
            </span>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="bg-primary text-primary-foreground text-center py-1.5 px-2 rounded font-semibold text-sm hover:bg-primary/90 hover:scale-105 transition-all uppercase"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
