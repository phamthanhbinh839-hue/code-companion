import { Facebook, MessageCircle, Phone, Mail } from "lucide-react";

interface FooterProps {
  settings?: {
    title?: string;
    hotline?: string;
    email?: string;
    link_facebook?: string;
    link_zalo?: string;
  };
}

export const Footer = ({ settings }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">
              {settings?.title || "DICHVULIGHT"}
            </h3>
            <p className="text-muted-foreground text-sm">
              Hệ thống bán mã nguồn website chất lượng tại Việt Nam. 
              Chúng tôi cung cấp các giải pháp website uy tín, giá cả hợp lý.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              {settings?.hotline && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${settings.hotline}`} className="hover:text-primary">
                    {settings.hotline}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Kết nối</h3>
            <div className="flex gap-3">
              {settings?.link_facebook && (
                <a
                  href={settings.link_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.link_zalo && (
                <a
                  href={settings.link_zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} {settings?.title || "DICHVULIGHT"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
