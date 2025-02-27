import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { signIn } from "../apis/auth";
import OAuth from "../components/OAuth";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //? ---------------| GET USERNAME & PASSWORD |---------------
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
      const { ok, data } = await signIn(formData);
      if (!ok) {
        dispatch(signInFailure(data.message));
        toast.error(errorMessage, { theme: "colored" });
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/dashboard?tab=profile");
      toast.success("Sign in successfully!", { theme: "colored" });
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
    <div className="min-h-screen mt-7">
      <ToastContainer position="top-right" autoClose={7000} />
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5 ">
        <div className="font-semibold text-center text-6xl">
          <span>Sign In</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          <div>
            <Label className="text-lg" value="Username" />
            <TextInput
              id="username"
              placeholder="Enter your username"
              type="text"
              icon={FaUser}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label className="text-lg" value="Password" />
            <div className="relative">
              <TextInput
                id="password"
                placeholder="Enter your password"
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
                <span className="pl-3">Loading...</span>
              </div>
            ) : (
              "Continue"
            )}
          </Button>
          <p className="font-sans text-center">Or</p>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 text-base">
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
          <span>if you do not have an account!</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
