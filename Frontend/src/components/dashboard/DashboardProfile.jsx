import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { Label, TextInput, Button, Alert } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import { SlLike } from "react-icons/sl";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../redux/user/userSlice";
import { updateProfile } from "../../apis/user";

const DashboardProfile = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const curUser = useSelector((state) => state.user.currentUser.user);

  // Update Success
  const [updateSuccessUser, setUpdateSuccessUser] = useState(null);
  // Update Failure
  const [updateFailUser, setUpdateFailUser] = useState(null);
  // User input image file from their computer
  const [profileImageFile, setProfileImageFile] = useState(null);
  // User input image file by link
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  // Progress of Image when user upload their image
  const [profileImageUploadProgress, setProfileImageUploadProgress] =
    useState(null);
  // Error notification when user use invalid file
  const [profileImageUploading, setProfileImageUploading] = useState(null);
  // Error notification when user use invalid file
  const [profileImageUploadError, setProfileImageUploadError] = useState(null);
  // Use for reference: tag img can use like tag input
  const filePicker = useRef();

  //? Get a new image file/URL from user
  const handleChangeProfileImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (profileImageFile) uploadFile();
  }, [profileImageFile]);

  const uploadFile = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read: if request.auth != null
    //       allow write: if
    //       request.resource.size < 4 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setProfileImageUploadError(null);

    // Using storage of Firebase
    const storage = getStorage(app);
    // Get name of file
    const fileNameUpload = profileImageFile.name;
    // Create a new name for file image to store on firebase with date and time currently
    const fileName = new Date().getTime() + fileNameUpload;

    const storageRef = ref(storage, fileName);
    const uploadFileTask = uploadBytesResumable(storageRef, profileImageFile);
    uploadFileTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProfileImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log("ERROR Upload File:", error);
        setProfileImageUploadError(
          "Couldn't upload file - Only get file JPEG, JPG, PNG, GIF - File must be less than 4MB"
        );
        setProfileImageUploadProgress(null);
        setProfileImageUploading(null);
        setProfileImageFile(null);
        setProfileImageUrl(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadFileTask.snapshot.ref);
        setProfileImageUrl(downloadURL);

        setFormData((prevFormData) => ({
          ...prevFormData,
          profileImage: downloadURL,
        }));
        setProfileImageUploading(false);
      }
    );
  };

  //? Update profile of User
  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateFailUser(null);
    setUpdateSuccessUser(null);

    if (profileImageUploading) {
      setUpdateFailUser("Please wait for the profile image to be uploaded");
      return;
    }

    if (Object.keys(formData).length === 0) {
      setUpdateFailUser("Nothing changes");
      return;
    }

    try {
      dispatch(updateStart());
      const userId = curUser._id;
      const { ok, data } = await updateProfile(userId, formData);
      if (!ok) {
        dispatch(updateFailure(data.message));
        setUpdateFailUser(data.message);
        return;
      }

      dispatch(updateSuccess(data));
      setProfileImageUploadProgress(false);
      setUpdateSuccessUser("Your profile has been updated!");
      setTimeout(() => {
        navigate("/dashboard?tab=profile");
      }, 1500);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateFailUser(error.message);
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
    if (updateFailUser || updateSuccessUser) {
      timeout = setTimeout(() => {
        setUpdateFailUser(null);
        setUpdateSuccessUser(null);
      }, 7000); // After 7s, alert will be disappear
    }
    return () => clearTimeout(timeout);
  }, [updateFailUser, updateSuccessUser]);

  if (updateFailUser) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {updateFailUser}
      </Alert>
    );
  } else if (updateSuccessUser) {
    alertComponent = (
      <Alert className="mt-5" color="success" icon={SlLike}>
        {updateSuccessUser}
      </Alert>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeProfileImage}
          ref={filePicker}
          hidden
        />
        <div
          className="relative w-48 h-48 self-center cursor-pointer shadow-lg overflow-hidden rounded-full"
          onClick={() => filePicker.current.click()}
        >
          {profileImageUploadProgress && (
            <CircularProgressbar
              value={profileImageUploadProgress || 0}
              text={`${profileImageUploadProgress}%`}
              strokeWidth={3}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    profileImageUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={profileImageUrl || curUser.profileImage}
            defaultValue={curUser.profileImage}
            alt={curUser.displayName}
            className={`rounded-full w-full h-full ${
              profileImageUploadProgress &&
              profileImageUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {profileImageUploadError && (
          <Alert color="failure">{profileImageUploadError}</Alert>
        )}
        <p className="my-4 text-center text-2xl">
          <strong>{curUser.displayName}</strong>
        </p>
        <div>
          <Label className="text-base" value="Username" />
          <TextInput
            id="username"
            defaultValue={curUser.username}
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
            defaultValue={curUser.email}
            placeholder={curUser.email}
            type="email"
            icon={MdEmail}
            onChange={handleUpdate}
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
              onChange={handleUpdate}
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
          <Label className="text-base" value="Display Name" />
          <TextInput
            id="displayName"
            defaultValue={curUser.displayName}
            placeholder={curUser.displayName}
            type="text"
            icon={MdEdit}
            onChange={handleUpdate}
          />
        </div>
        <Button gradientDuoTone="greenToBlue" className="mt-3" type="submit">
          Update Profile
        </Button>
        <Button color="failure" className="mt-3" type="submit">
          Delete Account
        </Button>
      </form>
      {alertComponent}
    </div>
  );
};

export default DashboardProfile;
