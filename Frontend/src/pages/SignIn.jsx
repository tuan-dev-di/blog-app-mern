//? ---------------| IMPORT LIBRARIES |---------------
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { SIGN_IN } from "../apis/auth";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //? ---------------| HANDLE GET ATTRIBUTE TO SIGN IN |---------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT SIGN IN |---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const { ok, data } = await SIGN_IN(formData);
      if (!ok) {
        dispatch(signInFailure(data.message));
        toast.error(data?.message, { theme: "colored" });
        return;
      }

      dispatch(signInSuccess(data));
      toast.success("Đăng nhập thành công!", { theme: "colored" });

      // replace: true => To prevent users from returning to the sign-in page with the "Back" button
      setTimeout(() => {
        if (data?.user?.role === "admin") navigate("/overview", { replace: true });
        else navigate("/profile", { replace: true });
      }, 3000);
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE SHOW PASSWORD |---------------
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Whole page Sign in
    <div className="min-h-screen mt-7">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5 ">
        <div className="font-semibold text-center text-6xl">
          <span>Đăng Nhập</span>
        </div>

        {/* Form Sign In */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          {/* ---------------| USERNAME |--------------- */}
          <div>
            <Label className="text-lg" value="Tên tài khoản" />
            <TextInput
              id="username"
              placeholder="Nhập tên tài khoản của bạn"
              type="text"
              icon={FaUser}
              onChange={handleChange}
              required
            />
          </div>

          {/* ---------------| PASSWORD |--------------- */}
          <div>
            <Label className="text-lg" value="Mật khẩu" />
            <div className="relative">
              <TextInput
                id="password"
                placeholder="Nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                icon={FaLock}
                onChange={handleChange}
                required
              />
              <Button
                onClick={toggleShowPassword}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer border-none shadow-none sm:inline"
                color="gray"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </div>
          </div>
          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div>
                <Spinner size="sm" />
                <span className="pl-3">Đang đăng nhập...</span>
              </div>
            ) : (
              "Tiếp tục"
            )}
          </Button>
          <p className="font-sans text-center">Hoặc</p>

          {/* Using Gooogle Authentication to Sign In/Up */}
          <OAuth />
        </form>

        {/* Navigate to Sign Up page */}
        <div className="flex gap-2 mt-5 text-base">
          <Link to="/sign-up" className="text-blue-500">
            Đăng ký
          </Link>
          <span>nếu bạn chưa có tài khoản!</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
