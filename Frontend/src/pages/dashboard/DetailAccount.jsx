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
import { Label, TextInput, Button, Alert, Modal } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";
import {
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { SlLike } from "react-icons/sl";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import { deleteAccount, updateAccount } from "../../apis/user";

const DetailAccount = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const curUser = useSelector((state) => state.user.currentUser);
  const loading = useSelector((state) => state.user.loading);

  const userId = curUser.user._id; // Get Id of user's account
  // const token = curUser.accessToken;

  //* ----------------------------------- UPDATE situation
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateFail, setUpdateFail] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUploadProgress, setProfileImageUploadProgress] =
    useState(null);
  const [profileImageUploading, setProfileImageUploading] = useState(null);
  const [profileImageUploadError, setProfileImageUploadError] = useState(null);
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

  //? Upload file image from user to UI
  const uploadFile = async () => {
    setProfileImageUploadError(null);

    // Using storage of Firebase
    const storage = getStorage(app);
    // Get name of file
    const fileNameUpload = profileImageFile.name;
    // Create a new name for file image to store on firebase with date and time currently
    const fileName = new Date().getTime() + "_" + fileNameUpload;

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

  //? Update account of User
  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateFail(null);
    setUpdateSuccess(null);

    if (profileImageUploading) {
      setUpdateFail("Please wait for the profile image to be uploaded");
      return;
    }

    if (Object.keys(formData).length === 0) {
      setUpdateFail("Nothing changes");
      return;
    }

    try {
      dispatch(updateUserStart());
      const { ok, data } = await updateAccount(userId, formData);
      if (!ok) {
        dispatch(updateUserFailure(data.message));
        setUpdateFail(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      setProfileImageUploadProgress(false);
      setUpdateSuccess("Your profile has been updated!");
      navigate("/dashboard?tab=profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateFail(error.message);
    }
  };

  //* ----------------------------------- DELETE situation
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [deleteFail, setDeleteFail] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  //? Delete account of User
  const handleDeleteUser = async () => {
    setDeleteSuccess(false);
    setDeleteFail(false);
    setDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      const { ok, data } = await deleteAccount(userId, formData);
      console.log(data);

      if (!ok) {
        dispatch(deleteUserFailure(data.message));
        setDeleteFail(data.message);
        return;
      }

      dispatch(deleteUserSuccess(data));
      setDeleteSuccess("Your account has been deleted");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setDeleteFail(error.message);
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
    if (updateFail || updateSuccess || deleteFail || deleteSuccess) {
      timeout = setTimeout(() => {
        setUpdateFail(null);
        setUpdateSuccess(null);
        setDeleteFail(null);
        setDeleteSuccess(null);
      }, 3000); // After 3s, alert will be disappear
    }
    return () => clearTimeout(timeout);
  }, [updateFail, updateSuccess, deleteFail, deleteSuccess]);

  if (updateFail) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {updateFail}
      </Alert>
    );
  } else if (updateSuccess) {
    alertComponent = (
      <Alert className="mt-5" color="success" icon={SlLike}>
        {updateSuccess}
      </Alert>
    );
  } else if (deleteFail) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {deleteFail}
      </Alert>
    );
  } else if (deleteSuccess) {
    alertComponent = (
      <Alert className="mt-5" color="success" icon={SlLike}>
        {deleteSuccess}
      </Alert>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col gap-2">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeProfileImage}
          ref={filePicker}
          hidden
        />
        <div
          className="relative w-52 h-52 self-center cursor-pointer shadow-lg overflow-hidden rounded-full mt-7"
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
            src={profileImageUrl || curUser.user.profileImage}
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
          <strong>{curUser.user.displayName}</strong>
        </p>
        <div>
          <Label className="text-base" value="Username" />
          <TextInput
            id="username"
            defaultValue={curUser.user.username}
            placeholder={curUser.user.username}
            type="text"
            icon={FaUser}
            disabled
          />
        </div>
        <div>
          <Label className="text-base" value="Email" />
          <TextInput
            id="email"
            defaultValue={curUser.user.email}
            placeholder={curUser.user.email}
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
            defaultValue={curUser.user.displayName}
            placeholder={curUser.user.displayName}
            type="text"
            icon={MdEdit}
            onChange={handleUpdate}
          />
        </div>
        <Button
          gradientDuoTone="greenToBlue"
          className="mt-3"
          type="submit"
          disabled={loading || profileImageUploading}
        >
          {/* Update Account */}
          {loading ? "Loading..." : "Update Account"}
        </Button>
      </form>
      <Button
        color="failure"
        className="mt-3"
        type="submit"
        onClick={() => setDeleteModal(true)}
      >
        Delete Account
      </Button>
      {/* <div className="text-blue-600 flex justify-between mt-5">
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div> */}
      <Modal
        show={deleteModal}
        size="md"
        onClose={() => setDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 " />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {alertComponent}
    </div>
  );
};

export default DetailAccount;
