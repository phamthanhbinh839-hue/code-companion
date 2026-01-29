import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationModalProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal = ({ content, isOpen, onClose }: NotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm fade-in">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden slide-up">
        <div className="bg-secondary px-4 py-3 border-b border-border">
          <h3 className="text-lg font-bold text-primary text-center uppercase">
            Thông báo
          </h3>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        
        <div className="flex justify-end p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
