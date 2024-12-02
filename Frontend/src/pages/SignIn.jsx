import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Spinner, Alert } from "flowbite-react";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { SlLike } from "react-icons/sl";
import { HiInformationCircle } from "react-icons/hi";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  let alertComponent = null;

  useEffect(() => {
    let timeout;
    if (errorMessage || successMessage) {
      timeout = setTimeout(() => {
        errorMessage(null);
        successMessage(null);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [errorMessage, successMessage]);

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
      const res = await fetch("/api/auth/users/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setErrorMessage(data.message);
        return;
      }
      setSuccessMessage(data.message);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (errorMessage) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {errorMessage}
      </Alert>
    );
  } else if (successMessage) {
    alertComponent = (
      <Alert className="mt-5" color="info" icon={SlLike}>
        {successMessage}
      </Alert>
    );
  }

  return (
    // Whole page Sign-in
    <div className="min-h-screen mt-14">
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5 ">
        <div className="font-semibold text-center text-6xl">
          <span>Đăng nhập</span>
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
            <TextInput
              id="password"
              placeholder="Enter your password"
              type="password"
              icon={FaLock}
              onChange={handleChange}
              required
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
          <Button gradientDuoTone="pinkToOrange" type="submit">
            Continue with Google
            <FaGoogle className="ml-2 h-5 w-5" />
          </Button>
        </form>
        <div className="flex gap-2 mt-5 text-base">
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
          <span>if you do not have an account?</span>
        </div>
        {alertComponent}
      </div>
    </div>
  );
};

export default SignIn;
