//? ---------------| IMPORT LIBRARIES |---------------
import PropTypes from "prop-types";
import moment from "moment";
import "moment/dist/locale/vi";
moment.locale("vi");
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Textarea } from "flowbite-react";
import { FaHeart } from "react-icons/fa";
import { RiPencilLine, RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_USER, UPDATE_COMMENT } from "../../api/comment";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const userId_comment = comment.userId;
  const comment_id = comment._id;

  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser?.user?._id;
  const user_role = curUser?.user?.role;

  const [isEditComment, setIsEditComment] = useState(false);
  const [editComment, setEditComment] = useState(comment.content);
  const [activeCommentId, setActiveCommentId] = useState(null);

  //? ---------------| HANDLE GET USER WHO COMMENTED |---------------
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

      onEdit(comment, {
        content: editComment,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Đã sửa bình luận", { theme: "colored" });
      setEditComment(false);
    } catch (error) {
      console.log("Update comment - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    // Whole List comment contains avatar - username of another user
    <div className="flex p-4 border-b dark:border-gray-500 text-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.profileImage}
          alt={user?.email}
          className="w-10 h-10 object-cover rounded-full"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
          }}
        />
      </div>
      <div className="flex-1">
        {/* ---------------| AREA AUTHOR |---------------*/}
        <div className="flex items-center gap-1">
          <span className="font-semibold truncate ">
            {user ? `@${user?.username}` : "Không rõ người dùng"}
          </span>
          <span className="text-gray-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {/* ---------------| AREA UPDATE COMMENT |---------------*/}
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
                Lưu lại
              </Button>
              <Button color="red" onClick={() => setIsEditComment(false)}>
                Không
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

              {/* ---------------| DISPLAY NUMBER OF LIKES COMMENT |---------------*/}
              <p className="text-gray-600 text-sm">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "Like" : "Likes")}
              </p>
              {curUser && activeCommentId !== comment_id && (
                <Button
                  className="border-none"
                  color="gray"
                  pill
                  onClick={() => setActiveCommentId(comment_id)}
                >
                  <BsThreeDots className="scale-150" />
                </Button>
              )}

              {curUser && activeCommentId === comment_id && (
                <div className="flex gap-2 items-center">
                  {/* ---------------| DELETE COMMENT |---------------*/}
                  {(user_role === "admin" ||
                    (user_role === "user" && user_id === userId_comment)) && (
                    <Button
                      className="flex items-center border-none bg-transparent group"
                      color="gray"
                      size="xs"
                      pill
                      onClick={() => {
                        onDelete(comment_id);
                        setActiveCommentId(null);
                      }}
                    >
                      <RiDeleteBin6Line className="mr-1 h-4 w-4 group-hover:text-red-600" />
                      <span className="text-gray-800 group-hover:text-red-600">
                        Xóa
                      </span>
                    </Button>
                  )}

                  {/* ---------------| UPDATE COMMENT |---------------*/}
                  {user_id === userId_comment && (
                    <Button
                      className="flex items-center border-none bg-transparent group px-2 py-1"
                      color="gray"
                      size="xs"
                      pill
                      onClick={() => {
                        handleEditComment();
                        setActiveCommentId(null);
                      }}
                    >
                      <RiPencilLine className="mr-1 h-4 w-4 group-hover:text-blue-600" />
                      <span className="text-gray-800 group-hover:text-blue-600">
                        Sửa
                      </span>
                    </Button>
                  )}

                  {/* ---------------| CANCEL DISPLAY FUNCTION |---------------*/}
                  <Button
                    color="red"
                    size="xs"
                    pill
                    onClick={() => setActiveCommentId(null)}
                  >
                    <MdOutlineCancel className="scale-150" />
                  </Button>
                </div>
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
  onDelete: PropTypes.func.isRequired,
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
