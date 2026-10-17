import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  UserRound,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Eye,
  Download,
  Loader2,
  Search,
  ClipboardCheck,
  Stethoscope,
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

function UploadMedicalCertificate() {
  const fileInputRef = useRef(null);

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [certificateType, setCertificateType] =
    useState("Medical Certificate");

  const [certificateTitle, setCertificateTitle] =
    useState("");

  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [validUntil, setValidUntil] = useState("");

  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /*
   * ============================================================
   * FETCH DOCTOR'S PATIENTS
   * ============================================================
   *
   * Uses the same doctor appointment API used by your
   * Patient Directory and Appointment History pages.
   */

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);

        const response = await api.get("/appointments/doctor");

        const appointments = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        /*
         * Remove duplicate patients
         */

        const patientMap = new Map();

        appointments.forEach((appointment) => {
          const patient = appointment.patient;

          if (!patient) return;

          const patientId =
            patient.patientId ||
            patient.id ||
            patient.user?.id;

          if (!patientId) return;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, patient);
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error("Patient loading error:", error);

        setMessage({
          type: "error",
          text: "Unable to load your patients.",
        });
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  /*
   * ============================================================
   * PATIENT HELPERS
   * ============================================================
   */

  const getPatientName = (patient) => {
    return (
      patient?.user?.username ||
      patient?.username ||
      patient?.name ||
      "Unknown Patient"
    );
  };

  const getPatientEmail = (patient) => {
    return (
      patient?.user?.email ||
      patient?.email ||
      "No email available"
    );
  };

  const getPatientId = (patient) => {
    return (
      patient?.patientId ||
      patient?.id ||
      patient?.user?.id ||
      ""
    );
  };

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };



  const filteredPatients = useMemo(() => {
    const query = searchPatient.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = getPatientName(patient).toLowerCase();

      const email = getPatientEmail(patient).toLowerCase();

      const id = String(getPatientId(patient));

      return (
        name.includes(query) ||
        email.includes(query) ||
        id.includes(query)
      );
    });
  }, [patients, searchPatient]);



  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setMessage({
      type: "",
      text: "",
    });

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must be less than 5 MB.",
      });

      event.target.value = "";
      return;
    }

    /*
     * Allowed file types
     */

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage({
        type: "error",
        text: "Only PDF, JPG and PNG files are allowed.",
      });

      event.target.value = "";
      return;
    }

    setFile(selectedFile);

    /*
     * Image preview
     */

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);

      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  /*
   * ============================================================
   * REMOVE FILE
   * ============================================================
   */

  const removeFile = () => {
    setFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * ============================================================
   * FORMAT FILE SIZE
   * ============================================================
   */

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /*
   * ============================================================
   * SUBMIT CERTIFICATE
   * ============================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    /*
     * Validation
     */

    if (!selectedPatient) {
      setMessage({
        type: "error",
        text: "Please select a patient.",
      });

      return;
    }

    if (!certificateTitle.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a certificate title.",
      });

      return;
    }

    if (!issueDate) {
      setMessage({
        type: "error",
        text: "Please select the issue date.",
      });

      return;
    }

    if (validUntil && validUntil < issueDate) {
      setMessage({
        type: "error",
        text: "Valid until date cannot be before issue date.",
      });

      return;
    }

    if (!file) {
      setMessage({
        type: "error",
        text: "Please upload a medical certificate.",
      });

      return;
    }

    try {
      setUploading(true);

      /*
       * Multipart form data
       */

      const formData = new FormData();

      formData.append(
        "patientId",
        getPatientId(selectedPatient)
      );

      formData.append(
        "certificateType",
        certificateType
      );

      formData.append(
        "title",
        certificateTitle.trim()
      );

      formData.append(
        "issueDate",
        issueDate
      );

      if (validUntil) {
        formData.append(
          "validUntil",
          validUntil
        );
      }

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "file",
        file
      );

      /*
       * Backend endpoint
       */

      await api.post(
        "/medical-certificates/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({
        type: "success",
        text: "Medical certificate uploaded successfully.",
      });

      /*
       * Reset form
       */

      setSelectedPatient(null);
      setSearchPatient("");
      setCertificateTitle("");
      setCertificateType(
        "Medical Certificate"
      );
      setIssueDate(
        new Date().toISOString().split("T")[0]
      );
      setValidUntil("");
      setDescription("");

      removeFile();

    } catch (error) {
      console.error(
        "Certificate upload error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to upload medical certificate.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">

              <FileText className="w-6 h-6 text-white" />

            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Upload Medical Certificate
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Upload and securely share medical certificates
                with your patients
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            ALERT
        ===================================================== */}

        {message.text && (
          <div
            className={`mb-6 flex items-start gap-3 p-4 rounded-2xl border ${
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

            <p className="text-sm font-medium">
              {message.text}
            </p>

            <button
              onClick={() =>
                setMessage({
                  type: "",
                  text: "",
                })
              }
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===================================================
              LEFT - PATIENT SELECTION
          =================================================== */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-5 border-b border-slate-200">

                <div className="flex items-center gap-2">

                  <UserRound className="w-5 h-5 text-blue-600" />

                  <h2 className="font-bold text-slate-900">
                    Select Patient
                  </h2>

                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Choose the patient receiving this certificate
                </p>

              </div>

              <div className="p-5">

                {/* Search */}

                <div className="relative mb-4">

                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={searchPatient}
                    onChange={(e) =>
                      setSearchPatient(
                        e.target.value
                      )
                    }
                    placeholder="Search patient..."
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Patients */}

                {loadingPatients ? (
                  <div className="py-10 text-center">

                    <Loader2 className="w-7 h-7 mx-auto text-blue-600 animate-spin" />

                    <p className="text-sm text-slate-500 mt-3">
                      Loading patients...
                    </p>

                  </div>
                ) : filteredPatients.length === 0 ? (

                  <div className="py-10 text-center">

                    <UsersIcon />

                    <p className="text-sm font-semibold text-slate-700 mt-3">
                      No patients found
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Try another search.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">

                    {filteredPatients.map(
                      (patient) => {

                        const patientId =
                          getPatientId(
                            patient
                          );

                        const name =
                          getPatientName(
                            patient
                          );

                        const isSelected =
                          selectedPatient &&
                          getPatientId(
                            selectedPatient
                          ) === patientId;

                        return (
                          <button
                            type="button"
                            key={patientId}
                            onClick={() =>
                              setSelectedPatient(
                                patient
                              )
                            }
                            className={`w-full text-left p-3 rounded-2xl border transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >

                            <div className="flex items-center gap-3">

                              <div
                                className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-bold ${
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {getInitials(
                                  name
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-slate-900 truncate">
                                  {name}
                                </p>

                                <p className="text-xs text-slate-500 truncate mt-1">
                                  ID #{patientId}
                                </p>

                              </div>

                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto shrink-0" />
                              )}

                            </div>

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ===================================================
              RIGHT - CERTIFICATE FORM
          =================================================== */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >

              {/* Form Header */}

              <div className="p-6 border-b border-slate-200">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

                    <ClipboardCheck className="w-5 h-5 text-blue-600" />

                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Certificate Details
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Enter certificate information
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                {/* Selected Patient */}

                {selectedPatient ? (

                  <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">

                        {getInitials(
                          getPatientName(
                            selectedPatient
                          )
                        )}

                      </div>

                      <div>

                        <p className="text-xs text-blue-600 font-semibold uppercase">
                          Selected Patient
                        </p>

                        <h3 className="font-bold text-slate-900">
                          {getPatientName(
                            selectedPatient
                          )}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {getPatientEmail(
                            selectedPatient
                          )}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPatient(
                            null
                          )
                        }
                        className="ml-auto p-2 rounded-lg hover:bg-blue-100"
                      >

                        <X className="w-4 h-4 text-slate-500" />

                      </button>

                    </div>

                  </div>

                ) : (

                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">

                    <div className="flex items-center gap-3">

                      <AlertCircle className="w-5 h-5 text-amber-600" />

                      <p className="text-sm text-amber-700 font-medium">
                        Please select a patient before uploading.
                      </p>

                    </div>

                  </div>

                )}

                {/* Fields */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Certificate Type */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Certificate Type
                    </label>

                    <select
                      value={certificateType}
                      onChange={(e) =>
                        setCertificateType(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                      <option>
                        Medical Certificate
                      </option>

                      <option>
                        Fitness Certificate
                      </option>

                      <option>
                        Sick Leave Certificate
                      </option>

                      <option>
                        Medical Fitness Certificate
                      </option>

                      <option>
                        Discharge Certificate
                      </option>

                      <option>
                        Other
                      </option>

                    </select>

                  </div>

                  {/* Title */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Certificate Title
                    </label>

                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) =>
                        setCertificateTitle(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Medical Leave Certificate"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                  {/* Issue Date */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Issue Date
                    </label>

                    <div className="relative">

                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) =>
                          setIssueDate(
                            e.target.value
                          )
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>

                  {/* Valid Until */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Valid Until
                      <span className="font-normal text-slate-400">
                        {" "}
                        (Optional)
                      </span>
                    </label>

                    <div className="relative">

                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="date"
                        value={validUntil}
                        min={issueDate}
                        onChange={(e) =>
                          setValidUntil(
                            e.target.value
                          )
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                  </div>

                </div>

                {/* Description */}

                <div className="mt-5">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description / Additional Information
                  </label>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Enter any additional information about this certificate..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />

                </div>

                {/* =================================================
                    FILE UPLOAD
                ================================================= */}

                <div className="mt-6">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Medical Certificate
                  </label>

                  {!file ? (

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition group"
                    >

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-105 transition">

                        <Upload className="w-7 h-7 text-blue-600" />

                      </div>

                      <h3 className="mt-4 font-bold text-slate-800">
                        Upload Certificate
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Click to select PDF, JPG or PNG
                      </p>

                      <p className="text-xs text-slate-400 mt-3">
                        Maximum file size: 5 MB
                      </p>

                    </button>

                  ) : (

                    <div className="border border-blue-200 bg-blue-50 rounded-2xl p-4">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                          <FileText className="w-6 h-6 text-blue-600" />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-slate-800 truncate">
                            {file.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {formatFileSize(
                              file.size
                            )}{" "}
                            •{" "}
                            {file.type ||
                              "Document"}
                          </p>

                        </div>

                        <div className="flex items-center gap-2">

                          {file.type.startsWith(
                            "image/"
                          ) && (

                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  previewUrl,
                                  "_blank"
                                )
                              }
                              className="p-2 rounded-lg bg-white text-blue-600 hover:bg-blue-100"
                              title="Preview"
                            >

                              <Eye className="w-4 h-4" />

                            </button>

                          )}

                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-100"
                            title="Remove"
                          >

                            <Trash2 className="w-4 h-4" />

                          </button>

                        </div>

                      </div>

                      {/* Image Preview */}

                      {previewUrl && (

                        <div className="mt-4 rounded-xl overflow-hidden border border-blue-200 bg-white">

                          <img
                            src={previewUrl}
                            alt="Certificate preview"
                            className="w-full max-h-80 object-contain"
                          />

                        </div>

                      )}

                    </div>

                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </div>

                {/* =================================================
                    SECURITY NOTICE
                ================================================= */}

                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex gap-3">

                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        Secure Medical Document
                      </p>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        This document will be associated with the
                        selected patient's medical records. Only
                        authorized users should have access to
                        medical documents.
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setCertificateTitle("");
                      setDescription("");
                      setValidUntil("");
                      removeFile();

                      setMessage({
                        type: "",
                        text: "",
                      });
                    }}
                    className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload Certificate
                      </>
                    )}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

        {/* =====================================================
            FOOTER INFORMATION
        ===================================================== */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure"
            text="Protected using authenticated access."
          />

          <FeatureCard
            icon={<FileText />}
            title="Digital Records"
            text="Keep certificates organized digitally."
          />

          <FeatureCard
            icon={<Stethoscope />}
            title="Doctor Verified"
            text="Certificates are uploaded by authorized doctors."
          />

        </div>

      </div>

    </div>
  );
}


/*
 * ============================================================
 * FEATURE CARD
 * ============================================================
 */

function FeatureCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

          {React.cloneElement(icon, {
            className: "w-5 h-5",
          })}

        </div>

        <div>

          <p className="font-semibold text-slate-800">
            {title}
          </p>

          <p className="text-xs text-slate-500 mt-0.5">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}


/*
 * ============================================================
 * EMPTY PATIENT ICON
 * ============================================================
 */

function UsersIcon() {
  return (
    <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">

      <UserRound className="w-6 h-6 text-slate-400" />

    </div>
  );
}

export default UploadMedicalCertificate;

