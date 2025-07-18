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
import { SIGN_OUT } from "../api/auth";

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
      navigate("/sign-in");
    } catch (error) {
      console.log("Sign out error:", error.message);
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <Sidebar className="w-full md:w-60 shadow-md">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {userRole === "admin" && (
            <Sidebar.Item
              icon={MdSpaceDashboard}
              className="cursor-pointer"
              as={"div"}
            >
              <Link to="/overview">Tổng quát</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={FaUserEdit}
            className="cursor-pointer"
            as={"div"}
          >
            <Link to="/profile">Hồ sơ cá nhân</Link>
          </Sidebar.Item>
          {userRole === "admin" && (
            <Sidebar.Item icon={FaUsers} className="cursor-pointer" as={"div"}>
              <Link to="/users/get-users">Người dùng</Link>
            </Sidebar.Item>
          )}
          {userRole === "admin" && (
            <Sidebar.Item
              icon={MdArticle}
              className="cursor-pointer"
              as={"div"}
            >
              <Link to="/posts/get-posts">Bài viết</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={BiSolidCommentDetail}
            className="cursor-pointer"
            as={"div"}
          >
            <Link to="/comments/get-comments">Bình luận</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={FaSignOutAlt}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Đăng xuất
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarApp;
