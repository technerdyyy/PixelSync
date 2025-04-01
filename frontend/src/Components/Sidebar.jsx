import { FaPencilAlt, FaComments, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";
import Cookies from "js-cookie";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ Get current route

  const handleLogout = () => {
    Cookies.remove("token"); // Remove token immediately
    Cookies.remove("user"); // Remove user immediately
    dispatch(logout()); // Clear Redux state
    navigate("/login", { replace: true }); // Redirect
  };

  return (
    <div className="w-20 h-screen bg-[#FBE6FF] flex flex-col items-center py-4">
      {/* Pencil Icon */}
      <button className={`p-3 rounded-lg ${location.pathname === "/" ? "bg-[#6F0081] text-white" : "hover:bg-[#EAAEF5] text-[#6F0081] " } mb-6`} onClick={()=>{navigate("/")}}>
        <FaPencilAlt size={30} />
      </button>

      {/* Chat Icon (Highlight when active) */}
      <button
        className={`p-3 rounded-lg transition mb-6 ${
          location.pathname === "/chat" ? "bg-[#6F0081] text-white" : "hover:bg-[#EAAEF5]"
        }`}
        onClick={() => navigate("/chat")}
      >
        <FaComments size={30} className={location.pathname === "/chat" ? "text-white" : "text-[#6F0081]"} />
      </button>

      {/* User Icon */}
      <button className="p-3 rounded-lg hover:bg-[#EAAEF5] transition mb-6">
        <FaUser size={30} className="text-[#6F0081]" />
      </button>

      {/* Logout Icon */}
      <button className="p-3 rounded-lg hover:bg-[#EAAEF5] transition mt-auto" onClick={handleLogout}>
        <FaSignOutAlt size={30} className="text-[#6F0081]" />
      </button>
    </div>
  );
};

export default Sidebar;
