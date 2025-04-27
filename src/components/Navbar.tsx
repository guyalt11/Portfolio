import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/services/authService";
import { useState } from "react";

/**
 * Navigation Component
 * Provides site-wide navigation with responsive design
 * Includes both mobile and desktop layouts with elegant styling
 */
const Navbar = () => {
  const location = useLocation();
  const isAdmin = isAuthenticated();
  const isHomepage = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Helper function to determine active menu item
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  // Navigation menu items configuration
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/sketches", label: "Drawings" },
    { path: "/photos", label: "Photos" },
    { path: "/music", label: "Music" },
    { path: isAdmin ? "/cms" : "/login", label: isAdmin ? "Admin" : "Admin Login" }
  ];

  const handleCloseSheet = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger menu trigger - shown on all pages */}
      <div className="fixed top-4 right-4 z-20">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${
                isHomepage 
                  ? "text-white hover:bg-white/10" 
                  : "bg-white/80 hover:bg-white"
              } transition-all duration-300`}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right"
            className="w-[200px] rounded-lg bg-white/70 backdrop-blur-sm border-none shadow-lg fixed top-4 right-4 h-auto max-h-[calc(100vh-2rem)]"
          >
            <nav className="flex flex-col gap-2 py-4">
              {menuItems.map((item) => (
                <SheetClose asChild key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`
                      text-sm py-2 px-3 rounded-md transition-all duration-200
                      hover:bg-gray-100/80 relative overflow-hidden
                      ${isActive(item.path) ? "text-gray-900 font-medium" : "text-gray-600"}
                    `}
                    onClick={handleCloseSheet}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop menu - Only on homepage */}
      {isHomepage && (
        <nav className="fixed hidden md:flex top-0 right-0 h-screen w-1/2 flex-col justify-center items-center z-10 min-w-[400px]">
          <ul className="flex flex-col gap-8">
            {menuItems.filter(item => item.path !== "/login" && item.path !== "/cms").map((item) => (
              <li key={item.path} className="nav-menu-item">
                <Link 
                  to={item.path} 
                  className="relative text-3xl text-white opacity-75 hover:opacity-100 transition-all duration-300 group py-3 px-6"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <style>{`
        .nav-menu-item {
          transition: all 0.3s ease;
        }
        
        .nav-menu-item:hover ~ .nav-menu-item {
          transform: translateY(8px);
        }
        
        .nav-menu-item:hover + .nav-menu-item {
          transform: translateY(8px);
        }
      `}</style>
    </>
  );
};

export default Navbar;