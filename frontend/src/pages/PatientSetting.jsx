
import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PatientSidebar from "../components/PatientSidebar";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

import {
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Camera,
  Save,
  ChevronRight,
  CheckCircle2,
  Smartphone,
  LogOut,
} from "lucide-react";

const PatientSetting = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile picture state
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const [notifications, setNotifications] = useState({
    appointment: true,
    prescription: true,
    reminder: true,
    email: false,
  });

  const [profile, setProfile] = useState({
    name: "Ankur Kumar",
    email: "ankur@example.com",
    phone: "+91 98765 43210",
    dob: "15 June 2003",
    gender: "Male",
    address: "Bhopal, Madhya Pradesh",
  });

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      description: "Password and account security",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage notification preferences",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
      description: "Control your privacy settings",
    },
  ];

  // Handle profile input changes
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Open file picker
  const updateProfilePicture = () => {
    fileInputRef.current?.click();
  };

  // Handle selected profile picture
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be less than 5 MB.");
      return;
    }

    // Create image preview
    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);

    toast.success("Profile picture updated successfully!");
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-50">


        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 w-full overflow-hidden">

          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

            {/* ================= PAGE HEADER ================= */}
            <div className="mb-8">

              <div className="flex items-center gap-3 mb-2">

                <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                  <User size={24} />
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    Account Settings
                  </h1>

                  <p className="text-slate-500 mt-1">
                    Manage your profile, security and preferences
                  </p>
                </div>

              </div>

            </div>

            {/* ================= PROFILE HEADER ================= */}
            <div className="relative overflow-hidden bg-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">

              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full" />

              <div className="absolute right-32 -bottom-16 w-36 h-36 bg-white/10 rounded-full" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">

                {/* ================= PROFILE PICTURE ================= */}
                <div className="relative">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-3xl object-cover border-2 border-white/40 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-bold">
                      AK
                    </div>
                  )}

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={updateProfilePicture}
                    className="absolute -right-2 -bottom-2 p-2 rounded-xl bg-white text-blue-600 shadow-lg hover:bg-blue-50 transition"
                    title="Change profile picture"
                  >
                    <Camera size={17} />
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />

                </div>

                {/* ================= USER INFORMATION ================= */}
                <div className="text-center sm:text-left">

                  <h2 className="text-2xl font-bold">
                    {profile.name}
                  </h2>

                  <p className="text-blue-100 mt-1">
                    Patient ID: PT-0001
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">

                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-sm">
                      <CheckCircle2 size={15} />
                      Verified Account
                    </span>

                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-sm">
                      <Shield size={15} />
                      Secure
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= SETTINGS LAYOUT ================= */}
            <div className="grid lg:grid-cols-[280px_1fr] gap-6">

              {/* ================= SETTINGS SIDEBAR ================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 h-fit">

                <div className="px-4 py-3 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Settings
                  </p>
                </div>

                {tabs.map((tab) => {

                  const Icon = tab.icon;
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition mb-1 ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >

                      <div
                        className={`p-2 rounded-xl ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-semibold text-sm">
                          {tab.label}
                        </p>

                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {tab.description}
                        </p>

                      </div>

                      <ChevronRight
                        size={16}
                        className={
                          active
                            ? "text-blue-500"
                            : "text-slate-300"
                        }
                      />

                    </button>
                  );
                })}

                {/* ================= LOGOUT ================= */}
                <div className="border-t border-slate-100 mt-3 pt-3">

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left text-red-500 hover:bg-red-50 transition"
                  >

                    <div className="p-2 rounded-xl bg-red-50">
                      <LogOut size={18} />
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-sm">
                        Sign Out
                      </p>

                      <p className="text-xs text-red-300 mt-0.5">
                        Logout from your account
                      </p>

                    </div>

                  </button>

                </div>

              </div>

              {/* ================= SETTINGS CONTENT ================= */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                {/* ================================================== */}
                {/* PROFILE */}
                {/* ================================================== */}

                {activeTab === "profile" && (
                  <div>

                    <div className="p-6 border-b border-slate-100">

                      <h2 className="text-xl font-bold text-slate-800">
                        Personal Information
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Keep your personal information up to date.
                      </p>

                    </div>

                    <div className="p-6 space-y-6">

                      {/* Full Name */}
                      <div>

                        <label className="text-sm font-semibold text-slate-700">
                          Full Name
                        </label>

                        <div className="relative mt-2">

                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                          />

                        </div>

                      </div>

                      {/* Email + Phone */}
                      <div className="grid md:grid-cols-2 gap-5">

                        {/* Email */}
                        <div>

                          <label className="text-sm font-semibold text-slate-700">
                            Email Address
                          </label>

                          <div className="relative mt-2">

                            <Mail
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleProfileChange}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />

                          </div>

                        </div>

                        {/* Phone */}
                        <div>

                          <label className="text-sm font-semibold text-slate-700">
                            Phone Number
                          </label>

                          <div className="relative mt-2">

                            <Phone
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type="text"
                              name="phone"
                              value={profile.phone}
                              onChange={handleProfileChange}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />

                          </div>

                        </div>

                      </div>

                      {/* DOB + Gender */}
                      <div className="grid md:grid-cols-2 gap-5">

                        {/* DOB */}
                        <div>

                          <label className="text-sm font-semibold text-slate-700">
                            Date of Birth
                          </label>

                          <div className="relative mt-2">

                            <CalendarDays
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type="text"
                              name="dob"
                              value={profile.dob}
                              onChange={handleProfileChange}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />

                          </div>

                        </div>

                        {/* Gender */}
                        <div>

                          <label className="text-sm font-semibold text-slate-700">
                            Gender
                          </label>

                          <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleProfileChange}
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                          >

                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>

                          </select>

                        </div>

                      </div>

                      {/* Address */}
                      <div>

                        <label className="text-sm font-semibold text-slate-700">
                          Address
                        </label>

                        <div className="relative mt-2">

                          <MapPin
                            size={18}
                            className="absolute left-4 top-4 text-slate-400"
                          />

                          <textarea
                            name="address"
                            value={profile.address}
                            onChange={handleProfileChange}
                            rows="3"
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                          />

                        </div>

                      </div>

                      {/* Save */}
                      <div className="flex justify-end pt-2">

                        <button
                          type="button"
                          onClick={() =>
                            toast.success("Profile updated successfully!")
                          }
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >

                          <Save size={18} />

                          Save Changes

                        </button>

                      </div>

                    </div>

                  </div>
                )}

                {/* ================================================== */}
                {/* SECURITY */}
                {/* ================================================== */}

                {activeTab === "security" && (
                  <div>

                    <div className="p-6 border-b border-slate-100">

                      <h2 className="text-xl font-bold text-slate-800">
                        Security
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Protect your account with strong security settings.
                      </p>

                    </div>

                    <div className="p-6 space-y-5">

                      {/* Change Password */}
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">

                        <div className="flex gap-4">

                          <div className="p-3 rounded-xl bg-blue-600 text-white h-fit">
                            <Lock size={20} />
                          </div>

                          <div>

                            <h3 className="font-bold text-blue-900">
                              Change Password
                            </h3>

                            <p className="text-sm text-blue-700 mt-1">
                              Update your password regularly to keep your
                              account secure.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                toast.info(
                                  "Password change feature will be connected to the backend."
                                )
                              }
                              className="mt-4 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Change Password
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* 2FA */}
                      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100">

                        <div className="flex gap-4">

                          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                            <Smartphone size={20} />
                          </div>

                          <div>

                            <h3 className="font-semibold text-slate-800">
                              Two-Factor Authentication
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Add an extra layer of security to your account.
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toast.info(
                              "Two-factor authentication will be implemented soon."
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold"
                        >
                          Enable
                        </button>

                      </div>

                    </div>

                  </div>
                )}

                {/* ================================================== */}
                {/* NOTIFICATIONS */}
                {/* ================================================== */}

                {activeTab === "notifications" && (
                  <div>

                    <div className="p-6 border-b border-slate-100">

                      <h2 className="text-xl font-bold text-slate-800">
                        Notification Preferences
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Choose what notifications you want to receive.
                      </p>

                    </div>

                    <div className="p-6 space-y-4">

                      {[
                        {
                          key: "appointment",
                          title: "Appointment Updates",
                          description:
                            "Get notified about appointment confirmations and changes.",
                        },
                        {
                          key: "prescription",
                          title: "Prescription Updates",
                          description:
                            "Receive notifications when a doctor adds a prescription.",
                        },
                        {
                          key: "reminder",
                          title: "Appointment Reminders",
                          description:
                            "Receive reminders before your scheduled appointments.",
                        },
                        {
                          key: "email",
                          title: "Email Notifications",
                          description:
                            "Receive important healthcare updates through email.",
                        },
                      ].map((item) => (

                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition"
                        >

                          <div>

                            <h3 className="font-semibold text-slate-800">
                              {item.title}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.description}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                [item.key]: !notifications[item.key],
                              })
                            }
                            className={`relative flex-shrink-0 w-12 h-7 rounded-full transition ${
                              notifications[item.key]
                                ? "bg-blue-600"
                                : "bg-slate-300"
                            }`}
                          >

                            <span
                              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition ${
                                notifications[item.key]
                                  ? "left-6"
                                  : "left-1"
                              }`}
                            />

                          </button>

                        </div>

                      ))}

                    </div>

                  </div>
                )}

                {/* ================================================== */}
                {/* PRIVACY */}
                {/* ================================================== */}

                {activeTab === "privacy" && (
                  <div>

                    <div className="p-6 border-b border-slate-100">

                      <h2 className="text-xl font-bold text-slate-800">
                        Privacy & Data
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Manage how your information is used and displayed.
                      </p>

                    </div>

                    <div className="p-6 space-y-4">

                      {/* Profile Visibility */}
                      <div className="p-5 rounded-2xl border border-slate-100 flex gap-4">

                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600 h-fit">
                          <Eye size={20} />
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-800">
                            Profile Visibility
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            Your profile information is only visible to
                            authorized healthcare staff.
                          </p>

                        </div>

                      </div>

                      {/* Medical Data */}
                      <div className="p-5 rounded-2xl border border-slate-100 flex gap-4">

                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 h-fit">
                          <Shield size={20} />
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-800">
                            Medical Data Protection
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            Your medical records are protected and accessible
                            only to authorized users.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </main>

      </div>
    </>
  );
};

export default PatientSetting;

