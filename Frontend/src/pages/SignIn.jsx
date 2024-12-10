import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label, TextInput, Button, Spinner, Alert } from "flowbite-react";
import { FaUser, FaLock } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { signIn } from "../apis/auth";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // let alertComponent = null;

  // if (errorMessage) {
  //   alertComponent = (
  //     <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
  //       {errorMessage}
  //     </Alert>
  //   );
  // }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const { ok, data } = await signIn(formData);
      if (!ok) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    // Whole page Sign-in
    <div className="min-h-screen mt-7">
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
          <p className="font-sans text-center">Or</p>
          <OAuth></OAuth>
        </form>
        <div className="flex gap-2 mt-5 text-base">
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
          <span>if you do not have an account!</span>
        </div>
        {/* {alertComponent} */}
      </div>
    </div>
  );
};

export default SignIn;
