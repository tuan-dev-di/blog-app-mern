import PropTypes from "prop-types";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Button, Textarea } from "flowbite-react";
import { FaHeart } from "react-icons/fa";
import { RiPencilLine, RiDeleteBin6Line } from "react-icons/ri";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GET_USER, UPDATE_COMMENT } from "../../apis/comment";

const Comment = ({ comment, onLike, onEdit }) => {
  const [user, setUser] = useState({});
  const userId_comment = comment.userId;
  const comment_id = comment._id;

  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser.user._id;
  const user_role = curUser.user.role;

  const [isEditComment, setIsEditComment] = useState(false);
  const [editComment, setEditComment] = useState(comment.content);

  //? ---------------| GET USER WHO COMMENTED |---------------
  const get_user = useCallback(async () => {
    try {
      const data = await GET_USER(userId_comment);
      if (data) setUser(data);
    } catch (error) {
      console.log("Get User - ERROR:", error.message);
    }
  }, [userId_comment]);

  useEffect(() => {
    get_user();
  }, [get_user]);

  //? ---------------| HANDLE EDIT COMMENT |---------------
  const handleEditComment = () => {
    setIsEditComment(true);
    setEditComment(comment.content);
  };

  //? ---------------| HANDLE SUBMIT EDIT COMMENT |---------------
  const handleSubmit = async () => {
    try {
      const { ok, data } = await UPDATE_COMMENT(
        comment_id,
        userId_comment,
        editComment
      );

      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }
      
      onEdit(comment, editComment);

      toast.success("Updated comment successfully", { theme: "colored" });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log("Update comment - ERROR:", error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-500 text-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profileImage}
          alt={user.email}
          className="w-10 h-10 object-cover rounded-full"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold truncate ">
            {user ? `@${user.username}` : "Unknown User"}
          </span>
          <span className="text-gray-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditComment ? (
          <div>
            <Textarea
              id="comment"
              maxLength="300"
              onChange={(e) => setEditComment(e.target.value)}
              value={editComment}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button
                outline
                gradientDuoTone="greenToBlue"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button color="red" onClick={() => setIsEditComment(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-sm gap-2">
              <button
                className={`border-none hover:text-red-600 ${
                  curUser && comment.likes.includes(user_id) && "!text-red-600"
                }
              `}
                color="gray"
                onClick={() => onLike(comment_id)}
              >
                <FaHeart className="text-lg" />
              </button>
              <p className="text-gray-600 text-sm">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {curUser &&
                (user_role === "admin" ||
                  (user_role === "user" && user_id === comment.userId)) && (
                  <Button
                    className="flex items-center border-none bg-transparent group"
                    color="gray"
                    size="xs"
                    pill
                  >
                    <RiDeleteBin6Line className="mr-1 h-4 w-4 group-hover:text-red-600" />
                    <span className="text-gray-800 group-hover:text-red-600">
                      Delete
                    </span>
                  </Button>
                )}
              {curUser && user_id === userId_comment && (
                <Button
                  className="flex items-center border-none bg-transparent group px-2 py-1"
                  color="gray"
                  size="xs"
                  pill
                  onClick={handleEditComment}
                >
                  <RiPencilLine className="mr-1 h-4 w-4 group-hover:text-blue-600" />
                  <span className="text-gray-800 group-hover:text-blue-600">
                    Edit
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Comment.propTypes = {
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  comment: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]).isRequired,
    likes: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    numberOfLikes: PropTypes.number.isRequired,
  }).isRequired,
};

export default Comment;
