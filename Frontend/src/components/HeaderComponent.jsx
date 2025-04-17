//? ---------------| IMPORT LIBRARIES |---------------
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import {
  Navbar,
  TextInput,
  Button,
  NavbarCollapse,
  Dropdown,
  Avatar,
  Tooltip,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMoonSharp, IoSunny } from "react-icons/io5";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
  const path = useLocation().pathname;
  const curUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

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
      <form action="">
        <TextInput
          type="text"
          placeholder="Searching..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        ></TextInput>
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch></AiOutlineSearch>
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
              content="Dark Mode"
              style="light"
              placement="bottom"
              trigger="hover"
            >
              <IoMoonSharp />
            </Tooltip>
          ) : (
            <Tooltip
              content="Light Mode"
              style="dark"
              placement="bottom"
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
              <Avatar alt="user" img={curUser.user.profileImage} rounded />
            }
          >
            <Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                {/* Display Name */}
                <span className="block text-sm">
                  {curUser.user.displayName}
                </span>
                {/* Email */}
                <span className="block truncate text-sm font-medium">
                  {curUser.user.email}
                </span>
              </Link>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" color="gray" pill>
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* ---------------| NAVIGATE PAGES |---------------*/}
      <NavbarCollapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
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
