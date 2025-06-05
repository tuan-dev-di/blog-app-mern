import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Introduce from "../components/Introduce";
import { GET_POSTS } from "../apis/post";
import PostCard from "../components/PostCard";

const Home = () => {
  const [postList, setPostList] = useState([]);
  const limitPosts = 8;

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
        <h1 className="font-bold text-5xl lg:text-6xl pt-10">
          Welcome to Arys&apos;s Blog
        </h1>
        <p className="text-gray-500 text-sm sm:text-base text-balance w-[860px]">
          This is the first product I made as a Fresher Website Developer. The
          blog was created to record the learning journey, as well as sharing
          the experiences and knowledge they accumulated in the process of
          learning about web programming. Hopefully the content here will be
          somewhat useful for those who are on the same way to explore the web
          world like me.
        </p>
        <Link
          className="text-sm sm:text-base text-teal-600 font-bold hover:underline"
          to="/search"
        >
          View all posts
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
          View all posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
