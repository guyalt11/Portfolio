import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import PhotosNavbar from "./PhotosNavbar";
import DrawingNavbar from "./DrawingNavbar";

const Navbar = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const photoCategories = ["B&People", "Urban", "Nature", "B&W", "Textures"];
  const drawingCategories = ["Portraits", "Pencils", "Colors", "Dumps"];

  const isActive = (path: string) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/about", label: "About" },
    { path: "/photos", label: "Photos" },
    { path: "/drawings", label: "Drawings" },
    { path: "/music", label: "Music" },
  ];

  const filteredItems = menuItems.filter(item => item.path !== "/login" && item.path !== "/cms");

  return (
    <>
      {isHomepage && (
        <nav className="fixed inset-0 z-10 flex justify-center items-center bg-gray-800 bg-opacity-50 p-6
            sm:inset-auto sm:top-0 sm:right-0 sm:h-screen sm:w-1/2 sm:min-w-[400px]
            sm:bg-transparent sm:p-0 sm:justify-center sm:items-center"
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
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      to={item.path}
                      className="relative text-4xl text-white sm:text-site-dark-gray transition-all duration-300 group py-4 px-8"
                      style={{ opacity }}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                    {hoveredItem === item.label && (item.label === "Photos" || item.label === "Drawings") && (
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2 -ml-10 opacity-100 transition-opacity duration-200"
                      >
                        <div className="py-4 min-w-[160px] hidden sm:block">
                          {item.label === "Photos" && <PhotosNavbar />}
                          {item.label === "Drawings" && <DrawingNavbar />}
                        </div>
                      </div>
                    )}
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
