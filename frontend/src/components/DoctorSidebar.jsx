import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  ClipboardList, 
  FileText, 
  History,
  Settings,
  UserSquare2
} from "lucide-react";

function DoctorSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Dashboard Overview",
      path: "/doctor",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Live Queue & Token Control",
      path: "/doctor/live-queue",
      icon: <CalendarClock size={20} />,
    },
    {
      title: "My Patients Directory",
      path: "/doctor/patients",
      icon: <Users size={20} />,
    },
    {
      title: "Write Prescriptions",
      path: "/write-prescription",
      icon: <ClipboardList size={20} />,
    },
    {
      title: "Medical Certificates",
      path: "/doctor/certificates",
      icon: <FileText size={20} />,
    },
    {
      title: "Appointment History",
      path: "/doctor/history",
      icon: <History size={20} />,
    },
  
    {
      title: "Clinic Settings",
      path: "/doctor/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-68px)] bg-slate-100 border-r border-slate-300 p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">
            Clinical Operations
          </p>
          
          <nav className="space-y-5">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition duration-200 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 transition-colors"}>
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          System Core Node
        </p>
        <p className="text-[11px] font-black text-slate-700 mt-0.5">
          v2.1.0-Vite
        </p>
      </div>
    </aside>
  );
}

export default DoctorSidebar;