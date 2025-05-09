import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? "active" : "";

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/drawings", label: "Drawings" },
    { path: "/photos", label: "Photos" },
    { path: "/music", label: "Music" },
  ];

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="text-site-dark-gray bg-white/30 hover:bg-white/50 transition-all duration-300 h-12 w-12 p-2"
            >
              <Menu className="h-8 w-8" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[190px] rounded-lg bg-white/0 border-none shadow-lg fixed top-4 right-4 [&>button.absolute.right-4.top-4]:hidden"
          >
            <SheetClose asChild>
              <button className="absolute text-2xl right-2 top-0 text-gray-100 rounded-full backdrop-blur-sm p-2">
                X
              </button>
            </SheetClose>
            <nav className="flex flex-col gap-3 pt-6">
              {menuItems.map((item) => (
                <SheetClose asChild key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-2xl py-3 px-4 bg-white/50 backdrop-blur-sm rounded-md transition-all duration-200
                      hover:bg-gray-100/80 relative overflow-hidden text-gray-900`}
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