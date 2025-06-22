//? ---------------| IMPORT LIBRARIES |---------------
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

//? ---------------| IMPORT COMPONENTS |---------------
import {
  Navbar,
  TextInput,
  Button,
  NavbarCollapse,
  Dropdown,
  Avatar,
  Tooltip,
  DropdownItem,
} from "flowbite-react";
import { FaSignOutAlt } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMoonSharp, IoSunny } from "react-icons/io5";
import { toggleTheme } from "../redux/theme/themeSlice";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { signOutSuccess, signOutFailure } from "../redux/user/userSlice";
import { SIGN_OUT } from "../apis/auth";

const Header = () => {
  const path = useLocation().pathname;
  const curUser = useSelector((state) => state?.user?.currentUser);
  const userId = curUser?.user?._id;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");

    if (searchTermFromURL) setSearchTerm(searchTermFromURL);
  }, [location.search]);

  const handleSearching = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

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
    // Whole Header
    <Navbar className="border-b-2 ">
      {/* ---------------| LOGO |---------------*/}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-indigo-700 to-pink-400 rounded-lg text-white">
          Arys Domi&apos;s Blog
        </span>
      </Link>

      {/* ---------------| SEARCH INPUT |---------------*/}
      <form onSubmit={handleSearching}>
        <TextInput
          type="text"
          placeholder="Tìm kiếm..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* ---------------| TOGGLE BUTTON CHANGE THEME |---------------*/}
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-13 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <Tooltip
              content="Giao diện tối"
              style="light"
              placement="left"
              trigger="hover"
            >
              <IoMoonSharp />
            </Tooltip>
          ) : (
            <Tooltip
              content="Giao diện sáng"
              style="dark"
              placement="left"
              trigger="hover"
            >
              <IoSunny />
            </Tooltip>
          )}
        </Button>

        {/* ---------------| PROFILE |---------------*/}
        {curUser !== null ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={curUser?.user?.profileImage} rounded />
            }
          >
            <Dropdown.Header>
              <Link to="/profile">
                {/* Display Name */}
                <span className="block text-sm">
                  {curUser?.user?.displayName}
                </span>
                {/* Email */}
                <span className="block truncate text-sm font-medium">
                  {curUser?.user?.email}
                </span>
              </Link>
            </Dropdown.Header>
            <DropdownItem icon={FaSignOutAlt} onClick={handleSignout}>
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" color="gray" pill>
              Đăng Nhập
            </Button>
          </Link>
        )}
      </div>

      {/* ---------------| NAVIGATE PAGES |---------------*/}
      <NavbarCollapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Trang chủ</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/project"} as={"div"}>
          <Link to="/project">Project</Link>
        </Navbar.Link>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
