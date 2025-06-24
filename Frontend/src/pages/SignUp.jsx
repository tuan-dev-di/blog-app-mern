//? ---------------| IMPORT LIBRARIES |---------------
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Button, Spinner, Tooltip } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { SIGN_UP } from "../apis/auth";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  //? ---------------| HANDLE GET ATTRIBUTE TO SIGN UP |---------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT SIGN UP |---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { ok, data } = await SIGN_UP(formData);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Đăng ký thành công!", { theme: "colored" });

      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (error) {
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  //? ---------------| HANDLE SHOW PASSWORD |---------------
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Whole page Sign up
    <div className="min-h-screen mt-7">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="font-semibold text-center text-6xl">
          <span>Đăng Ký</span>
        </div>

        {/* Form Sign Up */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          {/* ---------------| EMAIL |--------------- */}
          <div>
            <Label className="text-lg flex">
              Email
              <Tooltip
                content="Bắt buộc"
                style="light"
                placement="right"
                trigger="hover"
              >
                <span className="text-red-500 ml-1">*</span>
              </Tooltip>
            </Label>
            <TextInput
              id="email"
              placeholder="Ví dụ: example@gmail.com"
              type="email"
              icon={HiMail}
              required
              onChange={handleChange}
            />
          </div>

          {/* ---------------| DISPLAY NAME |--------------- */}
          <div>
            <Label className="text-lg flex">
              Tên hiển thị
              <Tooltip
                content="Bắt buộc"
                style="light"
                placement="right"
                trigger="hover"
              >
                <span className="text-red-500 ml-1">*</span>
              </Tooltip>
            </Label>
            <TextInput
              id="displayName"
              placeholder="Ví dụ: Nguyễn Văn A"
              type="text"
              required
              onChange={handleChange}
            />
          </div>

          {/* ---------------| USERNAME |--------------- */}
          <div>
            <Label className="text-lg flex">
              Tên tài khoản
              <Tooltip
                content="Bắt buộc"
                style="light"
                placement="right"
                trigger="hover"
              >
                <span className="text-red-500 ml-1">*</span>
              </Tooltip>
            </Label>
            <TextInput
              id="username"
              placeholder="Ví dụ: Example"
              type="text"
              icon={FaUser}
              required
              onChange={handleChange}
            />
          </div>

          {/* ---------------| PASSWORD |--------------- */}
          <div>
            <Label className="text-lg flex">
              Mật khẩu
              <Tooltip
                content="Bắt buộc"
                style="light"
                placement="right"
                trigger="hover"
              >
                <span className="text-red-500 ml-1">*</span>
              </Tooltip>
            </Label>
            <div className="relative">
              <TextInput
                id="password"
                placeholder="Ví dụ: P@ssw0rd"
                type={showPassword ? "text" : "password"}
                icon={FaLock}
                required
                onChange={handleChange}
              />
              <Button
                onClick={toggleShowPassword}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer border-none shadow-none sm:inline"
                color="gray"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </div>
            <ul className="list-disc  ml-4 p-3 text-sm ">
            <li>Mật khẩu tối thiểu phải đạt 8 ký tự</li>
            <li>Chứa ít nhật 1 ký tự đặc biệt</li>
            <li>Chứa ít nhật 1 ký tự số</li>
            <li>Chứa ít nhất 1 ký tự chữ viết hoa</li>
            <li>Chứa ít nhất 1 ký tự chữ viết thường</li>
          </ul>
          </div>

          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div>
                <Spinner size="sm" />
                <span className="pl-3">Đang đăng ký...</span>
              </div>
            ) : (
              "Tiếp tục"
            )}
          </Button>
          <p className="font-sans text-center">Hoặc</p>

          {/* Using Gooogle Authentication to Sign In/Up */}
          <OAuth />
        </form>

        {/* Navigate to Sign In page */}
        <div className="flex gap-1 mt-5 text-base">
          <Link to="/sign-in" className="text-blue-500">
            Đăng nhập
          </Link>
          <span>nếu bạn đã có tài khoản rồi!</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
