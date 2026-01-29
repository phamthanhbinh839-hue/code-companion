import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

// Mock data - in production this would come from Supabase
const mockUser = null; // Set to null for logged out state
const mockSettings = {
  title: "DICHVULIGHT",
  logo: "",
  hotline: "0559818207",
  email: "support@dichvulight.vn",
  link_facebook: "https://facebook.com",
  link_zalo: "https://zalo.me",
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        user={mockUser} 
        cartCount={0} 
        logo={mockSettings.logo} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={mockSettings} />
    </div>
  );
};

export default MainLayout;
