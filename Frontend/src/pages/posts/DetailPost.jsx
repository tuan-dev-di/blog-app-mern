//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Spinner, Button } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_POST_DETAIL, GET_POSTS_LIMIT } from "../../apis/post";
import { Introduce, CommentSection } from "../../components/_index";
import PostCard from "../../components/PostCard";

const DetailPost = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);
  const amount_recent_post = 4;

  //? ---------------| HANDLE GET DETAIL POST |---------------
  const post_detail = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GET_POST_DETAIL(postSlug);

      if (!data) toast.error(data?.message, { theme: "colored" });

      setLoading(false);
      setPost(data.posts[0]);
    } catch (error) {
      console.log("Post detail error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [postSlug]);

  useEffect(() => {
    post_detail();
  }, [post_detail]);

  //? ---------------| HANDLE GET RECENT POSTS |---------------
  const recent_post = useCallback(async () => {
    try {
      const data = await GET_POSTS_LIMIT(amount_recent_post);

      if (!data) {
        toast.error(data?.message || "Không có bài viết nào.", {
          theme: "colored",
        });
        return;
      }

      setRecentPost(data.posts);
    } catch (error) {
      console.log("Recent post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, []);

  useEffect(() => {
    recent_post();
  }, [recent_post]);

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

  const postCreated = formatDateTime(post?.createdAt);

  return (
    <div className="min-h-screen p-7 mx-auto max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* ---------------| TITLE |--------------- */}
      <h1 className="text-3xl p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>

      {/* ---------------| CATEGORY |--------------- */}
      <div className="flex justify-center my-3">
        <Link to={`/search?category=${post?.category}`}>
          <Button color="gray" pill size="md">
            {post?.category}
          </Button>
        </Link>
      </div>

      {/* ---------------| CREATED TIME |--------------- */}
      <span className="flex flex-col italic p-3 text-center text-gray-400 text-xs">
        Tạo vào: {postCreated}
      </span>

      {/* ---------------| IMAGE |--------------- */}
      <div className="p-3 w-full max-h-[600px] aspect-[16/9]">
        <img
          className="w-full h-full object-contain"
          src={post?.image}
          alt={post?.title}
        />
      </div>

      {/* ---------------| CONTENT |--------------- */}
      <div
        className="max-w-2xl mx-auto p-3 post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <div className="mx-auto max-w-6xl w-full my-4">
        <Introduce />
      </div>

      {/* ---------------| COMMENT |--------------- */}
      <div className="mx-auto max-w-6xl w-full my-4">
        <CommentSection postId={post._id} />
      </div>

      {/* ---------------| RECENT POSTS |--------------- */}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-3xl font-semibold text-center">Bài viết gần đây</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {/* {recentPost?.map((post) => (
            <div key={post._id}>
              <PostCard post={post} />
            </div>
          ))} */}
          {recentPost
            ?.filter((p) => p._id !== post._id)
            .map((post) => (
              <div key={post._id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
