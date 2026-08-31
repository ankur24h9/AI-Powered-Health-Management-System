import { useState } from "react";
import { toast } from "react-toastify";
import { addDoctor } from "../api/doctorApi";

function AddDoctor() {
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

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(doctor);
   try {
       const savedDoctor = await addDoctor(doctor);
   
       toast.success(
         "Doctor Added Successfully!"
       );
   
   
       setDoctor({
    firstName: "",
    lastName:"",
    specialization: "",
    qualification: "",
    experienceYears:"",
    consultationFee:"",
    phone: "",
    email: "",
        
       });
   
     } catch (error) {
       console.error(error);
       toast.error("Failed to add Doctor");
     }
   };

  return (
    <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-xl mt-5">

      <h2 className="text-2xl font-bold mb-6">
        Add Doctor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full border p-3 rounded "
          onChange={handleChange}
          required
        />

         <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full border p-3 rounded "
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

         <input
          type="number"
          name="experienceYears"
          placeholder="Experience"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

          <input
          type="number"
          name="consultationFee"
          placeholder="Consultation_Fee"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />




        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save Doctor
        </button>

        

        

      </form>

    </div>
  );
}

export default AddDoctor;