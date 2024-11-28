import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { HiMail, HiInformationCircle } from "react-icons/hi";
import { FaUser, FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { SlLike } from "react-icons/sl";

const SignUp = () => {
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
        setErrorMessage(null);
        setSuccessMessage(null);
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
      const res = await fetch("/api/auth/users/sign-up", {
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
        navigate("/sign-in");
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
    // Whole page Sign up
    <div className="min-h-screen mt-20">
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <span className="font-semibold text-6xl">Sign Up</span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          <div>
            <Label value="Email" />
            <TextInput
              id="email"
              placeholder="email@mail.com"
              type="email"
              icon={HiMail}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Username" />
            <TextInput
              id="username"
              placeholder="ArysDomi"
              type="text"
              icon={FaUser}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Password" />
            <TextInput
              id="password"
              placeholder="Password"
              type="password"
              icon={FaLock}
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
        </form>
        <div className="flex gap-2 mt-5">
          <span>Have an account?</span>
          <Link to="/sign-in" className="text-blue-500">
            Sign In
          </Link>
        </div>
        {alertComponent}
      </div>
    </div>
  );
};

export default SignUp;
