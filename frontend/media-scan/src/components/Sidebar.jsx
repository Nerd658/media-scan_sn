import {
  HomeIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  BellIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon, // Import for settings/sources icon
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon, // Import for logout icon
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Historique", href: "/history", icon: ClockIcon },
  { name: "Analyser", href: "/analyze", icon: DocumentMagnifyingGlassIcon },
  { name: "Alertes", href: "/alerts", icon: BellIcon },
  { name: "Comparaison Médias", href: "/compare-media", icon: ArrowsRightLeftIcon },
  { name: "Gestion des Sources", href: "/sources", icon: Cog6ToothIcon }, // New navigation item
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth(); // Use useAuth to get the logout function
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        {/* CSC Logo */}
        <img
          className="h-10 w-auto mr-2"
          src="https://lefaso.net/local/cache-vignettes/L620xH446/capture_d_ecran_2025-05-26_144227-97472.jpg?1762787163" // CSC logo URL
          alt="CSC Logo"
        />
        <h1 className="text-2xl font-bold text-white">Media-Scan</h1>
      </div>
      <nav id="sidebar-navigation" className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )
                    }
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <button
              onClick={toggleTheme}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              {theme === "light" ? (
                <MoonIcon className="h-6 w-6 shrink-0" />
              ) : (
                <SunIcon className="h-6 w-6 shrink-0" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group -mx-2 mt-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
