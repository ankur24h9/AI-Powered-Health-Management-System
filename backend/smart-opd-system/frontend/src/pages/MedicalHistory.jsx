import React from "react";
import Navbar from "../components/Navbar";
import PatientSidebar from "../components/PatientSidebar";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


import {
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  HeartPulse,
  FileText,
  User,
} from "lucide-react";

function MedicalHistory() {
    const { user, logout } = useContext(AuthContext);
  
  const history = [
    {
      id: 1,
      title: "General Checkup",
      doctor: "Dr. Rajesh Sharma",
      date: "12 July 2026",
      description: "Routine health examination. Patient is healthy.",
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Blood Test",
      doctor: "Dr. Neha Verma",
      date: "05 July 2026",
      description: "CBC and Blood Sugar test completed successfully.",
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Chest X-Ray",
      doctor: "Dr. Amit Patel",
      date: "28 June 2026",
      description: "Normal chest X-Ray. No abnormalities found.",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "ECG",
      doctor: "Dr. Anjali Gupta",
      date: "15 June 2026",
      description: "Heart rhythm normal. No cardiac issues detected.",
      color: "bg-red-500",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="flex bg-slate-100 min-h-screen">
        <PatientSidebar />

        <main className="flex-1 p-6">

          {/* Hero */}
          <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white p-8 shadow-xl">
            <h1 className="text-4xl font-bold">
              Medical History
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              View your complete healthcare history, treatments and reports.
            </p>
          </div>

          {/* Summary Cards */}

          <div className="grid md:grid-cols-4 gap-6 mt-8">

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <HeartPulse className="text-red-500 mb-4" size={35} />
              <p className="text-gray-500">Hospital Visits</p>
              <h2 className="text-4xl font-bold mt-2">12</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <Stethoscope className="text-blue-500 mb-4" size={35} />
              <p className="text-gray-500">Doctors Consulted</p>
              <h2 className="text-4xl font-bold mt-2">5</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <Pill className="text-green-500 mb-4" size={35} />
              <p className="text-gray-500">Prescriptions</p>
              <h2 className="text-4xl font-bold mt-2">18</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <FileText className="text-purple-500 mb-4" size={35} />
              <p className="text-gray-500">Medical Reports</p>
              <h2 className="text-4xl font-bold mt-2">9</h2>
            </div>

          </div>

          {/* Patient Info */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold mb-6">
              Patient Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex items-center gap-4">
                <User className="text-blue-600" />
                <div>
                  <p className="text-gray-500">Patient Name</p>
                  <h3 className="font-semibold text-lg">
                    {user?.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Calendar className="text-blue-600" />
                <div>
                  <p className="text-gray-500">Last Visit</p>
                  <h3 className="font-semibold text-lg">
                    12 July 2026
                  </h3>
                </div>
              </div>

            </div>

          </div>

          {/* Timeline */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

            <h2 className="text-2xl font-bold mb-8">
              Medical Timeline
            </h2>

            <div className="relative border-l-4 border-blue-500 ml-4">

              {history.map((item) => (

                <div
                  key={item.id}
                  className="mb-10 ml-8 relative"
                >

                  <span
                    className={`absolute -left-11 top-1 w-6 h-6 rounded-full ${item.color}`}
                  ></span>

                  <div className="bg-slate-50 rounded-2xl p-6 shadow hover:shadow-xl transition">

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-blue-600 mt-1">
                      {item.doctor}
                    </p>

                    <p className="text-gray-500 mt-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <Calendar size={16} />
                      {item.date}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Health Status */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white p-8 mt-8 shadow-xl">

            <div className="flex items-center gap-4">

              <Activity size={45} />

              <div>

                <h2 className="text-3xl font-bold">
                  Current Health Status
                </h2>

                <p className="text-blue-100 mt-2">
                  All vital signs are stable. Continue following the prescribed medication and attend your next scheduled appointment.
                </p>

              </div>

            </div>

          </div>

        </main>
      </div>
    </>
  );
}

export default MedicalHistory;