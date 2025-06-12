//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//? ---------------| IMPORT GOOGLE SERVICES |---------------
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Select, Button, Tooltip } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosArrowRoundBack } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { UPDATE_POST, GET_POST_TO_UPDATE } from "../../apis/post";

const DetailPost = () => {
  const filePicker = useRef();

  const [formData, setFormData] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [postImageURL, setPostImageURL] = useState(null);
  const [postImageUploadProgress, setPostImageUploadProgress] = useState(null);

  const { postId } = useParams();

  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  //? ---------------| HANDLE GET DETAIL OF POST |---------------
  const get_post_to_update = useCallback(async () => {
    try {
      const data = await GET_POST_TO_UPDATE(postId);

      if (!data) {
        toast.error(data.message, { theme: "colored" });
      }
      setFormData(data.posts[0]);
    } catch (error) {
      console.log("ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [postId]);

  useEffect(() => {
    if (role === "admin") get_post_to_update();
  }, [role, get_post_to_update]);

  //? ---------------| HANDLE CHANGE IMAGE OF POST |---------------
  const handleChangePostImage = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    setPostImage(file);
    setPostImageURL(URL.createObjectURL(file));
  };

  //? ---------------| UPLOAD FILE IMAGE ON UI |---------------
  const uploadFile = useCallback(async () => {
    if (!postImage) return;

    const storage = getStorage(app);
    const fileUploadName = postImage.name;
    const fileName = new Date().getTime() + "_" + fileUploadName;
    const storageRef = ref(storage, fileName);
    const uploadFileTask = uploadBytesResumable(storageRef, postImage);
    uploadFileTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPostImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log("Upload file error:", error);
        toast.error(
          "Không thể úp ảnh - Chỉ nhận loại tệp JPEG, JPG, PNG, GIF - Tệp phải có dung lượng nhỏ hơn 4MB",
          { theme: "colored" }
        );
        setPostImage(null);
        setPostImageURL(null);
        setPostImageUploadProgress(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadFileTask.snapshot.ref);
        setPostImageURL(downloadURL);
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: downloadURL,
        }));
      }
    );
  }, [postImage]);

  useEffect(() => {
    if (postImage) uploadFile();
  }, [postImage, uploadFile]);

  //? ---------------| HANDLE GET ATTRIBUTE TO UPDATE POST |---------------
  // React Quill doesn't support id prop
  const handleUpdatePost = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT UPDATE |---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { ok, data } = await UPDATE_POST(postId, userId, formData);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Cập nhật bài viết thành công!", { theme: "colored" });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log("Update post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| FORMAT DATE TIME |---------------
  const formatDateTime = (dateString) => {
    const dateObject = new Date(dateString);

    const time = dateObject.toLocaleDateString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${time}`;
  };

  const postCreated = formatDateTime(formData?.createdAt);
  const postUpdated = formatDateTime(formData?.updatedAt);

  return (
    // Whole page Update Post
    <div className="min-h-screen p-7 mx-auto max-w-4xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top site to notice */}
      <div className="flex justify-between items-center my-7">
        <div className="font-semibold text-4xl">
          <span>Cập nhật bài viết</span>
        </div>
        <div className="flex gap-2">
          <Link to="/posts/get-posts">
            <Button className="border-2 shadow-md" color="none">
              <IoIosArrowRoundBack className="mr-2 h-5 w-5" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col italic gap-2 mb-2 text-right text-gray-400 text-sm">
        <span>Tạo vào: {postCreated}</span>
        <span>Cập nhật vào: {postUpdated}</span>
      </div>

      {/* Form Update Post*/}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          {/* ---------------| TITLE & CATEGORY |--------------- */}
          <div>
            <div className="flex gap-4 sm:flex-row items-start">
              <div className="flex flex-col flex-1">
                <Label className="text-lg">
                  Tiêu đề
                  <Tooltip
                    content="Bắt buộc"
                    style="light"
                    placement="right"
                    trigger="hover"
                  >
                    <span className="text-red-500 ml-1">*</span>
                  </Tooltip>
                </Label>
                <TextInput
                  id="title"
                  type="text"
                  className="flex-1 w-[500px]"
                  placeholder="Nhập tiêu đề"
                  onChange={handleUpdatePost}
                  value={formData?.title || ""}
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label className="text-lg">Thể loại</Label>
                <Select
                  id="category"
                  className="flex-1"
                  onChange={handleUpdatePost}
                  value={formData?.category || ""}
                >
                  <option value="uncategorized">
                    --- Ngôn ngữ | Framework ---
                  </option>
                  <option value="javascript-vuejs">JavaScript | VueJS</option>
                  <option value="javascript-reactjs">
                    JavaScript | ReactJS
                  </option>
                  <option value="javascript-nodejs">JavaScript | NodeJS</option>
                  <option value="golang-gin">GoLang | Gin</option>
                  <option value="golang-echo">GoLang | Echo</option>
                  <option value="golang-fiber">GoLang | Fiber</option>
                </Select>
              </div>
            </div>
          </div>

          {/* ---------------| CONTENT |--------------- */}
          <div>
            <Label className="text-lg">
              Nội dung bài viết
              <Tooltip
                content="Bắt buộc"
                style="light"
                placement="right"
                trigger="hover"
              >
                <span className="text-red-500 ml-1">*</span>
              </Tooltip>
            </Label>
            <ReactQuill
              theme="snow"
              placeholder="Nhập nội dung bài viết của bạn"
              className="h-64 mb-10"
              value={formData?.content || ""}
              onChange={(value) => {
                setFormData({
                  ...formData,
                  content: value,
                });
              }}
            />
          </div>

          {/* ---------------| POST'S IMAGE |--------------- */}
          <div>
            <Label className="text-lg">Ảnh minh họa</Label>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChangePostImage}
                ref={filePicker}
                hidden
              />
              <button
                type="button"
                className="relative w-full h-[600px] self-center cursor-pointer overflow-hidden shadow-xl"
                onClick={() => filePicker.current.click()}
              >
                {postImageUploadProgress && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-60 h-60">
                      <CircularProgressbar
                        value={postImageUploadProgress || 0}
                        text={`${postImageUploadProgress}%`}
                        strokeWidth={3}
                        styles={{
                          root: {
                            width: "100%",
                            height: "100%",
                          },
                          path: {
                            stroke: `rgba(62, 152, 199, ${
                              postImageUploadProgress / 100
                            })`,
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center pb-6 pt-5 h-full w-full  border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  {formData?.image ? (
                    <img
                      src={formData?.image || postImageURL}
                      alt="Selected post"
                      className={`w-full h-full ${
                        postImageUploadProgress &&
                        postImageUploadProgress < 100 &&
                        "opacity-60"
                      }`}
                    />
                  ) : (
                    <>
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Nhấp hoặc kéo hoặc thả hình ảnh vào khung này
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG hoặc GIF
                      </p>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
        <Button className="mt-5" gradientDuoTone="purpleToBlue" type="submit">
          Cập nhật bài viết này
        </Button>
      </form>
    </div>
  );
};

export default DetailPost;
