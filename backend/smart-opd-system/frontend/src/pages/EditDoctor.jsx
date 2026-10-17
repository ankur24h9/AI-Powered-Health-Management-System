import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../api/doctorApi";
import { toast } from "react-toastify";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    consultationFee: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const data = await getDoctorById(id);
      setDoctor(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctor");
    }
  };

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(id, doctor);
      toast.success("Doctor Updated Successfully");
      navigate("/doctors");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update doctor");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">
        Edit Doctor #{id}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="firstName"
          value={doctor.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="lastName"
          value={doctor.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="specialization"
          value={doctor.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="qualification"
          value={doctor.qualification}
          onChange={handleChange}
          placeholder="Qualification"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="experienceYears"
          value={doctor.experienceYears}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="consultationFee"
          value={doctor.consultationFee}
          onChange={handleChange}
          placeholder="Consultation Fee"
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="phone"
          value={doctor.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          name="email"
          value={doctor.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Update Doctor
        </button>

      </form>
    </div>
  );
}

export default EditDoctor;