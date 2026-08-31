import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Bell,
  Search,
  LogOut,
Stethoscope,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">

      <div className="flex items-center justify-between px-6 py-4">


        <div className="flex items-center gap-3">

          <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
            🏥
          </Link>

          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Smart OPD
            </h1>

            <p className="text-xs text-gray-500">
              Healthcare Management System
            </p>
          </div>

        </div>

     

        <div className="hidden lg:flex relative w-96">

          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search doctors, reports..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

        </div>

        <div className="flex items-center gap-6">


          <button className="relative bg-gray-100 hover:bg-blue-100 p-3 rounded-xl transition">

            <Bell size={22} />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

          </button>


          <div className="flex items-center gap-3">

            <div className="relative">

              <Stethoscope
                size={45}
                className="text-blue-600"
              />

              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>

            </div>

            <div className="hidden md:block">

              <p className="text-xs text-gray-500">
                Welcome Back
              </p>

              <h3 className="font-semibold text-gray-800">
                {"D.R " + (user?.name || "Guest")}
              </h3>

            </div>

          </div>


          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;