import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async () => {
    try {
      setError("");
      setSuccess("");
  
      const token = searchParams.get("token");
  
      if (!token) {
        setError("Invalid reset link");
        return;
      }
  
      if (!password || !confirmPassword) {
        setError("All fields are required");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      setLoading(true);
  
      await api.post("/reset", {
        token,
        password,
      });
  
      setSuccess("Password reset successful");
  
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Create New Password
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Enter a strong new password for your account.
          </p>

          {/* New Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
               value={password}
               onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
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

          {/* Submit Button */}
          <button 
           onClick={handleResetPassword}
           disabled={loading}
           className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600">
            {loading? "Updating Password...": "Reset Password"}
          </button>
           
          {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}
            
            {success && (
              <p className="mt-4 text-sm text-green-600">
                {success}
              </p>
            )} 
            
          {/* Back to Login */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="font-medium text-red-500 hover:underline"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="max-w-md text-center">
          <img
            src="/reset-password-image.png"
            alt="Reset Password Illustration"
            className="w-full max-w-xs mx-auto mb-6"
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Secure Your Account
          </h2>

          <p className="text-gray-600">
            Choose a strong password that you haven't used before to keep your
            account safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;