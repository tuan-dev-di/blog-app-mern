import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Sidebar } from "flowbite-react";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import { signOutSuccess, signOutFailure } from "../../redux/user/userSlice";
import { signOutUser } from "../../apis/auth";

const DashboardSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) setTab(tabFromURL);
  }, [location.search]);

  //? Sign out
  const [userSignOutSuccess, setUserSignOutSuccess] = useState(null);
  const [userSignOutFailure, setUserSignOutFailure] = useState(null);

  const handleSignout = async () => {
    try {
      // Sign out with firebase sign out
      const { ok, data } = await signOutUser();

      if (!ok) {
        dispatch(signOutFailure(data.message));
        setUserSignOutFailure(data.message);
        return;
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      dispatch(signOutSuccess(data.message));
      console.log("Sign out successfully");
      setUserSignOutSuccess("Sign out successfully");
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaUserEdit}
              className=""
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={IoMdSettings} className="">
            Settings
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={FaSignOutAlt}
            className=""
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
