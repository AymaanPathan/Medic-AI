"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  MapPin,
  Menu,
  X,
  MessageCircle,
  Shield,
  Upload,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  {
    label: "Diagnosis",
    path: "/diagnosis",
    icon: Brain,
  },
  {
    label: "Chat",
    path: "/Chat",
    icon: MessageCircle,
  },
  {
    label: "Analysis",
    path: "/symptom-form",
    icon: Upload,
  },
  {
    label: "Doctors",
    path: "/doctors",
    icon: MapPin,
  },
  {
    label: "Resources",
    path: "/resources",
    icon: Shield,
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "text-sm cursor-pointer font-medium transition-colors hover:text-gray-900",
                      isActive ? "text-gray-900" : "text-gray-600"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
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

                <div className="space-y-4 mb-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

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
