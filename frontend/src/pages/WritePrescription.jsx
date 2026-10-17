import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  User,
  Stethoscope,
  ClipboardList,
  Pill,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";

const WritePrescription = () => {

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    doctorName: "",
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // Patients who have booked appointment with logged-in doctor
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch patients of logged-in doctor
  const fetchDoctorPatients = async () => {

    // Don't call API again if patients are already loaded
    if (patients.length > 0) {
      return;
    }

    try {

      setPatientsLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8081/api/appointments/doctor",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Doctor appointments:", response.data);

      const uniquePatients = [];

      response.data.forEach((appointment) => {

        // Appointment contains patient
        if (appointment.patient) {

          const patient = appointment.patient;

          // Create patient full name
          const fullName = [
            patient.firstName,
            patient.lastName
          ]
            .filter(Boolean)
            .join(" ");

          // Check duplicate patient
          const alreadyExists = uniquePatients.some(
            (p) => p.patientId === patient.patientId
          );

          if (!alreadyExists) {

            uniquePatients.push({
              patientId: patient.patientId,
              name: fullName,
            });

          }
        }

      });

      console.log(
        "Patients of logged-in doctor:",
        uniquePatients
      );

      setPatients(uniquePatients);

    } catch (err) {

      console.log("Error fetching doctor patients:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }

      toast.error("Failed to load patients.");

    } finally {

      setPatientsLoading(false);

    }
  };

  const handleClear = () => {

    setFormData({
      patientId: "",
      patientName: "",
      doctorName: "",
      diagnosis: "",
      medicines: "",
      notes: "",
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // Find selected patient
      const selectedPatient = patients.find(
        (patient) =>
          patient.patientId === Number(formData.patientId)
      );

      if (!selectedPatient) {
        toast.error("Please select a valid patient.");
        setLoading(false);
        return;
      }

      // Data sent to Spring Boot
      const prescriptionData = {
        patient: {
          patientId: selectedPatient.patientId,
        },
        patientName: selectedPatient.name,
        doctorName: formData.doctorName,
        diagnosis: formData.diagnosis,
        medicines: formData.medicines,
        notes: formData.notes,
      };

      console.log(
        "Prescription data being sent:",
        prescriptionData
      );

      await axios.post(
        "http://localhost:8081/api/prescriptions/create_prescription",
        prescriptionData,
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success("Prescription Saved Successfully");

      handleClear();

    } catch (err) {

      console.log("Prescription save error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }

      toast.error("Failed to save prescription.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white p-8">

          <h1 className="text-4xl font-bold">
            Write Prescription
          </h1>

          <p className="opacity-90 mt-2">
            Fill patient diagnosis and medicines.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >

          <div className="grid md:grid-cols-2 gap-6">

            {/* Patient Name */}

            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">
                <User size={18} />
                Patient Name
              </label>

              <select
                name="patientId"
                value={formData.patientId}
                onChange={(e) => {

                  const selectedPatient = patients.find(
                    (patient) =>
                      patient.patientId === Number(e.target.value)
                  );

                  setFormData({
                    ...formData,
                    patientId: e.target.value,
                    patientName: selectedPatient
                      ? selectedPatient.name
                      : "",
                  });

                }}
                onFocus={fetchDoctorPatients}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >

                <option value="">
                  {patientsLoading
                    ? "Loading patients..."
                    : "Select Patient"}
                </option>

                {patients.map((patient) => (

                  <option
                    key={patient.patientId}
                    value={patient.patientId}
                  >
                    {patient.name}
                  </option>

                ))}

              </select>

            </div>


            {/* Doctor Name */}

            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">
                <Stethoscope size={18} />
                Doctor Name
              </label>

              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
                placeholder="Enter Doctor Name"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>


          {/* Diagnosis */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">

              <ClipboardList size={18} />

              Diagnosis

            </label>

            <textarea
              rows={4}
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              placeholder="Patient diagnosis..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>


          {/* Medicines */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">

              <Pill size={18} />

              Medicines

            </label>

            <textarea
              rows={6}
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              required
              placeholder={`Example:

Paracetamol 650mg
1 Tablet Morning
1 Tablet Night
After Food

Pantoprazole 40mg
Before Breakfast`}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>


          {/* Notes */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">

              <FileText size={18} />

              Additional Notes

            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional instructions..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>


          {/* Buttons */}

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold transition"
            >

              <RotateCcw size={18} />

              Clear

            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold transition"
            >

              <Save size={18} />

              {loading
                ? "Saving..."
                : "Save Prescription"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default WritePrescription;