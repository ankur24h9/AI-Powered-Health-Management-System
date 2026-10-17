import { useLocation, useNavigate } from "react-router-dom";

function AppointmentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[500px] text-center">

        <div className="text-6xl text-green-600 mb-4">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Appointment Booked Successfully!
        </h1>

        <p className="mt-5 text-lg">
          Thank you for booking your appointment.
        </p>

        <div className="mt-6 bg-blue-100 p-5 rounded-lg">
          <h2 className="text-xl font-semibold">
            Your Token ID
          </h2>

          <p className="text-4xl font-bold text-blue-700 mt-2">
            #{state?.tokenId}
          </p>
        </div>

        <p className="mt-5">
          Doctor: <b>{state?.doctorName}</b>
        </p>

        <p>
          Date: <b>{state?.appointmentDate}</b>
        </p>

        <p>
          Time: <b>{state?.appointmentTime}</b>
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </button>

      </div>
    </div>
  );
}

export default AppointmentSuccess;