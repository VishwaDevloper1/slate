import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/usercontext";


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, setUser } = useAuth();


  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
  
      const response = await api.post("/login", {
        email,
        password,
      });
  
      login(
        response.data.access_token
      );
      
      const meResponse = await api.get(
        "/me",
        {
          headers: {
            Authorization:
              `Bearer ${response.data.access_token}`
          }
        }
      );
      
      console.log(meResponse.data);
      
      setUser(meResponse.data);
      
      navigate("/");
  
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-10">
        <div className="max-w-md text-center">
          <img
            src="/auth-image.png"
            alt="PDF Management Illustration"
            className="w-full max-w-sm mx-auto mb-8"
          />

          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Manage Your PDFs Effortlessly
          </h2>

          <p className="text-gray-600 text-lg">
            Merge, Split, Compress and Convert PDF files securely in seconds.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Login to access your account
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              value={email}
             onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">
            {error}
             </p>
             )}

          {/* Login Button */}
          <button 
           onClick={handleLogin}
           disabled={loading}
          className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600">
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-red-500 hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;