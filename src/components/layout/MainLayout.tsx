import { ReactNode, useEffect, useState, forwardRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children: ReactNode;
}

interface UserProfile {
  username: string;
  money: number;
}

const defaultSettings = {
  title: "VIETOOL",
  logo: "",
  hotline: "0559818207",
  email: "support@vietool.vn",
  link_facebook: "https://facebook.com/vietool",
  link_telegram: "https://t.me/vietool",
  link_zalo: "https://zalo.me",
};

const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(({ children }, ref) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        setCartCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, money')
      .eq('user_id', userId)
      .single();

    if (profile) {
      setUser({
        username: profile.username,
        money: Number(profile.money) || 0,
      });
    }

    // Check admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (roles?.some(r => r.role === 'admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // Fetch cart count
    const { count } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    setCartCount(count || 0);
  };

  return (
    <div ref={ref} className="min-h-screen flex flex-col bg-background">
      <Header 
        user={user} 
        cartCount={cartCount} 
        logo={defaultSettings.logo}
        isAdmin={isAdmin}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={defaultSettings} />
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
