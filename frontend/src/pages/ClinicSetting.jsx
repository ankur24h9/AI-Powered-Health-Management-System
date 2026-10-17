
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock3,
  IndianRupee,
  Users,
  CalendarDays,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Settings2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const defaultSettings = {
  clinicName: "",
  clinicAddress: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  consultationFee: "",
  appointmentDuration: "15",
  maxPatientsPerDay: "30",

  openingTime: "09:00",
  closingTime: "17:00",

  workingDays: [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ],

  clinicDescription: "",

  onlineAppointments: true,
  walkInAppointments: true,
  emergencyAppointments: false,
  autoTokenGeneration: true,
  clinicAvailable: true,
};

const weekDays = [
  {
    value: "MONDAY",
    label: "Monday",
    short: "Mon",
  },
  {
    value: "TUESDAY",
    label: "Tuesday",
    short: "Tue",
  },
  {
    value: "WEDNESDAY",
    label: "Wednesday",
    short: "Wed",
  },
  {
    value: "THURSDAY",
    label: "Thursday",
    short: "Thu",
  },
  {
    value: "FRIDAY",
    label: "Friday",
    short: "Fri",
  },
  {
    value: "SATURDAY",
    label: "Saturday",
    short: "Sat",
  },
  {
    value: "SUNDAY",
    label: "Sunday",
    short: "Sun",
  },
];

