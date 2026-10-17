import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen">

      <div className="text-center py-5 text-xl font-bold">
        OPD System
      </div>

      <ul className="space-y-3 px-4">

        <li>
          <Link to="/admin">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/patients">
            Patients
          </Link>
        </li>

        <li>
          <Link to="/All doctors">
            Doctors
          </Link>
        </li>

        <li>
          <Link to="/doctor/history">
            Appointments
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;