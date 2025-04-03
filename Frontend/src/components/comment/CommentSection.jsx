import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Label, Textarea, Button } from "flowbite-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CREATE_COMMENT, GET_COMMENTS } from "../../apis/comment";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser.user._id;

  const [content, setContent] = useState(""); // Content of comment
  const [comments, setComments] = useState([]); // List of comments in post detail

  //? ---------------| HANDLE GET LIST COMMENT |---------------
  const get_comments = useCallback(async () => {
    try {
      const data = await GET_COMMENTS(postId);

      if (!data) toast.error(data.message, { theme: "colored" });

      setComments(data.comments);
    } catch (error) {
      console.log("Get Comments - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [postId]);

  useEffect(() => {
    get_comments();
  }, [get_comments]);

  //? ---------------| HANDLE SUBMIT COMMENT |---------------
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (content.length > 300) {
      toast.error("Comment is contain only 300 characters", {
        theme: "colored",
      });
      return;
    }

    try {
      const { ok, data } = await CREATE_COMMENT(postId, user_id, content);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Comment successfully", { theme: "colored" });
      setContent(""); // Set content in comment box to null after post comment
    } catch (error) {
      console.log("Create Comment - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE SUBMIT COMMENT |---------------

  return (
    <div className="max-w-2xl w-full mx-auto p-2">
      <ToastContainer position="top-right" autoClose={3000} />
      {curUser ? (
        <div className="flex items-center gap-2 my-5">
          <p>Signed in as: </p>
          <img
            src={curUser.user.profileImage}
            alt=""
            className="w-7 h-7 object-cover rounded-full"
            onError={(e) => {
              e.target.src =
                "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
            }}
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-sm text-cyan-600 hover:underline"
          >
            {curUser.user.username} - {curUser.user.email}
          </Link>
        </div>
      ) : (
        <div className="text-sm italic">
          You must be
          <Link
            className="mx-1 text-sm text-cyan-600 hover:underline"
            to={"/sign-in"}
          >
            sign in
          </Link>
          to comment.
        </div>
      )}
      {curUser && (
        <form
          onSubmit={handleSubmitComment}
          className="border border-teal-400 rounded-xl p-5 my-3"
        >
          <Label className="text-base" value="Your comment" />
          <Textarea
            id="comment"
            placeholder="Add your comment..."
            rows={4}
            maxLength="300"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="italic text-sm text-gray-500">
              {300 - content.length} character remaining
            </p>
            <Button outline gradientDuoTone="greenToBlue" type="submit">
              Comment
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5 italic">
          This post has no comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div>
          <span className="flex items-center gap-1 ">
            <p className="font-bold">Comments:</p>
            <div className="text-cyan-600">{comments.length}</div>
          </span>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
