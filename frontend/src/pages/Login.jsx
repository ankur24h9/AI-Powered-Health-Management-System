import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "PATIENT", // Set a default value so the select dropdown works properly
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/auth/login",
        loginData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.data.username,
          email: response.data.email,
          role: response.data.role,
        })
      );

      const role = response.data.role;
      toast.success("Login Successful");

      if (role === "ADMIN") navigate("/admin");
      else if (role === "DOCTOR") navigate("/doctor");
      else if (role === "PATIENT") navigate("/patients-dash");
      else navigate("/");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.response?.data || "Login Failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/auth/forgot-password", {
        email: forgotEmail,
      });
      
      toast.success("Reset link sent to your email!");
      setIsForgotPassword(false); // Switch back to login view
      setForgotEmail("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-slate-900 to-blue-900 flex justify-center items-center p-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white z-10 transition-all duration-300">
        
        {!isForgotPassword ? (
          /* LOGIN FORM VIEW */
          <>
            <h3 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
              Welcome Back
            </h3>
            <p className="text-sm text-slate-300 text-center mb-8">Please enter your credentials to login</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={loginData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Select Role</label>
                <select
                  name="role"
                  value={loginData.role}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 focus:border-blue-500 focus:outline-none transition text-white"
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN" disabled>Admin</option>
                </select>
              </div>

              <div className="text-right">
                <span 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition duration-150 underline decoration-dotted"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-8">
              New User?{" "}
              <span
                className="text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Register Now
              </span>
            </p>
          </>
        ) : (

          <>
            <h3 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
              Reset Password
            </h3>
            <p className="text-sm text-slate-300 text-center mb-8">
              Enter your email and we will send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3.5 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-8">
              Remembered your credentials?{" "}
              <span
                className="text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;