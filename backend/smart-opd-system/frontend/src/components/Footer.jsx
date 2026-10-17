import React from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
   import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,

} from "lucide-react";


function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <HeartPulse size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Smart OPD
                </h2>
                <p className="text-gray-400 text-sm">
                  Healthcare Management System
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Smart OPD simplifies patient management,
              appointment booking, prescriptions,
              and medical records with a modern
              digital healthcare experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Dashboard
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Appointments
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Reports
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Prescriptions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>Online Appointments</li>
              <li>Medical Records</li>
              <li>Doctor Management</li>
              <li>Digital Prescriptions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@smartopd.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Bhopal, India</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-800"></div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-400 text-sm text-align-center">
          © {new Date().getFullYear()} Smart OPD System.
          All Rights Reserved.
        </p>

        <div className="flex items-center gap-4">

          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
          >
           <FaLinkedin size={20} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
          >
         <FaTwitter size={20} />
          </a>

        </div>

      </div>
    </footer>
  );
}

export default Footer;

