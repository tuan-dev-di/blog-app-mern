import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

import { Label, TextInput, Select, Button, Alert } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiInformationCircle } from "react-icons/hi";
import { SlLike } from "react-icons/sl";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { createPost } from "../../apis/post";

const CreatePost = () => {
  const filePicker = useRef();
  const navigate = useNavigate();

  const [createPostFail, setCreatePostFail] = useState(null);
  const [createPostSuccess, setCreatePostSuccess] = useState(null);

  const [formData, setFormData] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [postImageURL, setPostImageURL] = useState(null);
  const [postImageUploadProgress, setPostImageUploadProgress] = useState(null);
  const [postImageUploadError, setPostImageUploadError] = useState(null);
  // const [uploadedPostImage, setUploadedPostImage] = useState(null);

  //? ---------------| CHANGE IMAGE |---------------
  const handleChangePostImage = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // if (uploadedPostImage) await deleteFile(uploadedPostImage);

    setPostImage(file);
    setPostImageURL(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (postImage) uploadFile();
  }, [postImage]);

  // const deleteFile = async (fileURL) => {
  //   try {
  //     const storage = getStorage(app);
  //     const fileRef = ref(storage, fileURL);
  //     await deleteObject(fileRef);
  //   } catch (error) {
  //     console.log("ERROR Delete File:", error);
  //   }
  // };

  const uploadFile = async () => {
    setPostImageUploadError(null);
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
        console.log("ERROR Upload File:", error);
        setPostImageUploadError(
          "Couldn't upload file - Only get file JPEG, JPG, PNG, GIF - File must be less than 4MB"
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
  };

  //? ---------------| HANDLE CREATE POST |---------------
  // React Quill doesn't support id prop
  const handleCreatePost = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT CREATE |---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { ok, data } = await createPost(formData);
      if (!ok) {
        setCreatePostFail(data.message);
        return;
      }

      console.log("DATA:", data);
      setCreatePostSuccess("Your post is created");
      navigate(`/posts/${data.post.slug}`);

      setCreatePostFail(null);
    } catch (error) {
      console.log("ERROR - Create Post Fail:", error.message);
      setCreatePostFail(error);
    }
  };

  //? ---------------| ALERT |---------------
  let alertComponent;
  useEffect(() => {
    let timeout;
    if (createPostFail || createPostSuccess) {
      timeout = setTimeout(() => {
        setCreatePostFail(null);
        setCreatePostSuccess(null);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [createPostFail, createPostSuccess]);

  if (createPostFail) {
    alertComponent = (
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        {createPostFail}
      </Alert>
    );
  } else if (createPostSuccess) {
    alertComponent = (
      <Alert className="mt-5" color="success" icon={SlLike}>
        {createPostSuccess}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen p-7 mx-auto max-w-4xl">
      <div className="font-semibold text-center text-4xl my-7">
        <span>Create a new post</span>
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          {/* ---------------| TITLE & CATEGORY |--------------- */}
          <div>
            <div className="flex gap-4 sm:flex-row items-start">
              <div className="flex flex-col flex-1">
                <Label className="text-lg">
                  Title<span className="text-red-700 ml-1">*</span>
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
              <div className="flex flex-col flex-1">
                <Label className="text-lg">
                  Category<span className="text-red-700 ml-1">*</span>
                </Label>
                <Select
                  id="category"
                  className="flex-1"
                  onChange={handleCreatePost}
                >
                  <option value="uncategorized">
                    ----- Language | Framework -----
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
              Content<span className="text-red-700 ml-1">*</span>
            </Label>
            <ReactQuill
              theme="snow"
              placeholder="Enter your content"
              className="h-64 mb-10"
              onChange={(value) => {
                setFormData({
                  ...formData,
                  content: value,
                });
              }}
            />
          </div>

          {/* ---------------| POST IMAGE |--------------- */}
          <div>
            <Label className="text-lg">Image</Label>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChangePostImage}
                ref={filePicker}
                hidden
              />
              <div
                className="relative w-auto h-[600px] self-center cursor-pointer overflow-hidden shadow-xl"
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
                  {postImage ? (
                    <img
                      src={
                        postImageURL ||
                        "https://wordtracker-swoop-uploads.s3.amazonaws.com/uploads/ckeditor/pictures/1247/content_wordtracker_blog_article_image.jpg"
                      }
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </>
                  )}
                </div>
                {postImageUploadError && (
                  <Alert color="failure">${postImageUploadError}</Alert>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button className="mt-5" gradientDuoTone="purpleToBlue" type="submit">
          Publish
        </Button>
      </form>
      {alertComponent}
    </div>
  );
};

export default CreatePost;
