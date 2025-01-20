import { useState } from "react";

import {
  Label,
  TextInput,
  Select,
  FileInput,
  Button,
  // Spinner,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// import { SidebarApp } from "../../components/_index";

const CreatePost = () => {
  // const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const handleChangeImagePost = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file); // Đọc file và chuyển sang DataURL
    }
  };

  return (
    // <div className="min-h-screen flex flex-col md:flex-row">
    //   <div className="">
    //     <SidebarApp />
    //   </div>
    //   <div className="max-w-4xl mx-auto p-7 min-h-screen">
    //     <h1 className="text-center text-2xl my-7 font-semibold">
    //       Create a new post
    //     </h1>
    //     <form className="flex flex-col gap-2">
    //       <div className="flex flex-col gap-4 justify-between">
    //         {/* -------------------- TITLE & CATEGORY -------------------- */}
    //         <div>
    //           <div className="flex gap-4 sm:flex-row items-start">
    //             <div className="flex flex-col flex-1">
    //               <Label className="text-base">
    //                 Title<span className="text-red-500 ml-1">*</span>
    //               </Label>
    //               <TextInput
    //                 id="title"
    //                 type="text"
    //                 className="flex-1 w-[450px]"
    //                 placeholder="Enter a title"
    //                 required
    //               />
    //             </div>

    //             <div className="flex flex-col flex-1">
    //               <Label className="text-base">
    //                 Title<span className="text-red-500 ml-1">*</span>
    //               </Label>
    //               <Select id="category" className="flex-1">
    //                 <option value="uncategorized">
    //                   ----- Language | Framework -----
    //                 </option>
    //                 <option value="javascript-reactjs">
    //                   JavaScript | ReactJS
    //                 </option>
    //                 <option value="javascript-vuejs">JavaScript | VueJS</option>
    //                 <option value="javascript-nodejs">
    //                   JavaScript | NodeJS
    //                 </option>
    //                 <option value="golang-gin">GoLang | Gin</option>
    //                 <option value="golang-echo">GoLang | Echo</option>
    //                 <option value="golang-fiber">GoLang | Fiber</option>
    //               </Select>
    //             </div>
    //           </div>
    //         </div>

    //         {/* -------------------- CONTENT -------------------- */}
    //         <div>
    //           <Label className="text-base">
    //             Content<span className="text-red-500 ml-1">*</span>
    //           </Label>
    //           <ReactQuill
    //             theme="snow"
    //             placeholder="Enter your content"
    //             className="h-56 mb-10"
    //           />
    //         </div>

    //         {/* -------------------- IMAGE -------------------- */}
    //         <div>
    //           <Label className="text-base">
    //             Image<span className="text-red-500 ml-1">*</span>
    //           </Label>
    //           <div className="w-full items-center justify-center">
    //             <Label
    //               htmlFor="dropzone-file"
    //               className="flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    //             >
    //               <div className="flex flex-col items-center justify-center pb-6 pt-5 h-80 w-full">
    //                 {selectedImage ? (
    //                   <img
    //                     src={selectedImage}
    //                     alt="Selected"
    //                     className="h-80 w-full object-cover rounded-lg"
    //                   />
    //                 ) : (
    //                   <>
    //                     <svg
    //                       className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
    //                       aria-hidden="true"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 20 16"
    //                     >
    //                       <path
    //                         stroke="currentColor"
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth="2"
    //                         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    //                       />
    //                     </svg>
    //                     <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
    //                       <span className="font-semibold">Click to upload</span>{" "}
    //                       or drag and drop
    //                     </p>
    //                     <p className="text-xs text-gray-500 dark:text-gray-400">
    //                       SVG, PNG, JPG or GIF
    //                     </p>
    //                   </>
    //                 )}
    //               </div>
    //               <FileInput
    //                 id="dropzone-file"
    //                 className="hidden"
    //                 onChange={handleChangeImagePost}
    //                 accept="image/*" // Chỉ cho phép file ảnh
    //                 required
    //               />
    //             </Label>
    //           </div>
    //         </div>
    //       </div>
    //       {/* <Button
    //       className="mt-3"
    //       gradientDuoTone="purpleToBlue"
    //       type="submit"
    //       disabled={loading}
    //     >
    //       {loading ? (
    //         <div>
    //           <Spinner size="sm" />
    //           <span className="pl-3">Loading...</span>
    //         </div>
    //       ) : (
    //         "Create"
    //       )}
    //     </Button> */}
    //       <Button className="mt-5" gradientDuoTone="purpleToBlue" type="submit">
    //         Create
    //       </Button>
    //     </form>
    //   </div>
    // </div>
    <div className="max-w-4xl mx-auto p-7 min-h-screen">
      <h1 className="text-center text-4xl my-7 font-semibold">
        Create a new post
      </h1>
      <form className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 justify-between">
          {/* -------------------- TITLE & CATEGORY -------------------- */}
          <div>
            <div className="flex gap-4 sm:flex-row items-start">
              <div className="flex flex-col flex-1">
                <Label className="text-base">
                  Title<span className="text-red-500 ml-1">*</span>
                </Label>
                <TextInput
                  id="title"
                  type="text"
                  className="flex-1 w-[500px]"
                  placeholder="Enter a title"
                  required
                />
              </div>

              <div className="flex flex-col flex-1">
                <Label className="text-base">
                  Category<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select id="category" className="flex-1">
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
              theme="snow"
              placeholder="Enter your content"
              className="h-56 mb-10"
            />
          </div>

          {/* -------------------- IMAGE -------------------- */}
          <div>
            <Label className="text-base">Image</Label>
            <div className="w-full items-center justify-center">
              <Label
                htmlFor="dropzone-file"
                className="flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5 h-80 w-full">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="h-80 w-full object-cover rounded-lg"
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
                />
              </Label>
            </div>
          </div>
        </div>
        {/* <Button
          className="mt-3"
          gradientDuoTone="purpleToBlue"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : (
            "Create"
          )}
        </Button> */}
        <Button className="mt-5" gradientDuoTone="purpleToBlue" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
