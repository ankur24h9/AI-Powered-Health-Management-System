import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import {useNavigate} from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  Activity,
  Stethoscope,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">


      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full top-0 left-0"
        />

        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 120, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute w-[450px] h-[450px] bg-cyan-400/20 blur-[150px] rounded-full bottom-0 right-0"
        />

      </div>

      {/* NAVBAR */}

      <header className="relative z-50">

        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

              <Activity size={26} />

            </div>

            <div>

              <h1 className="font-bold text-xl">
               AI Powered Smart OPD System
              </h1>

              <p className="text-xs text-slate-400">
                Hospital Management
              </p>

            </div>

          </div>

          <div className="hidden md:flex items-center gap-8 text-slate-300">

            <a href="#home" className="hover:text-blue-400 transition">
              Home
            </a>

            <a href="#features" className="hover:text-blue-400 transition">
              Features
            </a>

            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>

            <a href="#contact" className="hover:text-blue-400 transition">
              Contact
            </a>

          </div>

          <div className="hidden md:flex gap-3">

            <button className="px-5 py-2 rounded-xl border border-slate-700 hover:border-blue-500 transition"
             onClick={() => navigate("/login")}>

              Login

            </button>

            <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
            onClick = {()=> navigate("/register")}>

              Sign Up

            </button>

          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>

        </nav>

        {open && (
          <div className="md:hidden bg-slate-900 px-6 pb-5">

            <div className="flex flex-col gap-4">

              <a href="#">Home</a>

              <a href="#">Features</a>

              <a href="#">About</a>

              <a href="#">Contact</a>

              <button className="bg-blue-600 rounded-lg py-2"
              onClick ={() => navigate("/login")}>
                Login
              </button>

              <button className="border border-blue-500 rounded-lg py-2"
              onClick ={() => navigate("/register")}>
                Sign Up
              </button>

            </div>

          </div>
        )}

      </header>

      {/* HERO */}

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-6">

              <ShieldCheck className="text-blue-400" size={18} />

              <span className="text-sm">
                Secure • Fast • Digital Healthcare
              </span>

            </div>

            <h1 className="text-6xl font-black leading-tight">

             A.I Powered Smart 

              <span className="text-blue-500">
                {"       "}OPD {"  "}
              </span>

            

             Management System

            </h1>

            <p className="text-slate-400 text-lg mt-8 leading-8">

              Simplify hospital operations with digital patient records,
              online appointment booking, doctor scheduling,
              department management, and secure healthcare services —
              all in one intelligent platform.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button className="group px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center gap-3"
              onClick={()=>navigate("/login")}>

                Get Started

                <ArrowRight
                  className="group-hover:translate-x-2 transition"
                  size={20}
                />

              </button>

              <button className="px-8 py-4 rounded-xl border border-slate-700 hover:border-blue-500">

                Live Demo

              </button>

            </div>

            <div className="flex gap-10 mt-14">

              <div>

                <h2 className="text-3xl font-bold">
                  10K+
                </h2>

                <p className="text-slate-400">
                  Patients
                </p>

              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  250+
                </h2>

                <p className="text-slate-400">
                  Doctors
                </p>

              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  99.9%
                </h2>

                <p className="text-slate-400">
                  Uptime
                </p>

              </div>

            </div>

          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-xl font-bold">
                    Dashboard
                  </h3>

                  <p className="text-slate-400">
                    Today's Overview
                  </p>

                </div>

                <CalendarDays className="text-blue-500" />

              </div>

              <div className="space-y-5 mt-8">

                {[
                  "Patients Registered",
                  "Appointments",
                  "Doctors Available",
                  "Departments",
                ].map((item, i) => (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    key={i}
                    className="bg-slate-900 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <span>{item}</span>

                    <span className="font-bold text-blue-400">

                      {Math.floor(Math.random() * 300)}

                    </span>

                  </motion.div>
                ))}

              </div>

            </div>

            {/* Floating Card */}

            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="absolute -left-12 top-24 bg-blue-600 rounded-2xl p-5 shadow-2xl"
            >

              <Stethoscope size={34} />

              <p className="mt-2 font-semibold">

                24/7 Healthcare

              </p>

            </motion.div>

          </motion.div>

        </div>
        

      </section>
      {/* FEATURES */}
