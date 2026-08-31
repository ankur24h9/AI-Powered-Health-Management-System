import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Grabs the secret ?token=xyz string from the URL

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      // Sends the text body to your backend endpoint
      await axios.post(
        `http://localhost:8081/auth/reset-password?token=${token}`, 
        passwords.password,
        { headers: { "Content-Type": "text/plain" } }
      );

      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000); // Changes view back to your login route
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to reset password. The link might be expired.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-slate-900 to-blue-900 flex justify-center items-center p-4">
      {/* Background Blobs for Design Consistency */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white z-10">
        <h3 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
          Create New Password
        </h3>
        <p className="text-sm text-slate-300 text-center mb-8">
          Please enter your secure new password below.
        </p>

        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={passwords.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3.5 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;