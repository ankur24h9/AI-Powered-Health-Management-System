
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PatientSidebar from "../components/PatientSidebar";
import {
  Search,
  FileText,
  CalendarDays,
  UserRound,
  Stethoscope,
  Pill,
  Clock,
  ChevronRight,
  Printer,
  Download,
  Activity,
  CheckCircle2,
} from "lucide-react";

function Prescriptions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const prescriptions = [
    {
      id: 1,
      patient: "Ankur Kumar",
      doctor: "Dr. Sharma",
      diagnosis: "Fever",
      medicine: "Paracetamol",
      dosage: "500 mg",
      frequency: "Twice a day",
      duration: "5 Days",
      date: "22 Aug 2026",
      status: "Active",
      instructions: "Take after meals with plenty of water.",
    },
    {
      id: 2,
      patient: "Rahul Singh",
      doctor: "Dr. Gupta",
      diagnosis: "Migraine",
      medicine: "Sumatriptan",
      dosage: "50 mg",
      frequency: "Once a day",
      duration: "3 Days",
      date: "20 Aug 2026",
      status: "Completed",
      instructions: "Take at the onset of migraine symptoms.",
    },
  ];

  const filteredPrescriptions = prescriptions.filter(
    (item) =>
      item.patient.toLowerCase().includes(search.toLowerCase()) ||
      item.doctor.toLowerCase().includes(search.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      item.medicine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-50">
        <PatientSidebar />

        <main className="flex-1 w-full overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 sm:p-8 mb-8 text-white shadow-xl">

              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute right-20 bottom-[-50px] w-32 h-32 rounded-full bg-white/10" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm">
                      <FileText size={28} />
                    </div>

                    <span className="text-blue-100 font-medium">
                      Medical Records
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    My Prescriptions
                  </h1>

                  <p className="mt-2 text-blue-100 max-w-xl">
                    View your prescriptions, medicines, dosage instructions,
                    and treatment information in one place.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
                >
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">
                      Total Prescriptions
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      {prescriptions.length}
                    </h2>
                  </div>

                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText size={22} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">
                      Active
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      {
                        prescriptions.filter(
                          (item) => item.status === "Active"
                        ).length
                      }
                    </h2>
                  </div>

                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Activity size={22} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">
                      Medicines
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      {prescriptions.length}
                    </h2>
                  </div>

                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Pill size={22} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">
                      Last Visit
                    </p>
                    <h2 className="text-lg font-bold text-slate-800 mt-3">
                      22 Aug 2026
                    </h2>
                  </div>

                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <CalendarDays size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-sm">

              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by doctor, diagnosis or medicine..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Section Heading */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Recent Prescriptions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your latest medical prescriptions
                </p>
              </div>

              <span className="hidden sm:block text-sm text-slate-500">
                {filteredPrescriptions.length} records
              </span>
            </div>

            {/* Prescription Cards */}
            <div className="space-y-5">

              {filteredPrescriptions.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >

                  {/* Top section */}
                  <div className="p-5 sm:p-6">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      <div className="flex gap-4">

                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                          <Stethoscope size={26} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-800">
                              {item.doctor}
                            </h3>

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.status === "Active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {item.status === "Active" && (
                                <CheckCircle2
                                  size={13}
                                  className="inline mr-1"
                                />
                              )}

                              {item.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                            <UserRound size={15} />
                            {item.patient}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={17} />
                        {item.date}
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        Diagnosis
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <Activity
                          size={18}
                          className="text-blue-600"
                        />

                        <p className="font-semibold text-slate-800">
                          {item.diagnosis}
                        </p>
                      </div>
                    </div>

                    {/* Medicine */}
                    <div className="mt-5">

                      <div className="flex items-center gap-2 mb-3">
                        <Pill size={19} className="text-indigo-600" />

                        <h4 className="font-bold text-slate-800">
                          Prescribed Medicine
                        </h4>
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div>
                            <h5 className="text-lg font-bold text-blue-900">
                              {item.medicine}
                            </h5>

                            <p className="text-sm text-blue-700 mt-1">
                              {item.dosage}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:flex gap-4 text-sm">

                            <div>
                              <p className="text-xs text-slate-400">
                                Frequency
                              </p>

                              <p className="font-semibold text-slate-700 mt-1">
                                {item.frequency}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Duration
                              </p>

                              <p className="font-semibold text-slate-700 mt-1">
                                {item.duration}
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-5 flex gap-3">

                      <div className="flex-shrink-0 mt-1">
                        <Clock size={18} className="text-orange-500" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Doctor's Instructions
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {item.instructions}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <p className="text-xs text-slate-400">
                      Prescription ID: RX-{String(item.id).padStart(4, "0")}
                    </p>

                    <div className="flex gap-2">

                      <button
                        onClick={() => window.print()}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition"
                      >
                        <Printer size={16} />
                        Print
                      </button>

                      <button
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
                      >
                        <Download size={16} />
                        Download
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/prescriptions/${item.id}`)
                        }
                        className="flex items-center justify-center p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        title="View prescription"
                      >
                        <ChevronRight size={18} />
                      </button>

                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {filteredPrescriptions.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <FileText size={28} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-800">
                    No prescriptions found
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Try searching with another doctor, diagnosis, or medicine.
                  </p>

                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

export default Prescriptions;

