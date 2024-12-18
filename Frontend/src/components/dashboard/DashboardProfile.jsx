import { useSelector } from "react-redux";
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
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashboardProfile = () => {
  const curUser = useSelector((state) => state.user.currentUser.user);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUploadProgress, setProfileImageUploadProgress] =
    useState(null);
  const [profileImageUploadError, setProfileImageUploadError] = useState(null);
  const filePicker = useRef();

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
    const storage = getStorage(app);
    const fileNameUpload = profileImageFile.name;
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
      },
      () => {
        getDownloadURL(uploadFileTask.snapshot.ref).then((downloadURL) => {
          setProfileImageFile(downloadURL);
        });
      }
    );
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <form className="flex flex-col gap-2">
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
