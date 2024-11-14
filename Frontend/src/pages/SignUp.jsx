import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    // Whole page Sign up
    <div className="min-h-screen mt-20">
      {/* Separate into 2 distinct columns */}
      <div className="flex p-3 max-w-3xl mx-auto">
        {/* Left side */}
        <div className="">
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
        <div className=""></div>
      </div>
    </div>
  );
};

export default SignUp;
