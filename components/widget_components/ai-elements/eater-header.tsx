import React from "react";
import { Map, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface EaterHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EaterHeader = React.forwardRef<HTMLDivElement, EaterHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border-b-2 border-dotted border-[#E60001] py-4 px-6",
          className
        )}
        {...props}
      >
        {/* Top Row: Maps Icon | Logo | Search & Menu Icons */}
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left: Maps Icon */}
          <button
            className="text-[#E60001] hover:text-[#c20001] transition-colors"
            aria-label="View map"
          >
            <Map className="w-6 h-6" />
          </button>

          {/* Center: Eater Logo */}
          <h1
            className="text-4xl font-bold text-[#E60001] tracking-wider"
            style={{ fontFamily: "Degular, sans-serif" }}
          >
            EATER
          </h1>

          {/* Right: Search & Menu Icons */}
          <div className="flex items-center gap-3">
            <button
              className="text-[#E60001] hover:text-[#c20001] transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              className="text-[#E60001] hover:text-[#c20001] transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Location Dropdown */}
        <div className="flex items-center justify-center mt-3">
          <button
            className="text-[#E60001] text-xs font-bold tracking-widest hover:underline"
            style={{ fontFamily: "Degular, sans-serif" }}
            aria-label="Select location"
          >
            LOS ANGELES
          </button>
        </div>
      </div>
    );
  }
);

EaterHeader.displayName = "EaterHeader";
