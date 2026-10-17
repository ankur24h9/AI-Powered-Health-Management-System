import React from "react";
import Navbar from "../components/Navbar";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

function MyReport() {
  
  const reports = [
    {
      id: 1,
      title: "Complete Blood Count (CBC)",
      doctor: "Dr. Rajesh Sharma",
      date: "12 July 2026",
      status: "Verified",
    },
    {
      id: 2,
      title: "Chest X-Ray",
      doctor: "Dr. Neha Verma",
      date: "05 July 2026",
      status: "Verified",
    },
    {
      id: 3,
      title: "Blood Sugar Report",
      doctor: "Dr. Amit Patel",
      date: "28 June 2026",
      status: "Pending",
    },
    {
      id: 4,
      title: "ECG Report",
      doctor: "Dr. Anjali Gupta",
      date: "15 June 2026",
      status: "Verified",
    },
  ];
 

  return (
    <>
      <Navbar />

      <div className="flex bg-slate-100 min-h-screen">

        <PatientSidebar />

        <main className="flex-1  p-6">


          <div className="rounded-3xl bg-gradient-to-r from-blue-800 via-indigo-500 to-violet-500 p-8 text-white shadow-xl">

            <h1 className="text-4xl font-bold">
              My Medical Reports
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              View, download and manage all your health reports securely.
            </p>

          </div>

          {/* Search */}

          <div className="bg-white rounded-2xl shadow mt-8 p-5 flex flex-col md:flex-row gap-4 justify-between">

            <div className="relative w-full md:w-96">

              <Search
                className="absolute left-4 top-3 text-gray-400"
                size={20}
              />

             <input
  type="text"
  placeholder="Search reports..."
  className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
/>
            </div>

            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">

              <Filter size={18} />

              Filter

            </button>

          </div>

          {/* Report Cards */}

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
              >

                <div className="flex justify-between">

                  <div className="flex gap-4">

                    <div className="bg-blue-100 p-4 rounded-2xl">

                      <FileText
                        className="text-blue-600"
                        size={30}
                      />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold">
                        {report.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {report.doctor}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-4 py-4 rounded-full text-sm font-semibold ${
                      report.status === "Verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>

                </div>

                <div className="flex items-center gap-2 mt-6 text-gray-500">

                  <Calendar size={18} />

                  {report.date}

                </div>

                <div className="flex gap-4 mt-8">

                  <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition">

                    <Eye size={18} />

                    View

                  </button>

                  <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition">

                    <Download size={18} />

                    Download

                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* Summary */}

          <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
              Reports Summary
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-blue-50 rounded-2xl p-6">

                <p className="text-gray-500">
                  Total Reports
                </p>

                <h2 className="text-4xl font-bold mt-2 text-blue-600">
                  04
                </h2>

              </div>

              <div className="bg-green-50 rounded-2xl p-6">

                <p className="text-gray-500">
                  Verified Reports
                </p>

                <h2 className="text-4xl font-bold mt-2 text-green-600">
                  03
                </h2>

              </div>

              <div className="bg-purple-50 rounded-2xl p-6">

                <p className="text-gray-500">
                  Latest Update
                </p>

                <div className="flex items-center gap-2 mt-3">

                  <CheckCircle2 className="text-purple-600" />

                  <span className="font-semibold">
                    12 July 2026
                  </span>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>
    </>
  );
}

export default MyReport;