//? ---------------| IMPORT LIBRARIES |---------------
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";

//? ---------------| IMPORT COMPONENTS |---------------
import { SidebarApp } from "../../components/_index";
import { Label, TextInput, Button, Modal } from "flowbite-react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
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
import { UPLOAD_IMAGE } from "../../apis/auth";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id; // Get Id of user's account
  const loading = useSelector((state) => state.user.loading);
  const [formData, setFormData] = useState({});

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const filePicker = useRef();

  //? ---------------| HANDLE CHANGE IMAGE OF PROFILE USER |---------------
  const handleChangeProfileImage = (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // Check capacity of image from user - MAXIMUM 4MB
    const maxFile = 4 * 1024 * 1024;
    if (file.size > maxFile) {
      toast.error(
        "Không thể úp ảnh - Chỉ nhận loại tệp JPEG, JPG, PNG, GIF - Tệp phải có dung lượng nhỏ hơn 4MB",
        { theme: "colored" }
      );
      return;
    }

    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

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
    setModalOpen(false);

    try {
      let imagePreview = null;
      if (profileImage) {
        const imageData = new FormData();
        imageData.append("file", profileImage);

        imagePreview = await UPLOAD_IMAGE(imageData);

        if (!imagePreview) {
          toast.error("Không nhận được ảnh từ người dùng", {
            theme: "colored",
          });
          setProfileImage(null);
          setProfileImagePreview(null);
          return;
        }

        setProfileImagePreview(imagePreview.url);
      }

      const profileDataChanges = {};
      if (formData.email && formData.email !== curUser.user.email)
        profileDataChanges.email = formData.email;
      if (
        formData.displayName &&
        formData.displayName !== curUser.user.displayName
      )
        profileDataChanges.displayName = formData.displayName;
      if (formData.password && formData.password !== curUser.user.password)
        profileDataChanges.password = formData.password;
      if (imagePreview && imagePreview.url !== curUser.user.profileImage)
        profileDataChanges.profileImage = imagePreview.url;

      if (Object.keys(profileDataChanges).length === 0) {
        toast.warn("Không có gì thay đổi!", { theme: "colored" });
        return;
      }

      dispatch(updateUserStart());
      const { ok, data } = await UPDATE_ACCOUNT(userId, profileDataChanges);
      if (!ok) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message, { theme: "colored" });
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("Cập nhật hồ sơ thành công!", { theme: "colored" });
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE DELETE ACCOUNT |---------------
  const handleDeleteUser = async () => {
    setModalOpen(false);
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <div className="relative md:mx-auto p-7 w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex flex-col justify-between items-center gap-5">
          <div className="font-semibold text-5xl my-5">Thông Tin Cá Nhân</div>
          <form
            className="flex flex-col md:flex-row w-full"
            onSubmit={handleSubmit}
          >
            <div className="md:w-1/2 flex flex-col items-center">
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
                className="relative w-auto h-96 self-center cursor-pointer shadow-lg overflow-hidden border-none mt-7"
                onClick={() => filePicker.current.click()}
              >
                <img
                  src={profileImagePreview || curUser.user.profileImage}
                  defaultValue={curUser.profileImage}
                  alt={curUser.displayName}
                  className={"rounded-full w-full h-full"}
                />
              </button>
              <p className="my-4 text-center text-2xl">
                <strong>{curUser.user.displayName}</strong>
              </p>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-y-4">
              {/* ---------------| ROLE |--------------- */}
              <div className="flex items-center gap-4 max-w-2xl">
                <Label className="text-base" value="Chức vụ:" />
                <span
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    curUser.user.role === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {curUser.user.role}
                </span>
              </div>
              {/* ---------------| USERNAME |--------------- */}
              <div className="max-w-2xl">
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
              <div className="max-w-2xl">
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
              {/* ---------------| DISPLAY NAME |--------------- */}
              <div className="max-w-2xl">
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
              {/* ---------------| PASSWORD |--------------- */}
              <div className="max-w-2xl">
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
                <ul className="list-disc  ml-4 p-3 text-sm ">
                  <li>Mật khẩu tối thiểu phải đạt 8 ký tự</li>
                  <li>Chứa ít nhật 1 ký tự đặc biệt</li>
                  <li>Chứa ít nhật 1 ký tự số</li>
                  <li>Chứa ít nhất 1 ký tự chữ viết hoa</li>
                  <li>Chứa ít nhất 1 ký tự chữ viết thường</li>
                </ul>
              </div>
            </div>
          </form>

          {/* <div className="flex flex-col justify-center gap-4 mt-4"> */}
          <div className="flex flex-col justify-center items-center gap-4 mt-5">
            {/* Button submit Update Account */}
            <Button
              className="w-96"
              gradientDuoTone="greenToBlue"
              type="submit"
              onClick={() => {
                setModalOpen(true);
                setModalType("update");
              }}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
            {/* Button submit Delete Account */}
            <Button
              className="w-96"
              color="failure"
              type="submit"
              popup
              onClick={() => {
                setModalOpen(true);
                setModalType("delete");
              }}
            >
              Xóa tài khoản
            </Button>
          </div>
        </div>

        {/* Modal to confirm Delete Account --- SEVERE */}
        <Modal
          show={modalOpen}
          size="md"
          // onClose={() => setDeleteModal(false)}
          onClose={() => setModalOpen(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-600 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {modalType === "delete"
                  ? "Bạn có chắc là muốn xóa tài khoản này?"
                  : "Bạn có chắc là muốn cập nhật tài khoản này?"}
              </h3>
              <div className="flex justify-center gap-4">
                {modalType === "delete" ? (
                  <Button color="failure" onClick={handleDeleteUser}>
                    Có, xóa đi!
                  </Button>
                ) : (
                  <Button color="info" onClick={handleSubmit}>
                    Có, cập nhật!
                  </Button>
                )}
                <Button color="gray" onClick={() => setModalOpen(false)}>
                  Không
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
