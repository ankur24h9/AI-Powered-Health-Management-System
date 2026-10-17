import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Search,
  SkipForward,
  Users,
  X,
  Zap,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const STATUS = {
  PENDING: "PENDING",
  WAITING: "WAITING",
  CONSULTING: "CONSULTING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

function LiveQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

 
  const fetchQueue = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/appointments/doctor");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setAppointments(data);
    } catch (err) {
      console.error("Queue loading error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load the live queue.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

 
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQueue(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchQueue]);

  

const updateStatus = async (appointmentId, status) => {
  try {
    setActionLoading(`${appointmentId}-${status}`);
    setError("");

    await api.put(`/appointments/${appointmentId}/call`, {
      status: status,
    });

    await fetchQueue(true);
  } catch (err) {
    console.error(
      "Status update error:",
      err.response?.data || err
    );

    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to update appointment status."
    );
  } finally {
    setActionLoading(null);
  }
};


 
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const tokenA = a.tokenNo ?? Number.MAX_SAFE_INTEGER;
      const tokenB = b.tokenNo ?? Number.MAX_SAFE_INTEGER;

      return tokenA - tokenB;
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return sortedAppointments;
    }

    return sortedAppointments.filter((appointment) => {
      const patientName =
        appointment.patient?.user?.username ||
        appointment.patient?.username ||
        appointment.patient?.name ||
        "";

      const token = appointment.tokenNo?.toString() || "";

      return (
        patientName.toLowerCase().includes(value) ||
        token.includes(value)
      );
    });
  }, [sortedAppointments, search]);

 
  const statistics = useMemo(() => {
    return {
      total: appointments.length,

      waiting: appointments.filter(
        (a) => a.status === STATUS.WAITING || a.status === STATUS.PENDING
      ).length,

      consulting: appointments.filter(
        (a) => a.status === STATUS.CONSULTING
      ).length,

      completed: appointments.filter(
        (a) => a.status === STATUS.COMPLETED
      ).length,
    };
  }, [appointments]);

  
  const currentPatient = useMemo(() => {
    return appointments.find(
      (appointment) => appointment.status === STATUS.CONSULTING
    );
  }, [appointments]);

  
  const nextPatient = useMemo(() => {
    return sortedAppointments.find(
      (appointment) =>
        appointment.status === STATUS.WAITING ||
        appointment.status === STATUS.PENDING
    );
  }, [sortedAppointments]);

  const getPatientName = (appointment) => {
    return (
      appointment?.patient?.firstName ||
      appointment?.patient?.lastName ||

      "Unknown Patient"
    );
  };

  const getPatientEmail = (appointment) => {
    return (
      appointment?.patient?.email ||
      "No email available"
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case STATUS.CONSULTING:
        return "bg-blue-100 text-blue-700 border-blue-200";

      case STATUS.WAITING:
      case STATUS.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";

      case STATUS.COMPLETED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case STATUS.CANCELLED:
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    if (status === STATUS.PENDING) return "WAITING";

    return status;
  };

  const formatTime = (time) => {
    if (!time) return "--";

    return time.substring(0, 5);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading live queue...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

   

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Zap className="text-white w-6 h-6" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Live Queue
                </h1>

                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>

                  <span className="text-sm text-slate-500">
                    Live • Auto refresh every 10 seconds
                  </span>
                </div>
              </div>

            </div>
          </div>

          <button
            onClick={() => fetchQueue(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing ? "Refreshing..." : "Refresh Queue"}
          </button>

        </div>

       

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="p-1 hover:bg-red-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

    

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          <StatCard
            title="Total Patients"
            value={statistics.total}
            icon={<Users />}
            bg="bg-blue-50"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Waiting"
            value={statistics.waiting}
            icon={<Clock3 />}
            bg="bg-amber-50"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Consulting"
            value={statistics.consulting}
            icon={<Play />}
            bg="bg-indigo-50"
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />

          <StatCard
            title="Completed"
            value={statistics.completed}
            icon={<CheckCircle2 />}
            bg="bg-emerald-50"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

        </div>

       

        {currentPatient ? (
          <div className="mb-7 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-7 text-white shadow-xl shadow-blue-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide">
                    CURRENT PATIENT
                  </span>

                  <span className="flex items-center gap-1 text-xs text-blue-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex items-center gap-4">

                  <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <span className="text-3xl font-black">
                      #{currentPatient.tokenNo}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {getPatientName(currentPatient)}
                    </h2>

                    <p className="text-blue-100 mt-1">
                      {getPatientEmail(currentPatient)}
                    </p>

                    <p className="text-blue-100 text-sm mt-1">
                      Appointment:{" "}
                      {formatTime(currentPatient.appointmentTime)}
                    </p>
                  </div>

                </div>

              </div>

              <button
                onClick={() =>
                  updateStatus(
                    currentPatient.appointmentId,
                    STATUS.COMPLETED
                  )
                }
                disabled={
                  actionLoading ===
                  `${currentPatient.appointmentId}-${STATUS.COMPLETED}`
                }
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition shadow-lg"
              >
                {actionLoading ===
                `${currentPatient.appointmentId}-${STATUS.COMPLETED}` ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}

                Complete Consultation
              </button>

            </div>

          </div>
        ) : (
          <div className="mb-7 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-4">
              No patient is currently consulting
            </h2>

            <p className="text-slate-500 mt-1">
              Call the next patient from the queue below.
            </p>

            {nextPatient && (
              <button
                onClick={() =>
                  updateStatus(
                    nextPatient.appointmentId,
                    STATUS.CONSULTING
                  )
                }
                disabled={
                  actionLoading ===
                  `${nextPatient.appointmentId}-${STATUS.CONSULTING}`
                }
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                {actionLoading ===
                `${nextPatient.appointmentId}-${STATUS.CONSULTING}` ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}

                Call Next Patient • #{nextPatient.tokenNo}
              </button>
            )}

          </div>
        )}

    

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search patient name or token number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

          </div>

        </div>

      

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Today's Queue
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredAppointments.length} patient
                {filteredAppointments.length !== 1 ? "s" : ""} in queue
              </p>
            </div>

            {nextPatient && !currentPatient && (
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <ArrowRight className="w-4 h-4" />
                Next: Token #{nextPatient.tokenNo}
              </div>
            )}

          </div>



          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4">
                    Token
                  </th>

                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Appointment
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredAppointments.map((appointment) => {

                  const isCurrent =
                    appointment.status === STATUS.CONSULTING;

                  const isWaiting =
                    appointment.status === STATUS.WAITING ||
                    appointment.status === STATUS.PENDING;

                  return (
                    <tr
                      key={appointment.appointmentId}
                      className={`transition ${
                        isCurrent
                          ? "bg-blue-50/60"
                          : "hover:bg-slate-50"
                      }`}
                    >

                      {/* Token */}

                      <td className="px-6 py-5">

                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : isWaiting
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{appointment.tokenNo}
                        </div>

                      </td>

                      {/* Patient */}

                      <td className="px-6 py-5">

                        <div className="font-semibold text-slate-900">
                          {getPatientName(appointment)}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {getPatientEmail(appointment)}
                        </div>

                      </td>

                      {/* Time */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Clock3 className="w-4 h-4 text-slate-400" />

                          {formatTime(
                            appointment.appointmentTime
                          )}
                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {isWaiting && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment.appointmentId,
                                  STATUS.CONSULTING
                                )
                              }
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {actionLoading ===
                              `${appointment.appointmentId}-${STATUS.CONSULTING}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}

                              Call
                            </button>
                          )}

                          {isCurrent && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment.appointmentId,
                                  STATUS.COMPLETED
                                )
                              }
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              {actionLoading ===
                              `${appointment.appointmentId}-${STATUS.COMPLETED}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}

                              Complete
                            </button>
                          )}

                          {isWaiting && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment.appointmentId,
                                  STATUS.CANCELLED
                                )
                              }
                              disabled={!!actionLoading}
                              title="Cancel appointment"
                              className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* Mobile cards */}

          <div className="md:hidden divide-y divide-slate-100">

            {filteredAppointments.map((appointment) => {

              const isCurrent =
                appointment.status === STATUS.CONSULTING;

              const isWaiting =
                appointment.status === STATUS.WAITING ||
                appointment.status === STATUS.PENDING;

              return (
                <div
                  key={appointment.appointmentId}
                  className={`p-5 ${
                    isCurrent ? "bg-blue-50" : ""
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-black ${
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : isWaiting
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        #{appointment.tokenNo}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {getPatientName(appointment)}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {formatTime(
                            appointment.appointmentTime
                          )}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>

                  </div>

                  <div className="mt-4">

                    {isWaiting && (
                      <div className="grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            updateStatus(
                              appointment.appointmentId,
                              STATUS.CONSULTING
                            )
                          }
                          disabled={!!actionLoading}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
                        >
                          <Play className="w-4 h-4" />
                          Call Patient
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              appointment.appointmentId,
                              STATUS.CANCELLED
                            )
                          }
                          disabled={!!actionLoading}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>

                      </div>
                    )}

                    {isCurrent && (
                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.appointmentId,
                            STATUS.COMPLETED
                          )
                        }
                        disabled={!!actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Complete Consultation
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

          {/* Empty state */}

          {filteredAppointments.length === 0 && (
            <div className="py-16 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No patients found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                There are no matching appointments in today's queue.
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


function StatCard({
  title,
  value,
  icon,
  bg,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`rounded-2xl ${bg} border border-white p-4 sm:p-5 shadow-sm`}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}
        >
          {React.cloneElement(icon, {
            className: "w-5 h-5",
          })}
        </div>

      </div>
    </div>
  );
}

export default LiveQueue;