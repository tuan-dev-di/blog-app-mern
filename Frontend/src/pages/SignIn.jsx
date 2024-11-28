import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { useState } from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/users/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
    } catch (error) {
      console.log("ERROR: " + error);
    }
  };

  return (
    // Whole page Sign-in
    <div className="min-h-screen mt-20">
      <div className="flex-1 p-3 max-w-xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <span className="font-semibold text-6xl">Sign In</span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-12">
          <div>
            <Label value="Username" />
            <TextInput
              id="username"
              placeholder="ArysDomi"
              type="text"
              icon={FaUser}
              required
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
            />
          </div>
          <Button gradientDuoTone="purpleToBlue" type="submit" value="">
            Continue
          </Button>
          <Button gradientDuoTone="pinkToOrange" type="submit">
            <FaGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </form>
        <div className="flex gap-2 mt-5">
          <span>Do not have an account?</span>
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
