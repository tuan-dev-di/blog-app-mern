//? ---------------| IMPORT LIBRARIES |---------------
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

//? ---------------| IMPORT COMPONENTS |---------------
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import Introduce from "../components/Introduce";
import { GET_POSTS } from "../api/post";
import PostCard from "../components/PostCard";

const Home = () => {
  const [postList, setPostList] = useState([]);
  const limitPosts = 8;

  //? ---------------| HANDLE GET LIST POST |---------------
  const list_posts = useCallback(async () => {
    try {
      const data = await GET_POSTS(1, limitPosts);
      if (!data) toast.error(data.message, { theme: "colored" });

      setPostList(data.posts);
    } catch (error) {
      console.log("Get post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [limitPosts]);

  useEffect(() => {
    list_posts();
  }, [list_posts]);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col gap-6 p-14 px-3 max-w-screen-2xl mx-auto text-left">
        <h1 className="font-bold text-5xl lg:text-6xl pt-10">Chào các bạn,</h1>
        <p className="text-gray-500 text-sm sm:text-base text-balance w-[860px]">
          Đây là sản phẩm đầu tiên mình làm với tư cách là Intern/Fresher Web
          Developer. Các Blog được tạo ra để ghi lại hành trình học tập, cũng
          như chia sẻ kinh nghiệm và kiến thức mà họ tích lũy trong quá trình
          tìm hiểu về lập trình web. Hy vọng rằng nội dung ở đây sẽ hơi hữu ích
          cho những người trên cùng một cách để khám phá web thế giới như mình.
        </p>
        <Link
          className="text-sm sm:text-base text-teal-600 font-bold hover:underline"
          to="/search"
        >
          Xem thêm
        </Link>
      </div>

      <div className="mx-auto max-w-6xl w-full my-6">
        <Introduce />
      </div>

      <div className="flex flex-col gap-8 py-7 mx-auto p-5 max-w-screen-2xl">
        {postList.length > 0 && (
          <div className="flex flex-col gap-7">
            <h1 className="text-3xl font-semibold text-center">Recent Posts</h1>
            <div className="flex flex-wrap gap-8 mt-5 justify-center">
              {postList?.map((post) => (
                <div key={post._id}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        )}
        <Link
          className="text-sm sm:text-base text-teal-600 font-bold hover:underline text-center"
          to="/search"
        >
          Xem thêm
        </Link>
      </div>
    </div>
  );
};

export default Home;
