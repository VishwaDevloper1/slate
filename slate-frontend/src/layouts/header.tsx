import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/usercontext";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CHANGE THIS FOR TESTING
  const {isLoggedIn} = useAuth();

  const navLinks = [
    { name: "MERGE PDF", href: "/merge" },
    { name: "SPLIT PDF", href: "/split" },
    { name: "COMPRESS PDF", href: "/compress" },
    { name: "CONVERT PDF", href: "/image-to-pdf" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-20 px-4 lg:px-8 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <a href="#" className="shrink-0">
            <img
              src="/logo.png"
              alt="PDF Tool Logo"
              className="h-9 w-auto"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-semibold text-gray-800 hover:text-red-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <ProfileDropdown />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-7 h-7 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* Tablet/Desktop */}
              <a
                href="/login"
                className=" text-xl hidden md:flex items-center justify-center  bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-3 rounded-lg"
              >
                Login
              </a>

              <a
                href="/signup"
                className=" text-xl hidden md:flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-3 rounded-lg"
              >
                Sign Up
              </a>

              {/* Mobile/Tablet Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE/TABLET MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-500"
              >
                {link.name}
              </a>
            ))}

            {/* Only show login/signup if guest */}
            {!isLoggedIn && (
              <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col md:hidden">
                <a
                  href="#"
                  className="mx-4 mt-2 text-center border border-gray-300 bg-white text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-50"
                >
                  Login
                </a>

                <a
                  href="#"
                  className="mx-4 my-2 text-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-lg"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}