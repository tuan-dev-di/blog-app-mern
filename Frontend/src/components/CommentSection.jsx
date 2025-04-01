import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Label, Textarea, Button } from "flowbite-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CREATE_COMMENT } from "../apis/comment";

const CommentSection = ({ postId }) => {
  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser.user._id;

  const [content, setContent] = useState("");

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
    } catch (error) {
      console.log("Create Comment - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

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
        <form onSubmit={handleSubmitComment}>
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
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
