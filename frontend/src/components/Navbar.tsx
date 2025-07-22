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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200"
            : "bg-white/90 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                MediCore
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "text-sm cursor-pointer font-medium transition-colors hover:text-gray-900 relative pb-1",
                    pathname === item.path
                      ? "text-gray-900 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:rounded-full"
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Get started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80">
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-semibold">MediCore</span>
                </div>

                <nav className="hidden lg:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "text-sm cursor-pointer font-medium transition-colors hover:text-gray-900 relative pb-1",
                        pathname === item.path
                          ? "text-gray-900 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:rounded-full after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                          : "text-gray-600 after:scale-x-0 after:transition-transform after:duration-300 after:origin-left"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="space-y-3 pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/signin")}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    onClick={() => handleNavigation("/signup")}
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
