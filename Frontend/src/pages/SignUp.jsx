import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { SIGN_UP } from "../apis/auth";
import OAuth from "../components/OAuth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  //? ---------------| GET USERNAME, PASSWORD, EMAIL & DISPLAY NAME |---------------
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

      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
      toast.success("Sign up successfully!", { theme: "colored" });
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
          <span>Sign Up</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          <div>
            <Label className="text-lg">
              Username<span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="username"
              placeholder="Enter your username"
              type="text"
              icon={FaUser}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-lg">
              Password<span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <TextInput
                id="password"
                placeholder="Enter your password"
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
          </div>
          <div>
            <Label className="text-lg">
              Email<span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="email"
              placeholder="Enter your email address"
              type="email"
              icon={HiMail}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-lg">
              Display Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <TextInput
              id="displayName"
              placeholder="Enter your display name"
              type="text"
              required
              onChange={handleChange}
            />
          </div>
          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </div>
            ) : (
              "Continue"
            )}
          </Button>
          <p className="font-sans text-center">Or</p>
          <OAuth></OAuth>
        </form>
        <div className="flex gap-2 mt-5 text-base">
          <Link to="/sign-in" className="text-blue-500">
            Sign In
          </Link>
          <span>if you have an account!</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
