import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");
  
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill all fields");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      setLoading(true);
  
      await api.post("/signup", {
        username,
        email,
        password,
      });
  
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-white">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="max-w-md text-center">
          <img
            src="/auth-image.png"
            alt="PDF Tools Illustration"
            className="w-full max-w-xs mx-auto mb-6"
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            PDF Tools for Productive People
          </h2>

          <p className="text-gray-600">
            Merge, Split, Compress and Convert PDFs quickly and securely.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Create Your Account
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-5">
            Start managing your PDFs today
          </p>

          {/* Full Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
              
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
            />

            <label
              htmlFor="terms"
              className="text-sm text-gray-600"
            >
              I agree to the{" "}
              <a
                href="/terms"
                className="text-red-500 hover:underline"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-red-500 hover:underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {error && (
           <p className="mb-3 text-sm text-red-500">
             {error}
            </p>
              )}
          {/* Signup Button */}
          <button 
           onClick={handleSignup}
           disabled={loading}
           className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-red-500 hover:underline"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;