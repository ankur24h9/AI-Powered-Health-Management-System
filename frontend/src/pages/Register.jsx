import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    phone:"",
    email: "",
    password: "",
    role: "PATIENT",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/auth/register",
        form
      );
      toast.success(response.data);
      setOtpSent(true);
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/otp/verify",
        {
          email: form.email,
          otp: otp,
        }
      );

      toast.success(res.data);
      navigate("/login");

      setForm({
        username: "",
        phone:"",
        email: "",
        password: "",
        role: "PATIENT",
      });
      setOtp("");
      setOtpSent(false);
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-slate-900 to-blue-900 flex justify-center items-center p-4">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white z-10 transition-all duration-300">
        
        {!otpSent ? (
          <>
            <h3 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
              Create Account
            </h3>
            <p className="text-sm text-slate-300 text-center mb-8">Get started by creating your account setup</p>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                />
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 "
                required
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400 mb-4"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Assign Account Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 focus:border-blue-500 focus:outline-none transition text-white"
                >
                  <option value="no role">Select Your Role</option>
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Register
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Verify Identity
            </h3>
            <p className="text-sm text-slate-300 text-center mb-8">
              We've dispatched a security token to your email inbox. Please type it below.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Enter Verification Code</label>
                <input
                  type="text"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 text-center tracking-widest text-xl rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-3.5 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5"
              >
                Verify Code
              </button>
            </form>
          </>
        )}

        <p className="text-center text-slate-400 text-sm mt-8">
          Already have an account?{" "}
          <span
            className="text-blue-400 font-semibold cursor-pointer hover:underline ml-1"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}