function ClinicSettings() {
  const [settings, setSettings] =
    useState(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /*
   * ============================================================
   * LOAD CLINIC SETTINGS
   * ============================================================
   *
   * Expected backend endpoint:
   *
   * GET /api/doctor/clinic-settings
   *
   */

  useEffect(() => {
    fetchClinicSettings();
  }, []);

  const fetchClinicSettings = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/doctor/clinic-settings"
      );

      if (response.data) {
        setSettings({
          ...defaultSettings,
          ...response.data,
          workingDays:
            response.data.workingDays ||
            defaultSettings.workingDays,
        });
      }
    } catch (error) {
      console.error(
        "Clinic settings loading error:",
        error
      );

      /*
       * If settings do not exist yet,
       * keep default form instead of blocking page.
       */

      if (error.response?.status !== 404) {
        setMessage({
          type: "error",
          text: "Unable to load clinic settings.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * HANDLE INPUT
   * ============================================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * ============================================================
   * TOGGLE SETTINGS
   * ============================================================
   */

  const handleToggle = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  /*
   * ============================================================
   * WORKING DAYS
   * ============================================================
   */

  const toggleWorkingDay = (day) => {
    setSettings((previous) => {
      const exists =
        previous.workingDays.includes(day);

      return {
        ...previous,
        workingDays: exists
          ? previous.workingDays.filter(
              (item) => item !== day
            )
          : [...previous.workingDays, day],
      };
    });
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const validateSettings = () => {
    if (!settings.clinicName.trim()) {
      return "Please enter your clinic name.";
    }

    if (!settings.clinicAddress.trim()) {
      return "Please enter your clinic address.";
    }

    if (!settings.city.trim()) {
      return "Please enter your city.";
    }

    if (!settings.phone.trim()) {
      return "Please enter your clinic phone number.";
    }

    if (
      !settings.consultationFee ||
      Number(settings.consultationFee) < 0
    ) {
      return "Please enter a valid consultation fee.";
    }

    if (
      !settings.maxPatientsPerDay ||
      Number(settings.maxPatientsPerDay) < 1
    ) {
      return "Maximum patients per day must be at least 1.";
    }

    if (
      !settings.appointmentDuration ||
      Number(settings.appointmentDuration) < 5
    ) {
      return "Appointment duration must be at least 5 minutes.";
    }

    if (
      settings.openingTime >=
      settings.closingTime
    ) {
      return "Closing time must be later than opening time.";
    }

    if (settings.workingDays.length === 0) {
      return "Please select at least one working day.";
    }

    return null;
  };

  /*
   * ============================================================
   * SAVE SETTINGS
   * ============================================================
   *
   * Expected backend endpoint:
   *
   * PUT /api/doctor/clinic-settings
   *
   */

  const handleSave = async () => {
    setMessage({
      type: "",
      text: "",
    });

    const validationError =
      validateSettings();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    try {
      setSaving(true);

      await api.put(
        "/doctor/clinic-settings",
        settings
      );

      setMessage({
        type: "success",
        text: "Clinic settings saved successfully.",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Clinic settings save error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to save clinic settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  const handleReset = () => {
    fetchClinicSettings();
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">

            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading clinic settings...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">

                <Settings2 className="w-6 h-6 text-white" />

              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Clinic Settings
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage your clinic according to your preferences
                </p>

              </div>

            </div>

            {/* Clinic Status */}

            <button
              type="button"
              onClick={() =>
                handleToggle(
                  "clinicAvailable"
                )
              }
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold border transition ${
                settings.clinicAvailable
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >

              {settings.clinicAvailable ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}

              {settings.clinicAvailable
                ? "Clinic Open"
                : "Clinic Closed"}

            </button>

          </div>

        </div>

        {/* =====================================================
            MESSAGE
        ===================================================== */}

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >

            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}

            <span className="text-sm font-medium">
              {message.text}
            </span>

          </div>
        )}

        {/* =====================================================
            CLINIC PREVIEW
        ===================================================== */}

        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">

              <Building2 className="w-8 h-8" />

            </div>

            <div className="flex-1">

              <p className="text-blue-100 text-sm font-medium">
                Your Clinic
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {settings.clinicName ||
                  "Your Clinic Name"}
              </h2>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-blue-100">

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {settings.city ||
                    "City not set"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="w-4 h-4" />
                  {settings.openingTime} -{" "}
                  {settings.closingTime}
                </span>

              </div>

            </div>

            <div className="sm:text-right">

              <p className="text-blue-100 text-xs">
                Consultation Fee
              </p>

              <p className="text-2xl font-bold mt-1">
                ₹{settings.consultationFee || "0"}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            BASIC CLINIC INFORMATION
        ===================================================== */}

        <SectionCard
          icon={<Building2 />}
          title="Clinic Information"
          description="Update your clinic's basic information."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              label="Clinic Name"
              name="clinicName"
              value={settings.clinicName}
              onChange={handleChange}
              placeholder="e.g. Ankur Multispeciality Clinic"
              icon={<Building2 />}
              required
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="Clinic contact number"
              icon={<Phone />}
              type="tel"
              required
            />

            <InputField
              label="Email Address"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="clinic@example.com"
              icon={<Mail />}
              type="email"
            />

            <InputField
              label="City"
              name="city"
              value={settings.city}
              onChange={handleChange}
              placeholder="Bhopal"
              icon={<MapPin />}
              required
            />

            <InputField
              label="State"
              name="state"
              value={settings.state}
              onChange={handleChange}
              placeholder="Madhya Pradesh"
              icon={<MapPin />}
            />

            <InputField
              label="PIN Code"
              name="pincode"
              value={settings.pincode}
              onChange={handleChange}
              placeholder="462001"
              icon={<MapPin />}
              type="text"
            />

          </div>

          <div className="mt-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Clinic Address
            </label>

            <textarea
              name="clinicAddress"
              value={settings.clinicAddress}
              onChange={handleChange}
              rows={3}
              placeholder="Enter complete clinic address..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

          <div className="mt-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              About Your Clinic
            </label>

            <textarea
              name="clinicDescription"
              value={settings.clinicDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your clinic, facilities, specialties, etc."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

        </SectionCard>

        {/* =====================================================
            CONSULTATION SETTINGS
        ===================================================== */}

        <SectionCard
          icon={<Stethoscope />}
          title="Consultation Settings"
          description="Control consultation fees and appointment capacity."
        >

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <InputField
              label="Consultation Fee"
              name="consultationFee"
              value={settings.consultationFee}
              onChange={handleChange}
              placeholder="500"
              icon={<IndianRupee />}
              type="number"
              min="0"
              required
            />

            <InputField
              label="Appointment Duration"
              name="appointmentDuration"
              value={settings.appointmentDuration}
              onChange={handleChange}
              icon={<Clock3 />}
              type="number"
              min="5"
              suffix="minutes"
            />

            <InputField
              label="Maximum Patients / Day"
              name="maxPatientsPerDay"
              value={settings.maxPatientsPerDay}
              onChange={handleChange}
              icon={<Users />}
              type="number"
              min="1"
            />

          </div>

        </SectionCard>

        {/* =====================================================
            WORKING HOURS
        ===================================================== */}

        <SectionCard
          icon={<Clock3 />}
          title="Working Hours"
          description="Set the hours during which your clinic accepts appointments."
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InputField
              label="Opening Time"
              name="openingTime"
              value={settings.openingTime}
              onChange={handleChange}
              type="time"
              icon={<Clock3 />}
            />

            <InputField
              label="Closing Time"
              name="closingTime"
              value={settings.closingTime}
              onChange={handleChange}
              type="time"
              icon={<Clock3 />}
            />

          </div>

          {/* Working Days */}

          <div className="mt-6">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Working Days
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">

              {weekDays.map((day) => {

                const selected =
                  settings.workingDays.includes(
                    day.value
                  );

                return (
                  <button
                    type="button"
                    key={day.value}
                    onClick={() =>
                      toggleWorkingDay(
                        day.value
                      )
                    }
                    className={`p-3 rounded-xl border text-center transition ${
                      selected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                    }`}
                  >

                    <p className="text-xs font-medium">
                      {day.short}
                    </p>

                    <p className="text-xs mt-1">
                      {selected
                        ? "Working"
                        : "Off"}
                    </p>

                  </button>
                );

              })}

            </div>

          </div>

        </SectionCard>

        {/* =====================================================
            APPOINTMENT & QUEUE SETTINGS
        ===================================================== */}

        <SectionCard
          icon={<CalendarDays />}
          title="Appointment & Queue Preferences"
          description="Choose how appointments and patient queues should work."
        >

          <div className="space-y-3">

            <ToggleRow
              title="Online Appointments"
              description="Allow patients to book appointments online."
              enabled={
                settings.onlineAppointments
              }
              onClick={() =>
                handleToggle(
                  "onlineAppointments"
                )
              }
            />

            <ToggleRow
              title="Walk-in Appointments"
              description="Allow patients to register directly at the clinic."
              enabled={
                settings.walkInAppointments
              }
              onClick={() =>
                handleToggle(
                  "walkInAppointments"
                )
              }
            />

            <ToggleRow
              title="Emergency Appointments"
              description="Allow emergency cases to be added to the queue."
              enabled={
                settings.emergencyAppointments
              }
              onClick={() =>
                handleToggle(
                  "emergencyAppointments"
                )
              }
            />

            <ToggleRow
              title="Automatic Token Generation"
              description="Automatically generate a token number when an appointment is created."
              enabled={
                settings.autoTokenGeneration
              }
              onClick={() =>
                handleToggle(
                  "autoTokenGeneration"
                )
              }
            />

          </div>

        </SectionCard>

        {/* =====================================================
            CLINIC AVAILABILITY
        ===================================================== */}

        <SectionCard
          icon={<CalendarDays />}
          title="Clinic Availability"
          description="Temporarily close your clinic without deleting your settings."
        >

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">

            <div className="flex items-start gap-4">

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  settings.clinicAvailable
                    ? "bg-emerald-100"
                    : "bg-red-100"
                }`}
              >

                {settings.clinicAvailable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}

              </div>

              <div>

                <h3 className="font-semibold text-slate-800">
                  {settings.clinicAvailable
                    ? "Clinic is currently available"
                    : "Clinic is currently unavailable"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {settings.clinicAvailable
                    ? "Patients can book appointments according to your settings."
                    : "New appointments can be restricted until you reopen the clinic."}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                handleToggle(
                  "clinicAvailable"
                )
              }
              className={`relative w-14 h-8 rounded-full transition ${
                settings.clinicAvailable
                  ? "bg-emerald-500"
                  : "bg-slate-300"
              }`}
            >

              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  settings.clinicAvailable
                    ? "left-7"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </SectionCard>

        {/* =====================================================
            SAVE BAR
        ===================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <p className="font-semibold text-slate-800">
                Ready to save your changes?
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Your clinic preferences will be applied to future appointments.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/*
 * ============================================================
 * SECTION CARD
 * ============================================================
 */

function SectionCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm mb-6 overflow-hidden">

      <div className="p-5 sm:p-6 border-b border-slate-200">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

            {React.cloneElement(icon, {
              className: "w-5 h-5",
            })}

          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </div>
  );
}


/*
 * ============================================================
 * INPUT FIELD
 * ============================================================
 */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  required = false,
  min,
  suffix,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

            {React.cloneElement(icon, {
              className: "w-4 h-4",
            })}

          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          required={required}
          className={`w-full ${
            icon ? "pl-11" : "px-4"
          } ${
            suffix ? "pr-20" : "pr-4"
          } py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}


/*
 * ============================================================
 * TOGGLE ROW
 * ============================================================
 */

function ToggleRow({
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition">

      <div>

        <h3 className="text-sm font-semibold text-slate-800">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative w-12 h-7 rounded-full shrink-0 transition ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

export default ClinicSettings;

