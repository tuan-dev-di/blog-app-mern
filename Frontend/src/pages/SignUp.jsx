import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";

const SignUp = () => {
  return (
    // Whole page Sign up
    <div className="min-h-screen mt-20">
      {/* Separate into 2 distinct columns */}
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left side */}
        <div className="flex-1">
          <Link to="/" className="font-semibold dark:text-white text-4xl">
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-indigo-700 to-pink-400 rounded-lg text-white">
              Arys Domi
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is my demo project, you can sign up with Username and Password
            or you can continue with Google account.
          </p>
        </div>
        {/* Right side */}
        <div className="flex-1">
          <form action="sign-up" className="flex flex-col gap-5">
            <div>
              <Label value="Email" />
              <TextInput id="email" placeholder="email@mail.com" type="email" />
            </div>
            <div>
              <Label value="Username" />
              <TextInput id="username" placeholder="ArysDomi" type="text" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput id="password" placeholder="Password" type="password" />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit" value="">
              Continue
            </Button>
          </form>
          <div className="flex gap-2 mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
