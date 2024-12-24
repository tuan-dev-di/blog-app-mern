import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { HiMail, HiInformationCircle } from "react-icons/hi";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
// import {
//   signUpStart,
//   signUpSuccess,
//   signUpFailure,
// } from "../redux/user/userSlice";

import { signUp } from "../apis/auth";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // const { loading, error: errorMessage } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  //? Get Username & Password from User to Sign Up
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      // dispatch(signUpStart());
      const { ok, data } = await signUp(formData);
      if (!ok) {
        setErrorMessage(data.message);
        // dispatch(signUpFailure(data.message));
        return;
      }
      setSuccessMessage(data.message);
      // dispatch(signUpSuccess(data.message));
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
      // dispatch(signUpFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  //? Button display password
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //? Warning for User after update error/success
  let alertComponent = null;
  useEffect(() => {
    let timeout;
    if (errorMessage || successMessage) {
      timeout = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 7000);
    }
    return () => clearTimeout(timeout);
  }, [errorMessage, successMessage]);

  if (errorMessage) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {errorMessage}
      </Alert>
    );
  } else if (successMessage) {
    alertComponent = (
      <Alert className="mt-5" color="info" icon={SlLike}>
        {successMessage} <br /> Wait for 5s to navigate to Sign In page
      </Alert>
    );
  }

  return (
    // Whole page Sign up
    <div className="min-h-screen mt-7">
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
        {alertComponent}
      </div>
    </div>
  );
};

export default SignUp;
