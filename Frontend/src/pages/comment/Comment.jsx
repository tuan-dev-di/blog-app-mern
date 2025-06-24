//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Table, Tooltip, Pagination, Modal } from "flowbite-react";
import { IoRefresh } from "react-icons/io5";
import { RiDeleteBin2Line } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_COMMENT_LIST, DELETE_COMMENT } from "../../apis/comment";
import { SidebarApp } from "../../components/_index";

const Comment = () => {
  const navigate = useNavigate();
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  /*
   * Set pagination
   * Set 7 items per page
   */
  const limitComments = 7;
  const [commentList, setCommentList] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

  //? ---------------| HANDLE GET LIST POST |---------------
  const list_comments = useCallback(async () => {
    try {
      const data = await GET_COMMENT_LIST(userId, currentPage, limitComments);
      if (!data) toast.error(data.message, { theme: "colored" });
      const merged = data.comments.map((comment, index) => ({
        ...comment,
        ...data.extraComments?.[index],
      }));
      setCommentList(merged);
      setTotalComment(data.totalComment);
      setTotalPage(data.totalPage);
    } catch (error) {
      console.log("Get comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, currentPage, limitComments]);

  useEffect(() => {
    list_comments();
  }, [list_comments]);

  //? ---------------| HANDLE REFRESH LIST COMMENT |---------------
  const handleRefresh = async () => {
    await list_comments();
    toast.success("Danh sách bình luận đã được tải lại!", { theme: "colored" });
  };

  //? ---------------| HANDLE CHANGE PAGE |---------------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) setCurrentPage(page);
  };

  //? ---------------| HANDLE DELETE COMMENT |---------------
  const handleDeleteComment = async () => {
    setModalOpen(false);

    try {
      if (!curUser) {
        navigate("/sign-in");
        return;
      }

      const { ok, data } = await DELETE_COMMENT(commentId, userId);

      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Xóa bình luận thành công!", {
        theme: "colored",
      });

      await list_comments();
    } catch (error) {
      console.log("Delete comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    // Whole page Comment List
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        <SidebarApp />
      </div>
      <div className="relative mx-auto p-7 w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center">
          <div className="font-semibold text-4xl">Danh sách bình luận</div>
          <div className="flex gap-2">
            <Button
              className="rounded-full w-10 border-2 shadow-md"
              color="none"
              onClick={handleRefresh}
            >
              <Tooltip
                content="Làm mới"
                style="light"
                placement="left"
                trigger="hover"
              >
                <IoRefresh className="w-4 h-4" />
              </Tooltip>
            </Button>
          </div>
        </div>
        <span className="flex flex-col mt-7 text-left text-base">
          {role === "admin" ? (
            <p>
              Tổng bình luận: <strong>{totalComment}</strong>
            </p>
          ) : (
            <p>
              Tổng bình luận của bạn: <strong>{totalComment}</strong>
            </p>
          )}
        </span>
        <div>
          {commentList.length > 0 ? (
            <div>
              <Table hoverable className="mt-7 shadow-md dark:bg-slate-800">
                <Table.Head className="text-base">
                  <Table.HeadCell>Tiêu đề</Table.HeadCell>
                  <Table.HeadCell>Nội dung bình luận</Table.HeadCell>
                  <Table.HeadCell>Lượt thích</Table.HeadCell>
                  <Table.HeadCell>Tác giả</Table.HeadCell>
                  <Table.HeadCell>Tạo vào</Table.HeadCell>
                  <Table.HeadCell>Cập nhật vào</Table.HeadCell>
                  <Table.HeadCell>Xóa</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {commentList.map((comment) => (
                    <Table.Row key={comment._id}>
                      <Table.Cell className="max-w-44 whitespace-normal break-words">
                        <Link
                          to={`/posts/get-posts/detail/${comment.postInformation?.slug}`}
                        >
                          {comment.postInformation?.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="max-w-44 whitespace-normal break-words">
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      <Table.Cell>
                        {comment.userInformation?.username}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(comment.updatedAt).toLocaleDateString(
                          "en-GB",
                          {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() => {
                            setCommentId(comment._id);
                            setModalOpen(true);
                          }}
                          className="cursor-pointer bg-transparent border-none shadow-none sm:inline"
                          color="none"
                        >
                          <RiDeleteBin2Line className="w-5 h-5 text-red-600" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <div className="flex overflow-x-auto sm:justify-center mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPage}
                  onPageChange={handlePageChange}
                  previousLabel="Trước đó"
                  nextLabel="Tiếp theo"
                />
              </div>
            </div>
          ) : (
            <p className="italic font-semibold text-red-700 mt-2">
              Bạn không có quyền hoặc danh sách rỗng!
            </p>
          )}
        </div>
        <Modal
          show={modalOpen}
          size="md"
          onClose={() => setModalOpen(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-500 dark:text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Bạn có chắc là muốn xóa bình luận này?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComment}>
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
    </div>
  );
};

export default Comment;
