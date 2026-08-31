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
    patientName: "",
    doctorName: "",
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
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

      await axios.post(
        "http://localhost:8081/api/prescriptions",
        formData,
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
      console.log(err);
      toast.error("Failed to save prescription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

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

          {/* Patient Doctor */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="font-semibold flex items-center gap-2 mb-2">
                <User size={18} />
                Patient Name
              </label>

              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                placeholder="Enter Patient Name"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

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

              {loading ? "Saving..." : "Save Prescription"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default WritePrescription;