import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
//import { isAuthenticated } from "@/services/authService";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  //const isAdmin = isAuthenticated();
  const isHomepage = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isActive = (path: string) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/about", label: "About" },
    { path: "/drawings", label: "Drawings" },
    { path: "/photos", label: "Photos" },
    { path: "/music", label: "Music" },
    //{ path: isAdmin ? "/cms" : "/login", label: isAdmin ? "Admin" : "Admin Login" }
  ];

  const filteredItems = menuItems.filter(item => item.path !== "/login" && item.path !== "/cms");

  return (
    <>
      {isHomepage && (
        <nav className="fixed inset-0 z-10 flex justify-center items-center bg-gray-800 bg-opacity-50 p-6
            md:inset-auto md:top-0 md:right-0 md:h-screen md:w-1/2 md:min-w-[400px]
            md:bg-transparent md:p-0 md:justify-center md:items-center"
        >
          <ul className="flex flex-col gap-12">
            {filteredItems.map((item, index) => {
              // calculate opacity based on distance
              let opacity = 0.75;
              if (hoveredIndex !== null) {
                const distance = Math.abs(index - hoveredIndex);
                opacity = hoveredIndex === index ? 1 : Math.max(0.3, 1 - distance * 0.2);
              }

              return (
                <li
                  key={item.path}
                  className="nav-menu-item transition-transform duration-300"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transform:
                      hoveredIndex !== null
                        ? index < hoveredIndex
                          ? "translateY(-6px)"
                          : index > hoveredIndex
                          ? "translateY(6px)"
                          : "scale(1.05)"
                        : "none",
                  }}
                >
                  <Link
                    to={item.path}
                    className="relative text-4xl text-white md:text-site-dark-gray transition-all duration-300 group py-4 px-8"
                    style={{ opacity }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white md:bg-site-dark-gray transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="text-white md:text-site-dark-gray hover:bg-white/10 transition-all duration-300 h-12 w-12 p-2"
            >
              <Menu className="h-8 w-8" />
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
                    className={`text-xl py-3 px-4 rounded-md transition-all duration-200
                      hover:bg-gray-100/80 relative overflow-hidden
                      ${isActive(item.path) ? "text-gray-900 font-medium" : "text-gray-600"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Navbar;