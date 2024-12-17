import { useSelector } from "react-redux";
import { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";

const DashboardProfile = () => {
  const curUser = useSelector((state) => state.user.currentUser.user);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <form className="flex flex-col gap-2">
        <div className="w-48 h-48 self-center cursor-pointer shadow-lg overflow-hidden rounded-full ">
          <img
            src={curUser.profileImage}
            alt={curUser.displayName}
            className="rounded-full w-full h-full "
          />
        </div>
        <p className="my-4 text-center text-2xl">
          <strong>{curUser.displayName}</strong>
        </p>
        <div>
          <Label className="text-base" value="Username" />
          <TextInput
            id="username"
            placeholder={curUser.username}
            type="text"
            icon={FaUser}
            disabled
          />
        </div>
        <div>
          <Label className="text-base" value="Email" />
          <TextInput
            id="email"
            placeholder={curUser.email}
            type="email"
            icon={MdEmail}
            // disabled
          />
        </div>
        <div>
          <Label className="text-base" value="Password" />
          <div className="relative">
            <TextInput
              id="password"
              placeholder="Change Password"
              type={showPassword ? "text" : "password"}
              icon={FaLock}
              className="bg-gray-100 focus:ring focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={toggleShowPassword}
              // className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 bg-inherit hover:bg-transparent"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 bg-gray-100 hover:bg-gray-100 focus:ring focus:ring-blue-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-base" value="Display Name" />
          <TextInput
            id="displayName"
            placeholder={curUser.displayName}
            type="text"
            icon={MdEdit}
          />
        </div>
        <Button gradientDuoTone="greenToBlue" className="mt-3" type="submit">
          Update Profile
        </Button>
        <Button color="failure" className="mt-3" type="submit">
          Delete Account
        </Button>
      </form>
    </div>
  );
};

export default DashboardProfile;
