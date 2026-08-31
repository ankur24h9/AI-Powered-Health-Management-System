
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Users,
  UserRound,
  CalendarDays,
  Mail,
  Phone,
  Clock3,
  RefreshCw,
  Loader2,
  Eye,
  X,
  ChevronRight,
  Activity,
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

function PatientsDirectory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState("");

 
  const fetchPatients = useCallback(async (refresh = false) => {
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
      console.error("Unable to fetch patients:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError("Your session has expired. Please login again.");
      } else {
        setError("Unable to load patient directory.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);


  const patients = useMemo(() => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      const patient = appointment.patient;

      if (!patient) return;

      const patientId =
        patient.patientId ||
        patient.id ||
        patient.user?.id;

      if (!patientId) return;

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          id: patientId,
          patient,
          appointments: [],
        });
      }

      patientMap
        .get(patientId)
        .appointments.push(appointment);
    });

    return Array.from(patientMap.values());
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter(({ patient }) => {
      const name =
        patient.user?.username ||
        patient.username ||
        patient.name ||
        "";

      const email =
        patient.user?.email ||
        patient.email ||
        "";

      const phone =
        patient.phone ||
        patient.mobile ||
        patient.contactNumber ||
        "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

 
  const getPatientName = (patient) => {
    const firstName =
      patient?.firstName || patient?.user?.firstName || "Unknown";
    const lastName =
      patient?.lastName || patient?.user?.lastName || "Unknown";

    return `${firstName} ${lastName}`.trim() || "Unknown";
  };


  const getPatientEmail = (patient) => {
    return (
      patient?.user?.email ||
      patient?.email ||
      "No email available"
    );
  };

  const getPatientPhone = (patient) => {
    return (
      patient?.phone ||
      patient?.mobile ||
      patient?.contactNumber ||
      "Not available"
    );
  };

  
  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

 
  const getLatestAppointment = (patientAppointments) => {
    if (!patientAppointments?.length) {
      return null;
    }

    return [...patientAppointments].sort((a, b) => {
      const dateA = `${a.appointmentDate || ""} ${
        a.appointmentTime || ""
      }`;

      const dateB = `${b.appointmentDate || ""} ${
        b.appointmentTime || ""
      }`;

      return dateB.localeCompare(dateA);
    })[0];
  };

 
  const stats = useMemo(() => {
    const totalAppointments = appointments.length;

    const completedAppointments = appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;

    const waitingAppointments = appointments.filter(
      (appointment) =>
        appointment.status === "WAITING" ||
        appointment.status === "PENDING"
    ).length;

    return {
      totalPatients: patients.length,
      totalAppointments,
      completedAppointments,
      waitingAppointments,
    };
  }, [patients, appointments]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />

          <p className="mt-4 text-slate-600 font-medium">
            Loading patient directory...
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
                <Users className="w-6 h-6 text-white" />
              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  My Patient Directory
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage your patients
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={() => fetchPatients(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition disabled:opacity-50"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            {refreshing ? "Refreshing..." : "Refresh"}

          </button>

        </div>

   

        {error && (
          <div className="mb-6 flex items-center justify-between bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">

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

    

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          <StatCard
            title="My Patients"
            value={stats.totalPatients}
            icon={<Users />}
            iconClass="text-blue-600"
            iconBg="bg-blue-100"
          />

          <StatCard
            title="Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDays />}
            iconClass="text-purple-600"
            iconBg="bg-purple-100"
          />

          <StatCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<Activity />}
            iconClass="text-emerald-600"
            iconBg="bg-emerald-100"
          />

          <StatCard
            title="Waiting"
            value={stats.waitingAppointments}
            icon={<Clock3 />}
            iconClass="text-amber-600"
            iconBg="bg-amber-100"
          />

        </div>

       

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, email or phone..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

          </div>

        </div>


        <div className="flex items-center justify-between mb-4">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Patients
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredPatients.length} of{" "}
              {patients.length} patients
            </p>

          </div>

        </div>

     

        <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                <th className="px-6 py-4">
                  Patient
                </th>

                <th className="px-6 py-4">
                  Contact
                </th>

                <th className="px-6 py-4">
                  Appointments
                </th>

                <th className="px-6 py-4">
                  Last Visit
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredPatients.map(
                ({ id, patient, appointments }) => {

                  const name = getPatientName(patient);

                  const latestAppointment =
                    getLatestAppointment(appointments);

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50 transition"
                    >


                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {getInitials(name)}
                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              {name}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Patient ID: #{id}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-6 py-5">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5" />
                            {getPatientEmail(patient)}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5" />
                            {getPatientPhone(patient)}
                          </div>

                        </div>

                      </td>


                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">

                          <CalendarDays className="w-3.5 h-3.5" />

                          {appointments.length}

                        </span>

                      </td>


                      <td className="px-6 py-5">

                        {latestAppointment ? (
                          <div>

                            <p className="text-sm font-semibold text-slate-700">
                              {latestAppointment.appointmentDate ||
                                "N/A"}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Token #
                              {latestAppointment.tokenNo ??
                                "--"}
                            </p>

                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No visits
                          </span>
                        )}

                      </td>


                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            setSelectedPatient({
                              id,
                              patient,
                              appointments,
                            })
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

       

        <div className="lg:hidden grid sm:grid-cols-2 gap-4">

          {filteredPatients.map(
            ({ id, patient, appointments }) => {

              const name = getPatientName(patient);

              const latestAppointment =
                getLatestAppointment(appointments);

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                >

                  {/* Top */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {getInitials(name)}
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          Patient #{id}
                        </p>

                      </div>

                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {appointments.length} visit
                      {appointments.length !== 1
                        ? "s"
                        : ""}
                    </span>

                  </div>

            

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-slate-600">

                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>

                      <span className="truncate">
                        {getPatientEmail(patient)}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">

                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </div>

                      <span>
                        {getPatientPhone(patient)}
                      </span>

                    </div>

                    {latestAppointment && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">

                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <CalendarDays className="w-4 h-4 text-slate-500" />
                        </div>

                        <span>
                          Last visit:{" "}
                          {latestAppointment.appointmentDate ||
                            "N/A"}
                        </span>

                      </div>
                    )}

                  </div>



                  <button
                    onClick={() =>
                      setSelectedPatient({
                        id,
                        patient,
                        appointments,
                      })
                    }
                    className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >

                    View Patient

                    <ChevronRight className="w-4 h-4" />

                  </button>

                </div>
              );
            }
          )}

        </div>

        {filteredPatients.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">

              <UserRound className="w-8 h-8 text-slate-400" />

            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No patients found
            </h3>

            <p className="text-slate-500 mt-2">
              {search
                ? "Try searching with a different name, email or phone number."
                : "You don't have any patients yet."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 text-blue-600 font-semibold hover:underline"
              >
                Clear Search
              </button>
            )}

          </div>
        )}

      </div>


      {selectedPatient && (
        <PatientDetailsModal
          data={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          getPatientName={getPatientName}
          getPatientEmail={getPatientEmail}
          getPatientPhone={getPatientPhone}
          getInitials={getInitials}
        />
      )}

    </div>
  );
}




function StatCard({
  title,
  value,
  icon,
  iconClass,
  iconBg,
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
          className={`w-11 h-11 rounded-xl ${iconBg} ${iconClass} flex items-center justify-center`}
        >
          {React.cloneElement(icon, {
            className: "w-5 h-5",
          })}
        </div>

      </div>

    </div>
  );
}



function PatientDetailsModal({
  data,
  onClose,
  getPatientName,
  getPatientEmail,
  getPatientPhone,
  getInitials,
}) {
  const { id, patient, appointments } = data;

  const name = getPatientName(patient);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
      onClick={onClose}
    >

      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

  

        <div className="p-6 border-b border-slate-200">

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-black">
                {getInitials(name)}
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Patient ID: #{id}
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

          </div>

        </div>

 

        <div className="p-6">

          <h3 className="font-bold text-slate-900 mb-4">
            Patient Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">

            <InfoItem
              icon={<Mail />}
              label="Email"
              value={getPatientEmail(patient)}
            />

            <InfoItem
              icon={<Phone />}
              label="Phone"
              value={getPatientPhone(patient)}
            />

            <InfoItem
              icon={<UserRound />}
              label="Patient ID"
              value={`#${id}`}
            />

            <InfoItem
              icon={<CalendarDays />}
              label="Total Visits"
              value={appointments.length}
            />

          </div>

  

          <div className="mt-8">

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold text-slate-900">
                Appointment History
              </h3>

              <span className="text-xs font-semibold text-slate-500">
                {appointments.length} record
                {appointments.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="space-y-3">

              {[...appointments]
                .sort((a, b) => {
                  const aValue = `${a.appointmentDate || ""} ${
                    a.appointmentTime || ""
                  }`;

                  const bValue = `${b.appointmentDate || ""} ${
                    b.appointmentTime || ""
                  }`;

                  return bValue.localeCompare(aValue);
                })
                .map((appointment) => (

                  <div
                    key={appointment.appointmentId}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <CalendarDays className="w-4 h-4 text-blue-600" />

                          <span className="font-semibold text-slate-800">
                            {appointment.appointmentDate ||
                              "Date unavailable"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                          <Clock3 className="w-4 h-4" />

                          {appointment.appointmentTime
                            ? appointment.appointmentTime.substring(
                                0,
                                5
                              )
                            : "--"}

                          <span>
                            • Token #
                            {appointment.tokenNo ?? "--"}
                          </span>

                        </div>

                      </div>

                      <StatusBadge
                        status={appointment.status}
                      />

                    </div>

                    {appointment.symptoms && (
                      <div className="mt-3 pt-3 border-t border-slate-200">

                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Symptoms
                        </p>

                        <p className="text-sm text-slate-700 mt-1">
                          {appointment.symptoms}
                        </p>

                      </div>
                    )}

                  </div>

                ))}

            </div>

          </div>

        </div>



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




function InfoItem({ icon, label, value }) {
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


function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-700",
    WAITING: "bg-amber-100 text-amber-700",
    CONSULTING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

export default PatientsDirectory;

