import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-gray-900 font-medium" : "text-gray-600";

  const photoCategories = ["B&People", "Urban", "Nature", "B&W", "Textures"];
  const drawingCategories = ["Portraits", "Pencils", "Colors", "Dumps"];

  return (
    <header className="z-10 fixed top-0 left-0 right-0 flex justify-center py-2 isolation-isolate">
      <div className="flex items-center justify-center bg-[#dbe3eb] rounded-lg">
        <NavigationMenu className="relative z-50">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={`px-4 py-2 text-lg rounded-lg hover:bg-accent/50 hover:text-gray-900 ${isActive("/")}`}>
                Guy Altmann - Home
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/about" className={`px-4 py-2 text-lg rounded-lg hover:bg-accent/50 hover:text-gray-900 ${isActive("/about")}`}>
                About
              </Link>
            </NavigationMenuItem>

            {/* Photos */}
            <NavigationMenu className="relative z-50">
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger
                    className={`relative px-4 py-2 text-lg rounded-lg hover:bg-accent/50 hover:text-gray-900 ${isActive("/photos")} bg-transparent`}
                  >
                    Photos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="relative z-50 mt-0 p-4 bg-accent"
                  >
                      <ul className="grid w-[4.5em] gap-3">
                      {photoCategories.map((category) => (
                        <li key={category}>
                          <a
                            href={`/photos?category=${category}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/photos?category=${category}`;
                            }}
                          >
                            {category}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Drawings */}
            <NavigationMenu className="relative z-50">
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger
                    className={`relative px-4 py-2 text-lg rounded-lg hover:bg-accent/50 hover:text-gray-900 ${isActive("/drawings")} bg-transparent`}
                  >
                    Drawings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="relative z-50 mt-0 p-4 bg-accent"
                  >
                    <ul className="grid w-[5.5em] gap-3">
                      {drawingCategories.map((category) => (
                        <li key={category}>
                          <a
                            href={`/drawings?category=${category}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/drawings?category=${category}`;
                            }}
                          >
                            {category}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>



            <NavigationMenuItem>
              <Link to="/music" className={`px-4 py-2 text-lg rounded-lg hover:bg-accent/50 hover:text-gray-900 ${isActive("/music")}`}>
                Music
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navigation;
