import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowLeft, Minus, Plus } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  images: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/products"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Giỏ hàng
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="v-card p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
              <p className="text-muted-foreground mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <Link to="/products">
                <Button>Xem mã nguồn</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="v-card p-4 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={item.images}
                    alt={item.name}
                    className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold uppercase">{item.name}</h3>
                    <p className="v-price mt-1">{formatMoney(item.price)} đ</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="v-card p-6">
                <div className="flex justify-between items-center text-lg mb-4">
                  <span>Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatMoney(totalAmount)} đ
                  </span>
                </div>
                <Button className="w-full" size="lg">
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
