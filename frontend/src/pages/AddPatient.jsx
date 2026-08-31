import { useState } from "react";
import { createPatient } from "../api/patientApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddPatient() {
  const navigate = useNavigate();
  const [patientSaved,setPatientSaved]=useState(false);
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const savedPatient = await createPatient(patient);
      console.log(savedPatient.data);

    setPatientSaved(true);

    toast.success(
      `Patient Added Successfully!`
    );
    alert(`Please remember your Patient ID: ${savedPatient.patientId}`);

    console.log("Generated Patient ID:", savedPatient.patientId);

    setPatient({
      firstName: "",
      lastName: "",
      gender: "",
      age: "",
      bloodGroup: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
    });

  } catch (error) {
    console.error(error);
    toast.error("Failed to book appointment. Please try again.");
  }
};

  return (
    <div className="max-w-5xl mx-auto bg-gray-100 p-6 rounded-2xl mt-5 ">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Fill Patient Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={patient.firstName}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={patient.lastName}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
          required
        />
<input
  type="number"
  name="age"
  placeholder="Age"
  value={patient.age}
  className="w-full border p-3 rounded shadow hover:bg-white transition"
  onChange={handleChange}
  required
/>

        <select
          name="gender"
          value={patient.gender}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="bloodGroup"
          placeholder="Blood Group"
          value={patient.bloodGroup}
          className="w-full border p-3 rounded shadow hover:bg-gray-300 transition"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={patient.phone}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={patient.email}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={patient.address}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
        />

        <input
          type="text"
          name="emergencyContact"
          placeholder="Emergency Contact"
          value={patient.emergencyContact}
          className="w-full border p-3 rounded shadow hover:bg-white transition"
          onChange={handleChange}
        />

       <button
  type="submit"
  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700
  "
>
Save Details
</button>

<button
  type="button"
  disabled={!patientSaved}
  className={`mx-6 px-3 py-2 rounded text-white ${
    patientSaved
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
  onClick={() => navigate("/book-appointment")}
>
  Choose Doctor & Book Appointment
</button>

      </form>
    </div>
  );
}

export default AddPatient;