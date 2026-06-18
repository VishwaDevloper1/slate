import { useState } from "react";
import { useAuth } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Users, PenTool, GitBranch, ShieldCheck } from "lucide-react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Extract user initial safely for a clean CSS avatar
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "";

  return (
    <div
      className="relative font-sans"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* HEADER AVATAR TRIGGER TRIGGER BUTTON */}
      <button className="flex items-center justify-center p-1 rounded-full transition-transform active:scale-95 focus:outline-none cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-bold text-sm shadow-sm transition-colors hover:bg-red-100/80">
          {userInitial ? userInitial : <User size={18} />}
        </div>
      </button>

      {/* DROPDOWN EXPANSION OVERLAY CARD */}
      {open && (
        <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* User Info Header Section */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-extrabold text-base border border-red-100 shrink-0">
              {userInitial ? userInitial : <User size={20} />}
            </div>

            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 truncate">
                {user?.username || "Guest Account"}
              </h3>
              <p className="text-sm font-medium text-slate-400 truncate">
                {user?.email || "No email assigned"}
              </p>
            </div>
          </div>

          {/* Navigation Links Area */}
          <div className="py-2 space-y-0.5">
            <MenuItem icon={<Settings size={16} />} text="Account Settings" />
            <MenuItem icon={<Users size={16} />} text="Team" />
            <MenuItem icon={<PenTool size={16} />} text="Signatures" />
            <MenuItem icon={<GitBranch size={16} />} text="Workflows" />
            <MenuItem icon={<ShieldCheck size={16} />} text="Upgrade to Premium" premium />
          </div>

          {/* Authentication Process Command Row */}
          <div className="border-t border-slate-100 pt-2 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  text: string;
  icon: React.ReactNode;
  premium?: boolean;
}

function MenuItem({ text, icon, premium = false }: MenuItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
        premium
          ? "text-amber-600 hover:bg-amber-50/70"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={premium ? "text-amber-500" : "text-slate-400 group-hover:text-slate-600"}>
        {icon}
      </span>
      {text}
    </button>
  );
}