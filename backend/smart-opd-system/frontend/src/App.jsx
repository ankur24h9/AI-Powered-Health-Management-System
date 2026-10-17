import { Routes, Route } from "react-router-dom";
import MedicalHistory from "./pages/MedicalHistory";
import Login from "./pages/Login";
import WritePrescription from "./pages/WritePrescription";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import ResetPassword from "./pages/ResetPassword";
import AddPatient from "./pages/AddPatient";
import AddDoctor from "./pages/AddDoctor";
import Prescriptions from "./pages/Prescriptions";
import EditDoctor from "./pages/EditDoctor";
import EditPatient from "./pages/EditPatient";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import BookAppointment from "./pages/BookAppointment";
import MyReport from "./pages/MyReport";
import PatientSetting from "./pages/PatientSetting";
import LiveQueue from "./pages/LiveQueue";
import PatientsDirectory from "./pages/PatientDirectory";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/LandingPage"
        element={<LandingPage />}
      />

      <Route
      path="/doctor/patients"
      element={<PatientsDirectory />}
      />

      <Route
  path="/doctor/live-queue"
  element={<LiveQueue />}
/>
      <Route
        path="/my-reports"
        element={<MyReport />}
      />

      <Route
      path="/write-prescription"
      element={<WritePrescription/>}/>

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

     

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/appointment-success"
        element={<AppointmentSuccess />}
      />


      <Route
        path="/register"
        element={<Register />}
      />


     <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route path="/patient-dashboard"
        element={<PatientDashboard />}
      />
      
     
      <Route path="/prescriptions"
        element={<Prescriptions />}
      />
  
      <Route path="/patient-settings" 
      element={<PatientSetting />} 
      /> 
    <Route path="/medical-history" 
      element={<MedicalHistory />} 
      />


      <Route
        path="/book-appointment"
        element={<BookAppointment />}
      />

      <Route
        path="/doctor"
        element={<DoctorDashboard />}
      />




      <Route
        path="/patients"
        element={<Patients />}
      />

      <Route
        path="/patients-dash"
        element={<PatientDashboard />}
      />

      <Route
        path="/doctors"
        element={<Doctors />}
      />

      <Route
        path="/add-patient"
        element={<AddPatient />}
      />

      <Route
        path="/add-doctor"
        element={<AddDoctor />}
      />

      <Route
        path="/edit-patient/:id"
        element={<EditPatient />}
      />

      <Route
        path="/edit-doctor/:id"
        element={<EditDoctor />}
      />

      <Route
        path="/prescriptions"
        element={<Prescriptions />}
      />
    </Routes>
  );
}

export default App;