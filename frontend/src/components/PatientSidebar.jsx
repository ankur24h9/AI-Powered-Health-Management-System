import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  FileText,
  Pill,
  Activity,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function PatientSidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/patients-dash",
    },
    {
      name: "Book Appointments",
      icon: Calendar,
      path: "/add-patient",
    },
    {
      name: "My Reports",
      icon: FileText,
      path: "/my-reports",
    },
    {
      name: "Prescriptions",
      icon: Pill,
      path: "/prescriptions",
    },
    {
      name: "Medical History",
      icon: Activity,
      path: "/medical-history",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/patient-settings",
    },
  ];

  return (
    <>
    
      <button
        onClick={() => setOpen(true)}
        className="fixed top-25 left-5 z-60 lg:hidden bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : -300,
        }}
        transition={{
          duration: 0.3,
        }}
        className="fixed top-0 left-0 z-50  w-72 bg-white shadow-2xl lg:translate-x-0 lg:static lg:block"
      >

        <div className="flex items-center justify-between p-2 border-b">
         

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 px-4 space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-5 p-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                  }`
                }
              >
                <Icon size={22} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
}