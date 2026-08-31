
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock,
  UserRound,
  Stethoscope,
  FileText,
  ClipboardList,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  MapPin,
} from "lucide-react";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const res = await api.get("/doctors");

      setDoctors(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load doctors.");
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const appointmentHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const appointmentData = {
        patient: {
          patientId: Number(form.patientId),
        },

        doctor: {
          doctorId: Number(form.doctorId),
        },

        appointmentDate: form.appointmentDate,

        appointmentTime: form.appointmentTime,

        status: "PENDING",

        symptoms: form.symptoms,

        notes: form.notes,
      };

      const res = await api.post(
        "/appointments",
        appointmentData
      );

      const selectedDoctor = doctors.find(
        (d) => d.doctorId === Number(form.doctorId)
      );

      navigate("/appointment-success", {
        state: {
          tokenId: res.data.appointmentId,

          doctorName:
            selectedDoctor?.firstName +
            " " +
            selectedDoctor?.lastName,

          appointmentDate: form.appointmentDate,

          appointmentTime: form.appointmentTime,
        },
      });

      setForm({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        symptoms: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />

            <span className="text-sm font-medium">
              Back
            </span>
          </button>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* =====================================================
            HERO
        ====================================================== */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl mb-8">

          {/* Decorative circles */}

          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />

          <div className="absolute right-40 -bottom-24 w-48 h-48 rounded-full bg-white/10" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm mb-4">

                  <CalendarDays size={16} />

                  Healthcare Appointment

                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">

                  Book an Appointment

                </h1>

                <p className="mt-3 text-blue-100 max-w-xl leading-relaxed">

                  Schedule a consultation with one of our doctors.
                  Choose your preferred doctor, date and time to
                  get started.

                </p>

              </div>

              <div className="hidden sm:flex w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md items-center justify-center">

                <Stethoscope size={48} />

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* =================================================
              BOOKING FORM
          ================================================== */}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Form Header */}

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">

                  <ClipboardList size={22} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-800">

                    Appointment Details

                  </h2>

                  <p className="text-sm text-slate-500 mt-1">

                    Fill in the details below to book your appointment.

                  </p>

                </div>

              </div>

            </div>

            {/* Form */}

            <form
              onSubmit={appointmentHandler}
              className="p-6 space-y-6"
            >

              {/* =================================================
                  PATIENT INFORMATION
              ================================================== */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <UserRound
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-800">

                    Patient Information

                  </h3>

                </div>

                <label className="text-sm font-semibold text-slate-700">

                  Patient ID

                </label>

                <div className="relative mt-2">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    placeholder="Enter your patient ID"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />

                </div>

              </div>

              {/* =================================================
                  DOCTOR
              ================================================== */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <Stethoscope
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-800">

                    Choose Doctor

                  </h3>

                </div>

                <label className="text-sm font-semibold text-slate-700">

                  Select Doctor

                </label>

                <div className="relative mt-2">

                  <Stethoscope
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    required
                    disabled={doctorsLoading}
                    className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none disabled:opacity-60"
                  >

                    <option value="">

                      {doctorsLoading
                        ? "Loading doctors..."
                        : "Select a doctor"}

                    </option>

                    {doctors.map((doctor) => (

                      <option
                        key={doctor.doctorId}
                        value={doctor.doctorId}
                      >

                        Dr. {doctor.firstName}{" "}
                        {doctor.lastName}
                        {" - "}
                        {doctor.specialization}

                      </option>

                    ))}

                  </select>

                </div>

                {/* Selected Doctor Preview */}

                {form.doctorId && (

                  <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">

                    {(() => {

                      const doctor = doctors.find(
                        (d) =>
                          d.doctorId === Number(form.doctorId)
                      );

                      if (!doctor) return null;

                      return (

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">

                            {doctor.firstName?.charAt(0)}
                            {doctor.lastName?.charAt(0)}

                          </div>

                          <div>

                            <p className="font-bold text-blue-900">

                              Dr. {doctor.firstName}{" "}
                              {doctor.lastName}

                            </p>

                            <p className="text-sm text-blue-700">

                              {doctor.specialization}

                            </p>

                          </div>

                          <CheckCircle2
                            size={20}
                            className="ml-auto text-blue-600"
                          />

                        </div>

                      );

                    })()}

                  </div>

                )}

              </div>

              {/* =================================================
                  DATE + TIME
              ================================================== */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-800">

                    Date & Time

                  </h3>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                  {/* Date */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">

                      Appointment Date

                    </label>

                    <div className="relative mt-2">

                      <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="date"
                        name="appointmentDate"
                        value={form.appointmentDate}
                        onChange={handleChange}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />

                    </div>

                  </div>

                  {/* Time */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">

                      Appointment Time

                    </label>

                    <div className="relative mt-2">

                      <Clock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="time"
                        name="appointmentTime"
                        value={form.appointmentTime}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  MEDICAL INFORMATION
              ================================================== */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <FileText
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-800">

                    Medical Information

                  </h3>

                </div>

                <div className="space-y-4">

                  {/* Symptoms */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">

                      Symptoms

                    </label>

                    <textarea
                      name="symptoms"
                      value={form.symptoms}
                      onChange={handleChange}
                      placeholder="Describe your symptoms..."
                      required
                      rows="3"
                      className="w-full mt-2 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />

                  </div>

                  {/* Notes */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">

                      Additional Notes

                      <span className="text-slate-400 font-normal ml-1">

                        (Optional)

                      </span>

                    </label>

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Anything else the doctor should know?"
                      rows="3"
                      className="w-full mt-2 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-200"
              >

                {loading ? (

                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Booking Appointment...

                  </>

                ) : (

                  <>
                    <CalendarDays size={20} />

                    Book Appointment

                  </>

                )}

              </button>

            </form>

          </div>

          {/* =================================================
              RIGHT INFORMATION PANEL
          ================================================== */}

          <div className="space-y-5">

            {/* Booking Summary */}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

              <h3 className="font-bold text-slate-800 text-lg">

                Booking Summary

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                Review your appointment details.

              </p>

              <div className="mt-5 space-y-4">

                <div className="flex gap-3">

                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 h-fit">

                    <Stethoscope size={18} />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">

                      Doctor

                    </p>

                    <p className="font-semibold text-slate-700">

                      {form.doctorId
                        ? (() => {

                            const doctor = doctors.find(
                              (d) =>
                                d.doctorId ===
                                Number(form.doctorId)
                            );

                            return doctor
                              ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                              : "Not selected";

                          })()
                        : "Not selected"}

                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 h-fit">

                    <CalendarDays size={18} />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">

                      Date

                    </p>

                    <p className="font-semibold text-slate-700">

                      {form.appointmentDate || "Not selected"}

                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 h-fit">

                    <Clock size={18} />

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">

                      Time

                    </p>

                    <p className="font-semibold text-slate-700">

                      {form.appointmentTime || "Not selected"}

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Why Book With Us */}

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white">

              <div className="p-3 rounded-xl bg-white/10 w-fit">

                <ShieldCheck size={22} />

              </div>

              <h3 className="text-lg font-bold mt-4">

                Safe & Secure Booking

              </h3>

              <p className="text-sm text-slate-300 mt-2 leading-relaxed">

                Your appointment information is securely
                processed and shared only with authorized
                healthcare professionals.

              </p>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-2 text-sm text-slate-300">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  Verified healthcare professionals

                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  Secure patient information

                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">

                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  Easy appointment management

                </div>

              </div>

            </div>

            {/* Location */}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

              <div className="flex gap-3">

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 h-fit">

                  <MapPin size={20} />

                </div>

                <div>

                  <h3 className="font-bold text-slate-800">

                    Smart OPD

                  </h3>

                  <p className="text-sm text-slate-500 mt-1">

                    Digital healthcare appointment system

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default BookAppointment;

