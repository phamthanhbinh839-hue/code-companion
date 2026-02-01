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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setIsAdmin(false);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch all data in parallel
      const [profileResult, rolesResult, cartResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('username, money')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId),
        supabase
          .from('cart_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
      ]);

      if (profileResult.data) {
        setUser({
          username: profileResult.data.username,
          money: Number(profileResult.data.money) || 0,
        });
      }

      setIsAdmin(rolesResult.data?.some(r => r.role === 'admin') || false);
      setCartCount(cartResult.count || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
