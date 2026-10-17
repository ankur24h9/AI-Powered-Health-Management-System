import { useContext, useEffect, useMemo, useState } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getDoctorAppointments } from "../api/appointmentApi";
import DoctorSidebar from "../components/DoctorSidebar";
import { Users, Clock, CheckCircle2, XCircle, Calendar, ShieldAlert } from "lucide-react";

function DoctorDashboard() {
  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDoctorAppointments();
        console.log("Appointments fetched:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments workflow updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(
        (a) => a.status?.toUpperCase() === "PENDING"
      ).length,
      completed: appointments.filter(
        (a) => a.status?.toUpperCase() === "COMPLETED"
      ).length,
      cancelled: appointments.filter(
        (a) => a.status?.toUpperCase() === "CANCELLED"
      ).length,
    };
  }, [appointments]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-amber-600 text-white font-bold";
      case "COMPLETED":
        return "bg-emerald-600 text-white font-bold";
      case "CANCELLED":
        return "bg-rose-600 text-white font-bold";
      default:
        return "bg-zinc-600 text-white font-bold";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-200 text-slate-800 flex flex-col">
        <DoctorNavbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-sm font-bold text-slate-600 tracking-wide animate-pulse">
              Syncing Medical Records...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 text-slate-800 flex flex-col font-sans">
      <DoctorNavbar />

      <div className="flex flex-1">
        <DoctorSidebar />

        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-300 pb-5">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Welcome back, <span className="font-bold text-slate-900">{user?.username || "Practitioner"}</span>. Here is your overview.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm self-start sm:self-auto">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-rose-600 text-white p-4 rounded-xl shadow-md">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-indigo-50 border-l-4 border-l-indigo-600 border-y-slate-300 border-r-slate-300 border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Patients</span>
                <Users className="w-5 h-5 text-indigo-700" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
            </div>

            <div className="bg-amber-50 border-l-4 border-l-amber-500 border-y-slate-300 border-r-slate-300 border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Action</span>
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.pending}</p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-l-emerald-500 border-y-slate-300 border-r-slate-300 border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Cases</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.completed}</p>
            </div>

            <div className="bg-rose-50 border-l-4 border-l-rose-500 border-y-slate-300 border-r-slate-300 border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cancelled Slips</span>
                <XCircle className="w-5 h-5 text-rose-700" />
              </div>
              <p className="text-3xl font-black text-slate-900 mt-2">{stats.cancelled}</p>
            </div>

          </div>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              Live Clinic Queue Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-300 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500">
                    Current Token
                  </h3>
                  <p className="text-4xl font-black text-indigo-600 mt-1">
                    {appointments[0]?.tokenNo ?? "--"}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200">
                  Active Now
                </div>
              </div>

              <div className="bg-white border border-slate-300 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500">
                    Next Up
                  </h3>
                  <p className="text-4xl font-black text-teal-600 mt-1">
                    {appointments[1]?.tokenNo ?? "--"}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-teal-50 text-teal-700 font-bold text-xs rounded-lg border border-teal-200">
                  Staged
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-sm overflow-hidden">
            <h2 className="text-base font-black tracking-tight text-slate-900 mb-4">
              Today's Scheduled Appointments
            </h2>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Token</th>
                    <th className="py-3 px-3">Patient Identity</th>
                    <th className="py-3 px-3 text-center">Age</th>
                    <th className="py-3 px-3">Arrival Time</th>
                    <th className="py-3 px-3 text-right">Queue Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="group hover:bg-white/40 transition-colors"
                      >
                        <td className="py-3.5 px-3 font-mono font-black text-indigo-600">
                          #{appointment.tokenNo}
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {appointment.patient?.firstName || "Unknown"}{" "}
                          {appointment.patient?.lastName || ""}
                        </td>

                        <td className="py-3.5 px-3 text-center font-medium text-slate-800">
                          {appointment.patient?.age ?? "-"}
                        </td>

                        <td className="py-3.5 px-3 font-medium text-slate-600">
                          {appointment.appointmentTime
                            ? appointment.appointmentTime.substring(0, 5)
                            : "--:--"}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs tracking-wide uppercase ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm font-bold">No appointments registered in the portal today.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;