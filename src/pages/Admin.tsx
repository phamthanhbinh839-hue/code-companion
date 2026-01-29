import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Shield,
  Wrench,
  Eye,
  ShoppingCart,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  demo_url: string | null;
  download_url: string | null;
  view_count: number;
  sold_count: number;
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0",
    image_url: "",
    demo_url: "",
    download_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn không phải là admin",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchTools();
    }
  }, [isAdmin]);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách tool",
        variant: "destructive",
      });
    } else {
      setTools(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toolData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      image_url: formData.image_url || null,
      demo_url: formData.demo_url || null,
      download_url: formData.download_url || null,
      is_active: formData.is_active,
    };

    if (editingTool) {
      const { error } = await supabase
        .from('tools')
        .update(toolData)
        .eq('id', editingTool.id);

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật tool",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã cập nhật tool",
        });
      }
    } else {
      const { error } = await supabase
        .from('tools')
        .insert([toolData]);

      if (error) {
        toast({
          title: "Lỗi",
          description: "Không thể thêm tool",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã thêm tool mới",
        });
      }
    }

    setIsDialogOpen(false);
    resetForm();
    fetchTools();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tool này?")) return;

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tool",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Đã xóa tool",
      });
      fetchTools();
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || "",
      price: tool.price.toString(),
      image_url: tool.image_url || "",
      demo_url: tool.demo_url || "",
      download_url: tool.download_url || "",
      is_active: tool.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTool(null);
    setFormData({
      name: "",
      description: "",
      price: "0",
      image_url: "",
      demo_url: "",
      download_url: "",
      is_active: true,
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">QUẢN TRỊ TOOL</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <Plus className="h-4 w-4" />
                  Thêm Tool
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {editingTool ? "Sửa Tool" : "Thêm Tool Mới"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tên Tool *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Hình ảnh</Label>
                    <div className="mt-1">
                      <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="demo_url">URL Demo</Label>
                    <Input
                      id="demo_url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="download_url">URL Download</Label>
                    <Input
                      id="download_url"
                      value={formData.download_url}
                      onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Hiển thị tool</Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingTool ? "Cập nhật" : "Thêm mới"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="v-card p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tổng Tool</p>
                <p className="text-2xl font-bold">{tools.length}</p>
              </div>
            </div>
            <div className="v-card p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tổng Lượt Xem</p>
                <p className="text-2xl font-bold">
                  {tools.reduce((sum, t) => sum + t.view_count, 0)}
                </p>
              </div>
            </div>
            <div className="v-card p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tổng Lượt Mua</p>
                <p className="text-2xl font-bold">
                  {tools.reduce((sum, t) => sum + t.sold_count, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="v-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình</TableHead>
                  <TableHead>Tên Tool</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead className="text-center">Xem</TableHead>
                  <TableHead className="text-center">Mua</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id} className="hover:bg-secondary/50 transition-colors">
                    <TableCell>
                      <img
                        src={tool.image_url || 'https://via.placeholder.com/50'}
                        alt={tool.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {tool.name}
                    </TableCell>
                    <TableCell className="text-primary font-bold">
                      {tool.price === 0 ? "Miễn phí" : `${formatMoney(tool.price)}đ`}
                    </TableCell>
                    <TableCell className="text-center">{tool.view_count}</TableCell>
                    <TableCell className="text-center">{tool.sold_count}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        tool.is_active 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {tool.is_active ? "Hiện" : "Ẩn"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(tool)}
                          className="h-8 w-8 hover:scale-110 transition-transform"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(tool.id)}
                          className="h-8 w-8 hover:scale-110 transition-transform"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chưa có tool nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
