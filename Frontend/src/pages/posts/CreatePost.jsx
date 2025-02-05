//? ==================== IMPORT REACT LIBRARY ====================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//? ==================== IMPORT FIREBASE ====================
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

//? ==================== IMPORT FLOWBITE COMPONENT ====================
import {
  Label,
  TextInput,
  Select,
  FileInput,
  Button,
  Alert,
  // Spinner,
} from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { SlLike } from "react-icons/sl";

//? ==================== IMPORT REACT QUILL ====================
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPost } from "../../apis/post";

const CreatePost = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const [postImage, setPostImage] = useState(null);
  const [postImageUploadProgress, setPostImageUploadProgress] = useState(null);
  const [postImageUploadLoading, setPostImageUploadLoading] = useState(null);
  const [postImageUploadError, setPostImageUploadError] = useState(null);
  // const [postImageUploadSuccess, setPostImageUploadSuccess] = useState(null);

  const [createSuccess, setCreateSuccess] = useState(null);
  const [createFail, setCreateFail] = useState(null);

  // -------------------- HANDLE UPLOAD POST's IMAGE --------------------
  const handleChangeImagePost = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file); // Đọc file và chuyển sang DataURL
    } else {
      setPostImageUploadError("Please select an image!");
      return;
    }

    try {
      setPostImageUploadError(null);

      const storage = getStorage(app);
      const imagePostName = new Date().getTime() + "_" + fileName;
      const storageRef = ref(storage, imagePostName);
      const uploadFileTask = uploadBytesResumable(storageRef, file);
      uploadFileTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPostImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log("ERROR Upload file for Post:", error);
          setPostImageUploadError(
            "Couldn't upload file - Only get file JPEG, JPG, PNG, GIF - File must be less than 4MB"
          );
          setPostImage(null);
          setPostImageUploadLoading(null);
          setPostImageUploadProgress(null);
        },
        async () => {
          getDownloadURL(uploadFileTask.snapshot.ref).then((downloadURL) => {
            setPostImageUploadLoading(null);
            setPostImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      console.log("ERROR:", error);
      setPostImageUploadError("Image's Post upload failed");
      setPostImageUploadProgress(null);
    }
  };

  // -------------------- HANDLE CREATE POST --------------------
  // ReactQuill doesn't support prop Id
  // Post's image upload with another handle
  const handleCreatePost = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { ok, data } = await createPost(formData);
      if (!ok) {
        setCreateFail(data.message);
        return;
      }

      setCreateSuccess("Your post is created!");
      navigate(`/posts/${data.post.slug}`);

      setCreateFail(null);
    } catch (error) {
      setCreateFail(error.message);
    }
  };

  // -------------------- ALERT --------------------
  let alertComponent = null;
  useEffect(() => {
    let timeout;
    if (createFail || createSuccess) {
      timeout = setTimeout(() => {
        setCreateFail(null);
        setCreateSuccess(null);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [createFail, createSuccess]);

  if (createFail) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {createFail}
      </Alert>
    );
  } else if (createSuccess) {
    alertComponent = (
      <Alert className="mt-5" color="success" icon={SlLike}>
        {createSuccess}
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-7 min-h-screen">
      <h1 className="text-center text-4xl my-7 font-semibold">
        Create a new post
      </h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <div>
            <div className="flex gap-4 sm:flex-row items-start">
              {/* -------------------- TITLE -------------------- */}
              <div className="flex flex-col flex-1">
                <Label className="text-base">
                  Title<span className="text-red-500 ml-1">*</span>
                </Label>
                <TextInput
                  id="title"
                  type="text"
                  className="flex-1 w-[500px]"
                  placeholder="Enter a title"
                  onChange={handleCreatePost}
                  required
                />
              </div>

              {/* -------------------- CATEGORY -------------------- */}
              <div className="flex flex-col flex-1">
                <Label className="text-base">
                  Category<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  id="category"
                  className="flex-1"
                  onChange={handleCreatePost}
                >
                  <option value="uncategorized">
                    ----- Language | Framework -----
                  </option>
                  <option value="javascript-reactjs">
                    JavaScript | ReactJS
                  </option>
                  <option value="javascript-vuejs">JavaScript | VueJS</option>
                  <option value="javascript-nodejs">JavaScript | NodeJS</option>
                  <option value="golang-gin">GoLang | Gin</option>
                  <option value="golang-echo">GoLang | Echo</option>
                  <option value="golang-fiber">GoLang | Fiber</option>
                </Select>
              </div>
            </div>
          </div>

          {/* -------------------- CONTENT -------------------- */}
          <div>
            <Label className="text-base">
              Content<span className="text-red-500 ml-1">*</span>
            </Label>
            <ReactQuill
              id="content"
              theme="snow"
              placeholder="Enter your content"
              className="h-56 mb-10"
              onChange={(value) => {
                setFormData({
                  ...formData,
                  content: value,
                });
              }}
              required
            />
          </div>

          {/* -------------------- IMAGE -------------------- */}
          <div>
            <Label className="text-base">
              Image<span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="w-full items-center justify-center">
              <Label
                htmlFor="dropzone-file"
                className="flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5 h-80 w-full">
                  {postImage ? (
                    <img
                      src={postImage}
                      alt="Selected Image"
                      className="h-96 w-full object-cover rounded-lg"
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </>
                  )}
                </div>
                <FileInput
                  id="dropzone-file"
                  className="hidden"
                  onChange={handleChangeImagePost}
                  accept="image/*" // Chỉ cho phép file ảnh
                  required
                />
              </Label>
            </div>
          </div>
        </div>
        <Button
          className="mt-5"
          gradientDuoTone="purpleToBlue"
          type="submit"
          disabled={postImageUploadLoading}
        >
          {postImageUploadLoading ? "Loading ..." : "Publish"}
        </Button>
        {postImageUploadError && (
          <Alert color="failure">{postImageUploadError}</Alert>
        )}
      </form>
      {alertComponent}
    </div>
  );
};

export default CreatePost;
