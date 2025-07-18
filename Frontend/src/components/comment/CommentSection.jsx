//? ---------------| IMPORT LIBRARIES |---------------
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

//? ---------------| IMPORT COMPONENTS |---------------
import { Label, Textarea, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS_IN_POST,
  LIKE_COMMENT,
} from "../../api/comment";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const navigate = useNavigate();
  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser?.user?._id;

  const [content, setContent] = useState(""); // Content of comment
  const [comments, setComments] = useState([]); // List of comments in post detail
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteComment, setDeleteComment] = useState(null);

  //? ---------------| HANDLE GET LIST COMMENT |---------------
  const get_comments = useCallback(async () => {
    try {
      const data = await GET_COMMENTS_IN_POST(postId);

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
      toast.error("Bình luận tối đa chứa 300 ký tự", {
        theme: "colored",
      });
      return;
    }

    try {
      if (!curUser) {
        navigate("/sign-in");
        return;
      }

      const { ok, data } = await CREATE_COMMENT(postId, user_id, content);
      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Đã bình luận", { theme: "colored" });
      await get_comments();
      setContent(""); // Set content in comment box to null after post comment
    } catch (error) {
      console.log("Create comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE SUBMIT EDIT COMMENT |---------------
  const handleSubmitEditComment = async (comment, editedComment) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              ...editedComment,
            }
          : c
      )
    );
  };
  //? ---------------| HANDLE SUBMIT DELETE COMMENT |---------------
  const handleDeleteComment = async (commentId) => {
    setModalOpen(false);

    try {
      if (!curUser) {
        navigate("/sign-in");
        return;
      }

      const { ok, data } = await DELETE_COMMENT(commentId, user_id);

      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Đã xóa bình luận!", {
        theme: "colored",
      });

      await get_comments();

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.log("Delete comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  //? ---------------| HANDLE LIKE COMMENT |---------------
  const handleLikeComment = async (commentId, user_id) => {
    try {
      if (!curUser) {
        navigate("/sign-in");
        return;
      }

      const data = await LIKE_COMMENT(commentId, user_id);
      if (!data) toast.error(data.message, { theme: "colored" });

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : comment
        )
      );
    } catch (error) {
      console.log("Đã thích", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    // Whole Comment Section
    <div className="max-w-2xl w-full mx-auto p-2">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Show Avatar - Username of account */}
      {curUser ? (
        <div className="flex items-center gap-2 my-5">
          <p>Đăng nhập bởi: </p>
          <img
            src={curUser?.user?.profileImage}
            alt=""
            className="w-7 h-7 object-cover rounded-full"
            onError={(e) => {
              e.target.src =
                "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
            }}
          />
          <Link to="/profile" className="text-sm text-cyan-600 hover:underline">
            {curUser?.user?.username} - {curUser?.user?.email}
          </Link>
        </div>
      ) : (
        <div className="text-sm italic">
          Bạn phải
          <Link
            className="mx-1 text-sm text-cyan-600 hover:underline"
            to={"/sign-in"}
          >
            đăng nhập
          </Link>
          để bình luận.
        </div>
      )}

      {/* ---------------| AREA CREATE COMMENT |---------------*/}
      {curUser && (
        <form
          onSubmit={handleSubmitComment}
          className="border border-teal-400 rounded-xl p-5 my-3"
        >
          <Label className="text-base" value="Bình luận" />
          <Textarea
            id="comment"
            placeholder="Nhập bình luận của bạn..."
            rows={4}
            maxLength="300"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="italic text-sm text-gray-500">
              {300 - content.length} ký tự còn lại
            </p>
            <Button outline gradientDuoTone="greenToBlue" type="submit">
              Đăng bình luận
            </Button>
          </div>
        </form>
      )}

      {/* ---------------| AREA LIST OF COMMENT |---------------*/}
      {comments.length === 0 ? (
        <p className="text-sm my-5 italic">
          Bài viết này chưa có bình luận nào. Hãy là người đầu tiên nhé!
        </p>
      ) : (
        <div>
          <span className="flex items-center gap-1 ">
            <p className="font-bold">Các bình luận:</p>
            <div className="text-cyan-600">{comments.length}</div>
          </span>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLikeComment}
              onEdit={handleSubmitEditComment}
              onDelete={(commentId) => {
                setModalOpen(true);
                setDeleteComment(commentId);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal to confirm Delete Comment --- SEVERE */}
      <Modal
        show={modalOpen}
        size="xl"
        onClose={() => setModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 " />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc là muốn xóa bình luận này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteComment(deleteComment)}
              >
                Có, xóa đi!
              </Button>
              <Button color="gray" onClick={() => setModalOpen(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