<section
  id="features"
  className="relative z-10 max-w-7xl mx-auto px-6 py-24"
>
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: .8 }}
    className="text-center mb-16"
  >
    <h2 className="text-5xl font-bold">
      Powerful <span className="text-blue-500">Features</span>
    </h2>

    <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
      Everything required to digitally manage hospitals, doctors,
      appointments and patients in one secure platform.
    </p>
  </motion.div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {[
      {
        icon: "👨‍⚕️",
        title: "Doctor Management",
        desc: "Add, edit and manage doctors with departments and schedules."
      },
      {
        icon: "🩺",
        title: "Patient Records",
        desc: "Secure digital patient history and medical records."
      },
      {
        icon: "📅",
        title: "Appointment Booking",
        desc: "Book appointments with automatic token generation."
      },
      {
        icon: "🏥",
        title: "Department Management",
        desc: "Organize doctors and patients by departments."
      },
      {
        icon: "🔐",
        title: "JWT Authentication",
        desc: "Secure login with role-based access control."
      },
      {
        icon: "📊",
        title: "Dashboard Analytics",
        desc: "Track appointments, patients and doctors in real-time."
      }
    ].map((item, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.05 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
      >
        <div className="text-5xl mb-5">{item.icon}</div>

        <h3 className="text-2xl font-semibold mb-3">
          {item.title}
        </h3>

        <p className="text-slate-400">
          {item.desc}
        </p>
      </motion.div>
    ))}

  </div>
</section>

<section
id="about"
className="relative z-10 max-w-7xl mx-auto px-6 py-24"
>

<div className="grid lg:grid-cols-2 gap-16 items-center">

<div>

<h2 className="text-5xl font-bold mb-8">

About
<span className="text-blue-500"> Smart OPD</span>

</h2>

<p className="text-slate-400 leading-8 text-lg">

Smart OPD is an intelligent Hospital Management System developed
to simplify hospital workflows. It enables hospitals to manage
patients, doctors, appointments, departments, authentication,
and healthcare services digitally.

</p>

<p className="text-slate-400 leading-8 text-lg mt-6">

The platform reduces paperwork, minimizes waiting time,
improves doctor availability, and provides a seamless experience
for administrators, doctors, and patients.

</p>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="bg-blue-600 rounded-3xl p-8">

<h1 className="text-5xl font-bold">250+</h1>

<p className="mt-3">
Doctors
</p>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<h1 className="text-5xl font-bold">10000+</h1>

<p className="mt-3">
Patients
</p>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<h1 className="text-5xl font-bold">24/7</h1>

<p className="mt-3">
Support
</p>

</div>

<div className="bg-blue-600 rounded-3xl p-8">

<h1 className="text-5xl font-bold">99.9%</h1>

<p className="mt-3">
System Uptime
</p>

</div>

</div>

</div>

</section>
<section
id="contact"
className="relative z-10 max-w-7xl mx-auto px-6 py-24"
>

<div className="text-center mb-16">

<h2 className="text-5xl font-bold">

Contact
<span className="text-blue-500"> Us</span>

</h2>

<p className="text-slate-400 mt-5">
Have questions? We'd love to hear from you.
</p>

</div>

<div className="max-w-3xl mx-auto">

<form className="space-y-6">

<input
type="text"
placeholder="Your Name"
className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
/>

<input
type="email"
placeholder="Email Address"
className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
/>

<textarea
rows={6}
placeholder="Write your message..."
className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
/>

<button
className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold"
>

Send Message

</button>

</form>

</div>

</section>


    </div>
  );
}