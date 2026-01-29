import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-bold mt-4 mb-2">Không tìm thấy trang</h2>
          <p className="text-muted-foreground mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Link to="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
