import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, deleteDoctor } from "../api/doctorApi";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);

      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.doctorId !== id)
      );
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName || ""} ${doctor.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Doctors Management
            </h1>

            <button
              onClick={() => navigate("/add-doctor")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Add Doctor
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search Doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-lg w-full md:w-96"
            />
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Specialization</th>
                  <th className="p-4 text-left">Experience</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.doctorId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        {doctor.doctorId}
                      </td>

                      <td className="p-4">
                        {doctor.firstName} {doctor.lastName}
                      </td>

                      <td className="p-4">
                        {doctor.specialization}
                      </td>

                      <td className="p-4">
                        {doctor.experienceYears} Years
                      </td>

                      <td className="p-4">
                        {doctor.phone}
                      </td>

                      <td className="p-4">
                        {doctor.email}
                      </td>

                      <td className="p-4 flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={fetchDoctors}>
                          View
                        </button>

                        

                        <button
                          onClick={() =>
                            handleDelete(doctor.doctorId)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6 text-gray-500"
                    >
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Doctors;