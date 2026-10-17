import { useState } from "react";
import { useParams } from "react-router-dom";

function EditPatient() {
  const { id } = useParams();

  const [patient, setPatient] = useState({
    name: "Ankur Kumar",
    age: 22,
    gender: "Male",
    phone: "9876543210",
    address: "Bhopal",
    bloodGroup: "O+",
  });

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Patient:", patient);

    alert("Patient Updated Successfully");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">
        Edit Patient #{id}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="age"
          value={patient.age}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="gender"
          value={patient.gender}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="phone"
          value={patient.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="address"
          value={patient.address}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="bloodGroup"
          value={patient.bloodGroup}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Update Patient
        </button>

      </form>

    </div>
  );
}

export default EditPatient;