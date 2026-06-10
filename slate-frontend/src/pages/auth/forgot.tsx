import { useState } from "react";
import { Mail } from "lucide-react";
import api from "../../services/api";

const ForgotPassword = () => {
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [resetLink, setResetLink] = useState("");
const handleForgotPassword = async () => {
  try {
    setError("");
    setSuccess("");
    setResetLink("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    const response = await api.post(
      "/forgot-password",
      {
        email,
      }
    );

    setSuccess(
      "Reset link generated successfully"
    );

    if (response.data.reset_link) {
      setResetLink(
        response.data.reset_link
      );
    }

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
            Reset Your Password
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Enter your email address and we'll send you instructions to
            reset your password.
          </p>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                        setEmail(e.target.value)
                           }
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>
          </div>

          {/* Send Button */}
          <button  onClick={handleForgotPassword}
  disabled={loading}
          className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600">
            {loading
    ? "Generating Link..."
    : "Send Reset Link"}
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

{resetLink && (
  <div className="mt-4 rounded-lg bg-gray-100 p-3 text-sm break-all">
    {resetLink}
  </div>
)}
          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
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

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="max-w-md text-center">
          <img
            src="/forgot-password-image.png"
            alt="Forgot Password Illustration"
            className="w-full max-w-xs mx-auto mb-6"
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Lost Password?
          </h2>

          <p className="text-gray-600">
            No worries. We'll help you get back into your account quickly and
            securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;