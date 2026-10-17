import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";

function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8 bg-slate-100 min-h-screen">

          <h1 className="text-3xl font-bold mb-8">
            Admin Dashboard
          </h1>

          <div className="grid md:grid-cols-4 gap-5">

            <DashboardCard
              title="Patients"
              value="250"
            />

            <DashboardCard
              title="Doctors"
              value="30"
            />

            <DashboardCard
              title="Appointments"
              value="140"
            />

            <DashboardCard
              title="Revenue"
              value="₹45,000"
            />

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;