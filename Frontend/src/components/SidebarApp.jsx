//? ---------------| IMPORT LIBRARIES |---------------
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Sidebar } from "flowbite-react";
import { FaUserEdit, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdArticle, MdSpaceDashboard } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { signOutSuccess, signOutFailure } from "../redux/user/userSlice";
import { SIGN_OUT } from "../apis/auth";

const SidebarApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const curUser = useSelector((state) => state.user.currentUser);
  const userRole = curUser.user.role;
  const userId = curUser.user._id;

  //? ---------------| HANDLE SIGN OUT |---------------
  const handleSignout = async () => {
    try {
      // Sign out with firebase sign out
      const { ok, data } = await SIGN_OUT(userId);

      if (!ok) {
        dispatch(signOutFailure(data.message));
        return;
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      dispatch(signOutSuccess(data.message));
      console.log("Sign out successfully!");
      navigate("/sign-in");
    } catch (error) {
      console.log("Sign out error:", error.message);
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <Sidebar className="w-full md:w-60">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {userRole === "admin" && (
            <Sidebar.Item
              icon={MdSpaceDashboard}
              className="cursor-pointer"
              as={"div"}
            >
              <Link to="/overview">Overview</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={FaUserEdit}
            label={userRole}
            className="cursor-pointer"
            as={"div"}
          >
            <Link to="/profile">Profile</Link>
          </Sidebar.Item>
          {userRole === "admin" && (
            <Sidebar.Item icon={FaUsers} className="cursor-pointer" as={"div"}>
              <Link to="/users/get-users">Users</Link>
            </Sidebar.Item>
          )}
          {userRole === "admin" && (
            <Sidebar.Item
              icon={MdArticle}
              className="cursor-pointer"
              as={"div"}
            >
              <Link to="/posts/get-posts">Posts</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={BiSolidCommentDetail}
            className="cursor-pointer"
            as={"div"}
          >
            <Link to="/comments/get-comments">Comments</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={FaSignOutAlt}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarApp;
