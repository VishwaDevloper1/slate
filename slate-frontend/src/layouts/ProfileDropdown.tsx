import { useState } from "react";
import { useAuth } from "../context/usercontext";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <img
            src="/avatar.png"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
          {/* User */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full overflow-hidden border">
              <img
                src="/avatar.png"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
              {user?.username}
              </h3>
              <p className="text-sm text-gray-500">
              {user?.email}
              </p>
            </div>
          </div>

          <div className="py-2">
            <MenuItem text="Account Settings" />
            <MenuItem text="Team" />
            <MenuItem text="Signatures" />
            <MenuItem text="Workflows" />
            <MenuItem text="Upgrade to Premium" premium />
          </div>

          <div className="border-t border-gray-200 pt-2">
          <button
  onClick={handleLogout}
  className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
>
  Log Out
</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  text,
  premium = false,
}: {
  text: string;
  premium?: boolean;
}) {
  return (
    <button
      className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
        premium
          ? "text-amber-600 hover:bg-amber-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {text}
    </button>
  );
}