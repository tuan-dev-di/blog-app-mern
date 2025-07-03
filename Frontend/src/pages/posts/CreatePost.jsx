//? ---------------| IMPORT LIBRARIES |---------------
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Select, Button, Tooltip } from "flowbite-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { CREATE_POST } from "../../apis/post";
import { UPLOAD_IMAGE } from "../../apis/auth";

const CreatePost = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;

  const filePicker = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  //? ---------------| HANDLE CHANGE IMAGE OF POST |---------------
  const handleChangePostImage = async (e) => {
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

    setPostImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  //? ---------------| HANDLE GET ATTRIBUTE TO CREATE POST |---------------
  // React Quill doesn't support id prop
  const handleCreatePost = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  //? ---------------| HANDLE SUBMIT CREATE POST|---------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imagePreview = null;

    try {
      if (postImage) {
        const imageData = new FormData();
        imageData.append("file", postImage);

        imagePreview = await UPLOAD_IMAGE(imageData);
        if (!imagePreview) {
          toast.error("Không nhận được ảnh từ người dùng", {
            theme: "colored",
          });
          setPostImage(null);
          setPreviewImage(null);
          return;
        }

        setPreviewImage(imagePreview.url);
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: imagePreview.url,
        }));
      }

      const updateFormData = {
        ...formData,
        image: imagePreview.url,
      };

      const { ok, data } = await CREATE_POST(userId, updateFormData);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Tạo bài viết mới thành công!", { theme: "colored" });
      setTimeout(() => {
        navigate("/posts/get-posts");
      }, 3000);
    } catch (error) {
      console.log("Create post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    // Whole page Create Post
    <div className="min-h-screen p-7 mx-auto max-w-4xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top site to notice */}
      <div className="flex justify-between items-center my-7">
        <div className="font-semibold text-4xl">
          <span>Tạo mới bài viết</span>
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

      {/* Form Create Post*/}
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          {/* ---------------| TITLE & CATEGORY |--------------- */}
          <div>
            <div className="flex gap-4 sm:flex-row items-start">
              <div className="flex flex-col flex-1">
                <Label className="text-lg flex">
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
                  onChange={handleCreatePost}
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label className="text-lg">Thể loại</Label>
                <Select
                  id="category"
                  className="flex-1"
                  onChange={handleCreatePost}
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
            <Label className="text-lg flex">
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
                <div className="flex flex-col items-center justify-center pb-6 pt-5 h-full w-full  border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  {postImage ? (
                    <img
                      src={
                        previewImage ||
                        "https://wordtracker-swoop-uploads.s3.amazonaws.com/uploads/ckeditor/pictures/1247/content_wordtracker_blog_article_image.jpg"
                      }
                      alt="Selected post"
                      className={"w-full h-full"}
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
          Xuất bản
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
