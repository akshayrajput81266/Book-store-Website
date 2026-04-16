import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-4">

        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">
              Welcome, {adminInfo?.name} 
            </h1>
            <p className="text-sm text-gray-500 mt-1">{adminInfo?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">
             Admin panel ready hai! Yahan books, orders aur users manage kar sakte hain.
          </p>
        </div>

      </div>
    </div>
  );
}