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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/drawings?category=Pencils", label: "Pencils" },
    { path: "/drawings?category=Colors", label: "Colors" },
    { path: "/drawings?category=Portraits", label: "Portraits" },
    { path: "/drawings?category=Dumps", label: "Dumps" },
  ];

  const filteredItems = menuItems.filter(item => item.path !== "/login" && item.path !== "/cms");

  return (
    <>
      {isHomepage && (
        <nav className=""
        > 
          <ul className="flex flex-col gap-6">
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
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      to={item.path}
                      className="relative text-2xl text-white md:text-site-dark-gray transition-all duration-300 group py-4 px-8"
                      style={{ opacity }}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

    </>
  );
};

export default Navbar;
