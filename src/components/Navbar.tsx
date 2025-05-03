import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
//import { isAuthenticated } from "@/services/authService";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  //const isAdmin = isAuthenticated();
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
    { path: "/drawings", label: "Drawings" },
    { path: "/photos", label: "Photos" },
    { path: "/music", label: "Music" },
    //{ path: isAdmin ? "/cms" : "/login", label: isAdmin ? "Admin" : "Admin Login" }
  ];

  const handleCloseSheet = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop menu - Only on homepage */}
      {isHomepage && (
        <nav
          className="
            fixed inset-0 z-10 flex justify-center items-center 
            bg-gray-800 bg-opacity-50 p-6
            md:inset-auto md:top-0 md:right-0 md:h-screen md:w-1/2 md:min-w-[400px]
            md:bg-transparent md:p-0
            md:justify-center md:items-center
          "
        >
          <ul className="flex flex-col gap-12">
            {menuItems.filter(item => item.path !== "/login" && item.path !== "/cms").map((item) => (
              <li key={item.path} className="nav-menu-item">
                <Link 
                  to={item.path} 
                  className="relative text-4xl text-white opacity-75 hover:opacity-100 transition-all duration-300 group py-4 px-8"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 right-0 bottom-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Hamburger menu trigger - shown on all pages */}
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 transition-all duration-300 h-12 w-12 p-2"
            >
              <Menu className="h-8 w-8 !size-8" width="2rem" height="2rem" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right"
            className="w-[300px] rounded-lg bg-white/70 backdrop-blur-sm border-none shadow-lg fixed top-4 right-4 h-auto max-h-[calc(100vh-2rem)]"
          >
            <nav className="flex flex-col gap-4 pt-4">
              {menuItems.map((item) => (
                <SheetClose asChild key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`
                      text-xl py-3 px-4 rounded-md transition-all duration-200
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
