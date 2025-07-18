//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, TextInput, Select, Button, Spinner } from "flowbite-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { UPDATE_POST, GET_POST_TO_UPDATE } from "../../api/post";
import { UPLOAD_IMAGE } from "../../api/auth";

const DetailPost = () => {
  const filePicker = useRef();

  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { postId } = useParams();

  //? ---------------| HANDLE GET DETAIL OF POST |---------------
  const get_post_to_update = useCallback(async () => {
    setLoading(true);

    try {
      const data = await GET_POST_TO_UPDATE(postId);

      if (!data) {
        toast.error("Không lấy được thông tin bài viết", { theme: "colored" });
        return;
      }
      // setFormData(data.posts[0]);
      const originalPostData = data.posts[0];
      setFormData({
        ...originalPostData,
        originalTitle: originalPostData.title,
        originalCategory: originalPostData.category,
        originalContent: originalPostData.content,
        originalPostImage: originalPostData.image,
      });

      setLoading(false);
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
    setImagePreview(URL.createObjectURL(file));
  };

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
      // Check image null or not
      let imagePreview = null;
      if (postImage) {
        const imageData = new FormData();
        imageData.append("file", postImage);

        imagePreview = await UPLOAD_IMAGE(imageData);

        if (!imagePreview) {
          toast.error("Không nhận được ảnh từ người dùng", {
            theme: "colored",
          });
          setPostImage(null);
          setImagePreview(null);
          return;
        }

        setImagePreview(imagePreview.url);
      }

      // Create an object to get field which update by user with new data
      const postDataChanges = {};
      if (formData.title && formData.title !== formData.originalTitle)
        postDataChanges.title = formData.title;
      if (formData.category && formData.category !== formData.originalCategory)
        postDataChanges.category = formData.category;
      if (formData.content && formData.content !== formData.originalContent)
        postDataChanges.content = formData.content;
      if (imagePreview && imagePreview.url !== formData.originalPostImage)
        postDataChanges.image = imagePreview.url;

      if (Object.keys(postDataChanges).length === 0) {
        toast.warn("Không có gì thay đổi", { theme: "colored" });
        return;
      }

      const { ok, data } = await UPDATE_POST(postId, userId, postDataChanges);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Cập nhật bài viết thành công!", { theme: "colored" });

      await get_post_to_update();
    } catch (error) {
      console.log("Update post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| DISPLAY SPINNER |---------------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

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
                <Label className="text-lg">Tiêu đề</Label>
                <TextInput
                  id="title"
                  type="text"
                  className="flex-1 w-[500px]"
                  placeholder="Không được sửa tiêu đề để trống"
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
            <Label className="text-lg">Nội dung bài viết</Label>
            <ReactQuill
              theme="snow"
              placeholder="Không được sửa nội dung bài viết để trống"
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
                <div className="flex flex-col items-center justify-center pb-6 pt-5 h-full w-full  border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  {formData?.image && (
                    <img
                      src={imagePreview || formData?.image}
                      alt="Selected post"
                      className={"w-full h-full"}
                    />
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
