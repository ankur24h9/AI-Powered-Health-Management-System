import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Footer from "../components/footer";
import {
  Home,
  Calendar,
  FileText,
  Pill,
  Activity,
  Settings,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import PatientSidebar from "../components/PatientSidebar";

export default function PatientDashboard() {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);



  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

<PatientSidebar/>


        <div className="flex-1">

          <div className="lg:hidden p-4">
            <button
              onClick={() => setOpen(true)}
            >
              <Menu size={30} />
            </button>
          </div>

          <div className="p-8">


            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-gradient-to-r bg-blue-400 p-10 text-white shadow-2xl"
              >

              <h1 className="text-5xl font-bold">
                Welcome {user?.username}
              </h1>

              <p className="mt-5 text-lg text-blue-100 max-w-4xl">
                Manage appointments, prescriptions,
                reports and your entire medical
                history from one place.
              </p>

              <button
                onClick={() => navigate("/add-patient")}
                className="mt-8 flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </motion.div>


            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {[
                {
                  title: "Appointments",
                  value: "1",
                  color:
                    "bg-violet-700 ",
                },
                {
                  title: "Reports",
                  value: "2",
                  color:
                    "bg-green-500",
                },
                {
                  title: "Prescriptions",
                  value: "1",
                  color:
                    "bg-red-400",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -10,
                  }}
                  className={`rounded-3xl bg-gradient-to-r ${card.color} text-white p-8 shadow-xl`}
                >
                  <h3 className="text-lg">
                    {card.title}
                  </h3>

                  <h1 className="text-5xl font-bold mt-3">
                    {card.value}
                  </h1>
                </motion.div>
              ))}
            </div>


            <div className="grid lg:grid-cols-3 gap-8 mt-10 ">

              {[
                {
                  title:
                    "Medical Records",
                  desc:
                    "Access all your reports securely anytime.",
                },
                {
                  title:
                    "Book Appointments",
                  desc:
                    "Schedule appointments with your doctors in seconds.",
                },
                {
                  title:
                    "Digital Prescriptions",
                  desc:
                    "Never lose your prescriptions again.",
                },
              ].map((card, index) => (
                <motion.div
                  whileHover={{
                    scale: 1.06,
                  }}
                  key={index}
                  className="bg-gray-100 rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold">
                    {card.title}
                  </h2>

                  <p className="text-gray-600 mt-4">
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>


          

          </div>
          <Footer />
        </div>
    
        
      </div>
    </>
  );
}