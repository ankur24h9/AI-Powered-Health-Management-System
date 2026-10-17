
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  CalendarDays,
  Clock3,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserRound,
  Hash,
  Filter,
  RotateCcw,
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
  ALL: "ALL",
  PENDING: "PENDING",
  WAITING: "WAITING",
  CONSULTING: "CONSULTING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS.ALL);

  const [dateFilter, setDateFilter] = useState("ALL");

  const [sortOrder, setSortOrder] = useState("NEWEST");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;


  const fetchAppointments = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
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
      console.error("Appointment history error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to load appointment history."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);


  const getPatientName = (appointment) => {
    return (
    
      appointment?.patient?.firstName +
      " " +
      appointment?.patient?.lastName ||
      "Unknown Patient"
    );
  };

  const getPatientEmail = (appointment) => {
    return (
      appointment?.patient?.user?.email ||
      appointment?.patient?.email ||
      "Not available"
    );
  };


  const getPatientPhone = (appointment) => {
    return (
      appointment?.patient?.phone ||
      appointment?.patient?.mobile ||
      appointment?.patient?.contactNumber ||
      "Not available"
    );
  };


  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case STATUS.COMPLETED:
        return {
          wrapper: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };

      case STATUS.CONSULTING:
        return {
          wrapper: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock3 className="w-3.5 h-3.5" />,
        };

      case STATUS.WAITING:
      case STATUS.PENDING:
        return {
          wrapper: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };

      case STATUS.CANCELLED:
        return {
          wrapper: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };

      default:
        return {
          wrapper: "bg-slate-50 text-slate-600 border-slate-200",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

 

  const formatTime = (time) => {
    if (!time) return "--";

    try {
      const [hours, minutes] = time.split(":");

      const date = new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0
      );

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time.substring(0, 5);
    }
  };



  const getDateValue = (appointment) => {
    const date = appointment?.appointmentDate || "";
    const time = appointment?.appointmentTime || "00:00";

    return new Date(`${date}T${time}`);
  };



  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

  
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((appointment) => {
        const patientName =
          getPatientName(appointment).toLowerCase();

        const email =
          getPatientEmail(appointment).toLowerCase();

        const token =
          appointment?.tokenNo?.toString() || "";

        const appointmentId =
          appointment?.appointmentId?.toString() || "";

        return (
          patientName.includes(query) ||
          email.includes(query) ||
          token.includes(query) ||
          appointmentId.includes(query)
        );
      });
    }

   
    if (statusFilter !== STATUS.ALL) {
      result = result.filter(
        (appointment) =>
          appointment.status === statusFilter
      );
    }

    if (dateFilter !== "ALL") {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      result = result.filter((appointment) => {
        if (!appointment.appointmentDate) {
          return false;
        }

        const appointmentDate = new Date(
          `${appointment.appointmentDate}T00:00:00`
        );

        if (dateFilter === "TODAY") {
          return (
            appointmentDate.getTime() ===
            today.getTime()
          );
        }

        if (dateFilter === "WEEK") {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);

          return (
            appointmentDate >= weekAgo &&
            appointmentDate <= today
          );
        }

        if (dateFilter === "MONTH") {
          return (
            appointmentDate.getMonth() ===
              today.getMonth() &&
            appointmentDate.getFullYear() ===
              today.getFullYear()
          );
        }

        return true;
      });
    }

    result.sort((a, b) => {
      const dateA = getDateValue(a);
      const dateB = getDateValue(b);

      if (sortOrder === "OLDEST") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [
    appointments,
    search,
    statusFilter,
    dateFilter,
    sortOrder,
  ]);



  const totalPages = Math.ceil(
    filteredAppointments.length / ITEMS_PER_PAGE
  );

  const paginatedAppointments = useMemo(() => {
    const start =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAppointments.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredAppointments, currentPage]);

  /*
   * Reset page when filters change
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter, sortOrder]);

 

  const statistics = useMemo(() => {
    return {
      total: appointments.length,

      completed: appointments.filter(
        (a) => a.status === STATUS.COMPLETED
      ).length,

      waiting: appointments.filter(
        (a) =>
          a.status === STATUS.WAITING ||
          a.status === STATUS.PENDING
      ).length,

      cancelled: appointments.filter(
        (a) => a.status === STATUS.CANCELLED
      ).length,

      consulting: appointments.filter(
        (a) => a.status === STATUS.CONSULTING
      ).length,
    };
  }, [appointments]);



  const resetFilters = () => {
    setSearch("");
    setStatusFilter(STATUS.ALL);
    setDateFilter("ALL");
    setSortOrder("NEWEST");
    setCurrentPage(1);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading appointment history...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">


        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">

                <CalendarDays className="w-6 h-6 text-white" />

              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Appointment History
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Track and review all your patient appointments
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition disabled:opacity-50"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">

            <span className="text-sm font-medium">
              {error}
            </span>

            <button
              onClick={() => setError("")}
              className="p-1 rounded-lg hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}



        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">

          <StatCard
            title="Total"
            value={statistics.total}
            icon={<CalendarDays />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Completed"
            value={statistics.completed}
            icon={<CheckCircle2 />}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Waiting"
            value={statistics.waiting}
            icon={<Clock3 />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Consulting"
            value={statistics.consulting}
            icon={<Users />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Cancelled"
            value={statistics.cancelled}
            icon={<XCircle />}
            iconBg="bg-red-100"
            iconColor="text-red-600"
          />

        </div>

      
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">

          <div className="flex items-center gap-2 mb-4">

            <Filter className="w-5 h-5 text-blue-600" />

            <h2 className="font-bold text-slate-900">
              Search & Filter
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Search */}

            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Patient, token or ID..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="WAITING">
                Waiting
              </option>

              <option value="CONSULTING">
                Consulting
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>

            </select>

            {/* Date */}

            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >

              <option value="ALL">
                All Dates
              </option>

              <option value="TODAY">
                Today
              </option>

              <option value="WEEK">
                Last 7 Days
              </option>

              <option value="MONTH">
                This Month
              </option>

            </select>

            {/* Sort */}

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >

              <option value="NEWEST">
                Newest First
              </option>

              <option value="OLDEST">
                Oldest First
              </option>

            </select>

          </div>

          {/* Reset */}

          {(search ||
            statusFilter !== STATUS.ALL ||
            dateFilter !== "ALL" ||
            sortOrder !== "NEWEST") && (

            <div className="mt-4 flex justify-end">

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >

                <RotateCcw className="w-4 h-4" />

                Reset Filters

              </button>

            </div>

          )}

        </div>

  

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Appointment Records
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showing{" "}
              {filteredAppointments.length === 0
                ? 0
                : (currentPage - 1) *
                    ITEMS_PER_PAGE +
                  1}
              -
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAppointments.length
              )}{" "}
              of {filteredAppointments.length}
            </p>

          </div>

        </div>

      

        <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Appointment
                  </th>

                  <th className="px-6 py-4">
                    Token
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Symptoms
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {paginatedAppointments.map(
                  (appointment) => {

                    const patientName =
                      getPatientName(
                        appointment
                      );

                    const statusStyle =
                      getStatusStyle(
                        appointment.status
                      );

                    return (
                      <tr
                        key={
                          appointment.appointmentId
                        }
                        className="hover:bg-slate-50 transition"
                      >
                        {/* Patient */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              {getInitials(
                                patientName
                              )}
                            </div>

                            <div>

                              <p className="font-bold text-slate-900">
                                {patientName}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                ID #
                                {
                                  appointment
                                    .patient
                                    ?.patientId
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Appointment */}

                        <td className="px-6 py-5">

                          <div>

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">

                              <CalendarDays className="w-4 h-4 text-blue-500" />

                              {formatDate(
                                appointment.appointmentDate
                              )}

                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">

                              <Clock3 className="w-3.5 h-3.5" />

                              {formatTime(
                                appointment.appointmentTime
                              )}

                            </div>

                          </div>

                        </td>

                        {/* Token */}

                        <td className="px-6 py-5">

                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">

                            <Hash className="w-3.5 h-3.5" />

                            {appointment.tokenNo ??
                              "--"}

                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusStyle.wrapper}`}
                          >

                            {statusStyle.icon}

                            {appointment.status ||
                              "UNKNOWN"}

                          </span>

                        </td>

                        {/* Symptoms */}

                        <td className="px-6 py-5 max-w-xs">

                          <p className="text-sm text-slate-600 truncate">

                            {appointment.symptoms ||
                              "No symptoms added"}

                          </p>

                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-right">

                          <button
                            onClick={() =>
                              setSelectedAppointment(
                                appointment
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                          >

                            <Eye className="w-4 h-4" />

                            View

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* MOBILE / TABLET CARD */}

        <div className="lg:hidden grid sm:grid-cols-2 gap-4">

          {paginatedAppointments.map(
            (appointment) => {

              const patientName =
                getPatientName(
                  appointment
                );

              const statusStyle =
                getStatusStyle(
                  appointment.status
                );

              return (
                <div
                  key={
                    appointment.appointmentId
                  }
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >

                  {/* Patient */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                        {getInitials(
                          patientName
                        )}

                      </div>

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {patientName}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          Appointment #
                          {
                            appointment.appointmentId
                          }
                        </p>

                      </div>

                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusStyle.wrapper}`}
                    >

                      {statusStyle.icon}

                      {appointment.status}

                    </span>

                  </div>

                  {/* Information */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <InfoBox
                      icon={<CalendarDays />}
                      label="Date"
                      value={formatDate(
                        appointment.appointmentDate
                      )}
                    />

                    <InfoBox
                      icon={<Clock3 />}
                      label="Time"
                      value={formatTime(
                        appointment.appointmentTime
                      )}
                    />

                    <InfoBox
                      icon={<Hash />}
                      label="Token"
                      value={`#${
                        appointment.tokenNo ??
                        "--"
                      }`}
                    />

                    <InfoBox
                      icon={<FileText />}
                      label="Status"
                      value={
                        appointment.status ||
                        "Unknown"
                      }
                    />

                  </div>

                  {/* Symptoms */}

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Symptoms
                    </p>

                    <p className="text-sm text-slate-700 mt-1 line-clamp-2">

                      {appointment.symptoms ||
                        "No symptoms added"}

                    </p>

                  </div>

                  {/* View */}

                  <button
                    onClick={() =>
                      setSelectedAppointment(
                        appointment
                      )
                    }
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >

                    <Eye className="w-4 h-4" />

                    View Appointment

                  </button>

                </div>
              );
            }
          )}

        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {paginatedAppointments.length === 0 && (

          <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">

              <CalendarDays className="w-8 h-8 text-slate-400" />

            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No appointments found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing your search or filter options.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >

              <RotateCcw className="w-4 h-4" />

              Clear Filters

            </button>

          </div>

        )}

        {/* PAGINATION */}

        {totalPages > 1 && (

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-sm text-slate-500">

              Page{" "}
              <span className="font-semibold text-slate-700">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {totalPages}
              </span>

            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                <ChevronLeft className="w-5 h-5" />

              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .slice(
                  Math.max(
                    0,
                    currentPage - 3
                  ),
                  Math.min(
                    totalPages,
                    currentPage + 2
                  )
                )
                .map((page) => (

                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`w-10 h-10 rounded-xl font-semibold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >

                    {page}

                  </button>

                ))}

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >

                <ChevronRight className="w-5 h-5" />

              </button>

            </div>

          </div>

        )}

      </div>

      {/* DETAILS MODAL */}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() =>
            setSelectedAppointment(null)
          }
          getPatientName={getPatientName}
          getPatientEmail={getPatientEmail}
          getPatientPhone={getPatientPhone}
          getInitials={getInitials}
          formatDate={formatDate}
          formatTime={formatTime}
          getStatusStyle={getStatusStyle}
        />
      )}

    </div>
  );
}


/*
 * ============================================================
 * STAT CARD
 * ============================================================
 */

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">

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


/*
 * ============================================================
 * INFO BOX
 * ============================================================
 */

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">

      <div className="flex items-center gap-1.5 text-xs text-slate-500">

        {React.cloneElement(icon, {
          className: "w-3.5 h-3.5",
        })}

        {label}

      </div>

      <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
        {value}
      </p>

    </div>
  );
}


/*
 * ============================================================
 * APPOINTMENT DETAILS MODAL
 * ============================================================
 */

function AppointmentDetailsModal({
  appointment,
  onClose,
  getPatientName,
  getPatientEmail,
  getPatientPhone,
  getInitials,
  formatDate,
  formatTime,
  getStatusStyle,
}) {
  const patientName =
    getPatientName(appointment);

  const statusStyle =
    getStatusStyle(appointment.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
      onClick={onClose}
    >

      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Header */}

        <div className="p-6 border-b border-slate-200">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-black">

                {getInitials(
                  patientName
                )}

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {patientName}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Appointment #
                  {appointment.appointmentId}
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
            >

              <X className="w-5 h-5 text-slate-600" />

            </button>

          </div>

        </div>

        {/* Body */}

        <div className="p-6">

          {/* Status */}

          <div className="flex items-center justify-between mb-6">

            <span className="text-sm font-semibold text-slate-500">
              Appointment Status
            </span>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${statusStyle.wrapper}`}
            >

              {statusStyle.icon}

              {appointment.status}

            </span>

          </div>

          {/* Appointment Information */}

          <h3 className="font-bold text-slate-900 mb-4">
            Appointment Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">

            <DetailItem
              icon={<CalendarDays />}
              label="Appointment Date"
              value={formatDate(
                appointment.appointmentDate
              )}
            />

            <DetailItem
              icon={<Clock3 />}
              label="Appointment Time"
              value={formatTime(
                appointment.appointmentTime
              )}
            />

            <DetailItem
              icon={<Hash />}
              label="Token Number"
              value={`#${appointment.tokenNo ?? "--"}`}
            />

            <DetailItem
              icon={<FileText />}
              label="Appointment ID"
              value={`#${appointment.appointmentId}`}
            />

          </div>

          {/* Patient Information */}

          <h3 className="font-bold text-slate-900 mt-8 mb-4">
            Patient Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">

            <DetailItem
              icon={<UserRound />}
              label="Patient"
              value={patientName}
            />

            <DetailItem
              icon={<MailIcon />}
              label="Email"
              value={getPatientEmail(
                appointment
              )}
            />

            <DetailItem
              icon={<PhoneIcon />}
              label="Phone"
              value={getPatientPhone(
                appointment
              )}
            />

            <DetailItem
              icon={<Hash />}
              label="Patient ID"
              value={`#${
                appointment.patient
                  ?.patientId ?? "--"
              }`}
            />

          </div>

          {/* Symptoms */}

          <div className="mt-8">

            <h3 className="font-bold text-slate-900 mb-3">
              Symptoms
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

              <p className="text-sm text-slate-700 leading-relaxed">

                {appointment.symptoms ||
                  "No symptoms were recorded for this appointment."}

              </p>

            </div>

          </div>

          {/* Notes */}

          <div className="mt-6">

            <h3 className="font-bold text-slate-900 mb-3">
              Doctor's Notes
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">

                {appointment.notes ||
                  "No doctor's notes have been added."}

              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}




function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">

        {React.cloneElement(icon, {
          className: "w-4 h-4",
        })}

        {label}

      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800 break-words">
        {value}
      </p>

    </div>
  );
}


/*
 * ============================================================
 * ICON HELPERS
 * ============================================================
 */

function MailIcon() {
  return <span />;
}

function PhoneIcon() {
  return <span />;
}

export default AppointmentHistory;

