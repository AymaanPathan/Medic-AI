"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Stethoscope,
  MapPin,
  Menu,
  MessageCircle,
  Shield,
  Upload,
  Brain,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  {
    label: "Home",
    path: "/",
    icon: Brain,
  },
  {
    label: "Chat",
    path: "/Chat",
    icon: MessageCircle,
  },
  {
    label: "Quick Health Check",
    path: "/symptom-form",
    icon: Upload,
  },
  {
    label: "Near By Doctors",
    path: "/doctors",
    icon: MapPin,
  },
  {
    label: "Prescription Scanning",
    path: "/resources",
    icon: Shield,
  },
  {
    label: "Upload & Hear AI Insight",
    path: "/upload",
    icon: Shield,
  },
];

const Navbar = () => {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
          isScrolled
            ? " bg-black border-b border-white/10 shadow-lg shadow-black/5"
            : " bg-black"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation("/")}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-gray-300 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Stethoscope className="w-4 h-4 text-black" />
                </div>
                <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                MediCore
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-out hover:bg-white/10",
                    pathname === item.path
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  {item.label}
                  {pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10 border-0 transition-all duration-200"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-100 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Get started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-9 h-9 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-80 bg-black/95 backdrop-blur-xl border-l border-white/10"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-gray-300 flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-xl font-semibold text-white">
                    MediCore
                  </span>
                </div>

                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        handleNavigation(item.path);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10",
                        pathname === item.path
                          ? "text-white bg-white/10"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="space-y-3 pt-6 mt-6 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 border-0"
                    onClick={() => {
                      handleNavigation("/signin");
                      setIsOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-100 font-medium shadow-lg"
                    onClick={() => {
                      handleNavigation("/signup");
                      setIsOpen(false);
                    }}
                  >
                    Get started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="h-16" />
    </>
  );
};

export default Navbar;
