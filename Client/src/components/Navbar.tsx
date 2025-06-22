import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import colors from "../assets/colors";
import {
  Stethoscope,
  MapPin,
  Video,
  Menu,
  X,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";

const navItems = [
  {
    label: "AI Diagnosis",
    path: "/symptoms-checker",
    icon: Sparkles,
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
    path: "/find-doctor",
    icon: MapPin,
    description: "Locate top-rated physicians near you",
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
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className="fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
        style={{
          backgroundColor: isScrolled
            ? colors.colorUtils?.withOpacity?.(colors.neutral[0], 0.95) ||
              "rgba(255, 255, 255, 0.95)"
            : colors.colorUtils?.withOpacity?.(colors.neutral[0], 0.85) ||
              "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${
            isScrolled ? colors.neutral[200] : colors.neutral[100]
          }`,
          boxShadow: isScrolled ? colors.shadow.lg : colors.shadow.sm,
        }}
      >
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation("/")}
            >
              <div className="relative">
                <div
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
                  style={{
                    background: colors.brand.gradient.primary,
                    boxShadow: `0 4px 14px ${
                      colors.colorUtils?.withOpacity?.(
                        colors.primary[500],
                        0.25
                      ) || "rgba(59, 165, 93, 0.25)"
                    }`,
                  }}
                >
                  <Stethoscope
                    className="w-5 h-5 lg:w-6 lg:h-6"
                    style={{ color: colors.text.onPrimary }}
                  />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary[400] }}
                >
                  <Sparkles
                    className="w-2.5 h-2.5"
                    style={{ color: colors.text.onPrimary }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span
                  className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${colors.neutral[900]}, ${colors.neutral[800]}, ${colors.neutral[700]})`,
                  }}
                >
                  MediCore AI
                </span>
                <span
                  className="text-xs font-medium tracking-wide"
                  style={{ color: colors.text.muted }}
                >
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
                      className="relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group"
                      style={{
                        backgroundColor: isActive
                          ? colors.primary[500]
                          : "transparent",
                        color: isActive
                          ? colors.text.onPrimary
                          : colors.text.body,
                        boxShadow: isActive
                          ? colors.shadow.primaryShadow
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = colors.primary[50];
                          (e.target as HTMLButtonElement).style.color =
                            colors.primary[600];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = "transparent";
                          (e.target as HTMLButtonElement).style.color =
                            colors.text.body;
                        }
                      }}
                    >
                      <Icon
                        className="w-4 h-4 transition-all duration-300"
                        style={{
                          color: isActive
                            ? colors.text.onPrimary
                            : colors.text.muted,
                        }}
                      />
                      <span>{item.label}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full shadow-sm"
                          style={{ backgroundColor: colors.neutral[0] }}
                        />
                      )}
                    </button>

                    {/* Hover tooltip */}
                    {hoveredItem === index && !isActive && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-xs rounded-lg shadow-xl whitespace-nowrap z-10 animate-in fade-in-0 zoom-in-95 duration-200"
                        style={{
                          backgroundColor: colors.neutral[900],
                          color: colors.text.onDark,
                        }}
                      >
                        {item.description}
                        <div
                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
                          style={{ backgroundColor: colors.neutral[900] }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTA Section */}
            <div className="hidden lg:flex items-center space-x-3">
              <div
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colors.success[50],
                  color: colors.success[700],
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.success[500] }}
                />
                <span>Online</span>
              </div>

              <button
                className="relative px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                style={{
                  background: colors.brand.gradient.primary,
                  color: colors.text.onPrimary,
                  boxShadow: colors.shadow.primaryShadow,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Emergency</span>
                </span>
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundColor:
                      colors.colorUtils?.withOpacity?.(
                        colors.neutral[0],
                        0.1
                      ) || "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl transition-colors duration-200"
              style={{
                color: colors.text.body,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color =
                  colors.primary[600];
                (e.target as HTMLButtonElement).style.backgroundColor =
                  colors.primary[50];
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = colors.text.body;
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
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
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundColor:
                colors.colorUtils?.withOpacity?.(colors.neutral[900], 0.5) ||
                "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className="absolute top-20 left-4 right-4 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-300"
            style={{
              backgroundColor: colors.background.primary,
              boxShadow: colors.shadow["2xl"],
              border: `1px solid ${colors.border.light}`,
            }}
          >
            {/* Mobile Navigation */}
            <div className="p-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? colors.primary[500]
                        : "transparent",
                      color: isActive
                        ? colors.text.onPrimary
                        : colors.text.body,
                      boxShadow: isActive
                        ? colors.shadow.primaryShadow
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          colors.primary[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                      }
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: isActive
                          ? colors.text.onPrimary
                          : colors.text.muted,
                      }}
                    />
                    <div className="flex-1">
                      <div
                        className="font-medium"
                        style={{
                          color: isActive
                            ? colors.text.onPrimary
                            : colors.text.primary,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="text-sm mt-0.5"
                        style={{
                          color: isActive
                            ? colors.colorUtils?.withOpacity?.(
                                colors.text.onPrimary,
                                0.8
                              ) || "rgba(255, 255, 255, 0.8)"
                            : colors.text.muted,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile CTA Section */}
            <div
              className="p-6"
              style={{
                borderTop: `1px solid ${colors.border.light}`,
                backgroundColor:
                  colors.colorUtils?.withOpacity?.(colors.primary[50], 0.3) ||
                  "rgba(240, 249, 243, 0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.success[500] }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.success[700] }}
                  >
                    24/7 Support Available
                  </span>
                </div>
                <Clock
                  className="w-4 h-4"
                  style={{ color: colors.text.muted }}
                />
              </div>

              <button
                className="w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg"
                style={{
                  background: colors.brand.gradient.primary,
                  color: colors.text.onPrimary,
                  boxShadow: colors.shadow.primaryShadow,
                }}
              >
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
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;
