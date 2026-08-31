import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {getAllPatients,deletePatient,} from "../api/patientApi";

function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();

      console.log("Patients Data:", data);

      setPatients(data);
    } catch (error) {
      console.error(
        "Error fetching patients:",
        error
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      await deletePatient(id);

      loadPatients();
    } catch (error) {
      console.error(
        "Error deleting patient:",
        error
      );
    }
  };

const filteredPatients = patients.filter(
  (patient) =>
    `${patient.firstName} ${patient.lastName}`
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
              Patients Management
            </h1>

           

          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search Patient..."
              value={search}
              onChange={(e) =>
              setSearch(e.target.value)
              }
              className="border p-3 rounded-lg w-full md:w-96"
            />
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>
                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Age
                  </th>

                  <th className="p-4 text-left">
                    Gender
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Address
                  </th>

                  <th className="p-4 text-left">
                    Blood Group
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>
  {filteredPatients.length > 0 ? (
    filteredPatients.map((patient) => (
      <tr
        key={patient.patientId}
        className="border-b hover:bg-gray-50"
      >
        <td className="p-4">
          {patient.patientId}
        </td>

        <td className="p-4">
          {patient.firstName} {patient.lastName}
        </td>

        <td className="p-4">
          {patient.age}
        </td>

        <td className="p-4">
          {patient.gender}
        </td>

        <td className="p-4">
          {patient.phone}
        </td>

        <td className="p-4">
          {patient.address}
        </td>

        <td className="p-4">
          {patient.bloodGroup}
        </td>

        <td className="p-4 flex gap-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={()=>loadPatients(patient.patientId)}
          >
            View
          </button>

          <button
            onClick={() =>
              navigate(
                `/edit-patient/${patient.patientId}`
              )
            }
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() =>
              handleDelete(patient.patientId)
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
        colSpan="8"
        className="text-center p-6 text-gray-500"
      >
        No Patients Found
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

export default Patients;