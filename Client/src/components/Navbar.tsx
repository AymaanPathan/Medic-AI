import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  MapPin,
  Video,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  Shield,
  Clock,
  Upload,
  Brain,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    path: "/",
    icon: Brain,
    description: "Understand how it works",
  },
  {
    label: "chat",
    path: "/chat",
    icon: MessageCircle,
    description: "Understand how it works",
  },
  {
    label: "AI Diagnosis",
    path: "/symptoms-checker",
    icon: Brain,
    description: "Get instant AI-powered health insights",
  },
  {
    label: "Find Doctors",
    path: "/find-doctor",
    icon: MapPin,
    description: "Locate top-rated physicians near you",
  },
  {
    label: "Upload Image",
    path: "/upload-image",
    icon: Upload,
    description: "AI-powered medical image analysis",
  },
  {
    label: "Telehealth",
    path: "/consultation",
    icon: Video,
    description: "24/7 online medical consultations",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".mobile-menu-container")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed mb-12 top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200"
            : "bg-white/90"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation("/")}
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  MediCore AI
                </span>
                <span className="text-xs font-medium text-gray-500 tracking-wide">
                  Intelligent Healthcare
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                            : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-emerald-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </button>

                    {/* Hover tooltip */}
                    {hoveredItem === index && !isActive && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-xs bg-gray-900 text-white rounded-lg shadow-xl whitespace-nowrap z-10 animate-in fade-in-0 zoom-in-95 duration-200">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTA Section */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </div>

              <button className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Emergency</span>
                </span>
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="mobile-menu-container absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-5 duration-300">
            {/* Mobile Navigation */}
            <div className="p-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200
                      ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isActive ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-sm mt-0.5 ${
                          isActive ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile CTA Section */}
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">
                    24/7 Support Available
                  </span>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
                <span className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Emergency Consultation</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-18" />
    </>
  );
};

export default Navbar;
