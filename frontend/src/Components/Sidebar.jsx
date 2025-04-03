import { FaPencilAlt, FaComments, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";
import Cookies from "js-cookie";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // Function to determine if a button is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-20 h-screen bg-[#FBE6FF] flex flex-col items-center py-4">
      {/* Pencil Icon */}
      <button
        onClick={() => navigate("/")}
        className={`p-3 rounded-lg mb-6 ${
          isActive("/") ? "bg-[#6F0081] text-white" : "hover:bg-[#EAAEF5]"
        }`}
      >
        <FaPencilAlt
          size={30}
          className={isActive("/") ? "text-white" : "text-[#6F0081]"}
        />
      </button>

      {/* Chat Icon */}
      <button
        onClick={() => navigate("/chat")}
        className={`p-3 rounded-lg mb-6 ${
          isActive("/chat") ? "bg-[#6F0081] text-white" : "hover:bg-[#EAAEF5]"
        }`}
      >
        <FaComments
          size={30}
          className={isActive("/chat") ? "text-white" : "text-[#6F0081]"}
        />
      </button>

      {/* User Icon */}
      <button
        onClick={() => navigate("/profile")}
        className={`p-3 rounded-lg mb-6 ${
          isActive("/profile")
            ? "bg-[#6F0081] text-white"
            : "hover:bg-[#EAAEF5]"
        }`}
      >
        <FaUser
          size={30}
          className={isActive("/profile") ? "text-white" : "text-[#6F0081]"}
        />
      </button>

      {/* Logout Icon */}
      <button
        onClick={handleLogout}
        className="p-3 rounded-lg hover:bg-[#EAAEF5] transition mt-auto"
      >
        <FaSignOutAlt size={30} className="text-[#6F0081]" />
      </button>
    </div>
  );
};

export default Sidebar;
