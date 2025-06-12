//? ---------------| IMPORT LIBRARIES |---------------
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";

//? ---------------| IMPORT GOOGLE SERVICES |---------------
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Button, Modal } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import { DELETE_ACCOUNT, UPDATE_ACCOUNT } from "../../apis/user";

const DetailAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id; // Get Id of user's account
  const loading = useSelector((state) => state.user.loading);
  const [formData, setFormData] = useState({});

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUploadProgress, setProfileImageUploadProgress] =
    useState(null);
  const [profileImageUploading, setProfileImageUploading] = useState(null);
  const filePicker = useRef();

  //? ---------------| HANDLE CHANGE IMAGE OF PROFILE USER |---------------
  const handleChangeProfileImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  //? ---------------| UPLOAD FILE IMAGE ON UI |---------------
  const uploadFile = useCallback(async () => {
    const storage = getStorage(app);
    const fileNameUpload = profileImageFile.name;
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
        console.log("Upload file error:", error);
        toast.error(
          "Không thể úp ảnh - Chỉ nhận loại tệp JPEG, JPG, PNG, GIF - Tệp phải có dung lượng nhỏ hơn 4MB",
          { theme: "colored" }
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
  }, [profileImageFile]);

  useEffect(() => {
    if (profileImageFile) uploadFile();
  }, [profileImageFile, uploadFile]);

  //? ---------------| HANDLE GET ATTRIBUTE TO UPDATE ACCOUNT |---------------
  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT UPDATE |---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileImageUploading) {
      toast.error("Vui lòng chờ ảnh đại diện úp lên!", {
        theme: "colored",
      });
      return;
    }

    if (Object.keys(formData).length === 0) {
      toast.warn("Không có gì thay đổi!", { theme: "colored" });
      return;
    }

    try {
      dispatch(updateUserStart());
      const { ok, data } = await UPDATE_ACCOUNT(userId, formData);
      if (!ok) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message, { theme: "colored" });
        return;
      }

      dispatch(updateUserSuccess(data));
      setProfileImageUploadProgress(false);
      toast.success("Cập nhật hồ sơ thành công!", { theme: "colored" });
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE DELETE ACCOUNT |---------------
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteUser = async () => {
    setDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      const { ok, data } = await DELETE_ACCOUNT(userId, formData);

      if (!ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message, { theme: "colored" });
        return;
      }

      dispatch(deleteUserSuccess(data));
      toast.success("Xóa tài khoản thành công!", { theme: "colored" });

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        navigate("/sign-in");
      });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE SHOW PASSWORD |---------------
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Whole page Detail Account
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col gap-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Form Update Account*/}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* ---------------| CHANGE IMAGE |--------------- */}
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeProfileImage}
          ref={filePicker}
          hidden
        />
        <button
          type="button"
          className="relative w-60 h-60 self-center cursor-pointer shadow-lg overflow-hidden rounded-full mt-7"
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
        </button>
        <p className="my-4 text-center text-2xl">
          <strong>{curUser.user.displayName}</strong>
        </p>

        {/* ---------------| USERNAME |--------------- */}
        <div>
          <Label className="text-base" value="Tên tài khoản" />
          <TextInput
            id="username"
            defaultValue={curUser.user.username}
            placeholder={curUser.user.username}
            type="text"
            icon={FaUser}
            disabled
          />
        </div>

        {/* ---------------| EMAIL |--------------- */}
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

        {/* ---------------| PASSWORD |--------------- */}
        <div>
          <Label className="text-base" value="Mật khẩu" />
          <div className="relative">
            <TextInput
              id="password"
              placeholder="Đổi mật khẩu"
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

        {/* ---------------| DISPLAY NAME |--------------- */}
        <div>
          <Label className="text-base" value="Tên hiển thị" />
          <TextInput
            id="displayName"
            defaultValue={curUser.user.displayName}
            placeholder={curUser.user.displayName}
            type="text"
            icon={MdEdit}
            onChange={handleUpdate}
          />
        </div>

        {/* Button submit Update Account */}
        <Button
          gradientDuoTone="greenToBlue"
          className="mt-3"
          type="submit"
          disabled={loading || profileImageUploading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>

      {/* Button submit Delete Account */}
      <Button
        color="failure"
        className="mt-3"
        type="submit"
        onClick={() => setDeleteModal(true)}
      >
        Xóa tài khoản
      </Button>

      {/* Modal to confirm Delete Account --- SEVERE */}
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
              Bạn có chắc là muốn xóa tài khoản này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Có, xóa đi!
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailAccount;
