//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Table, Tooltip, Pagination, Modal } from "flowbite-react";
import { IoRefresh } from "react-icons/io5";
import { RiDeleteBin2Line } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_COMMENT_LIST } from "../../apis/comment";

const ListPost = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  /*
   * Set pagination
   * Set 7 items per page
   */
  const [commentList, setCommentList] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

  //? ---------------| GET LIST POST |---------------
  const list_comments_for_admin = useCallback(async () => {
    try {
      const data = await GET_COMMENT_LIST(userId, currentPage);
      if (!data) toast.error(data.message, { theme: "colored" });
      const merged = data.comments.map((comment, index) => ({
        ...comment,
        ...data.extraComments?.[index], // gộp thêm postInformation & userInformation
      }));
      setCommentList(merged);
      setTotalComment(data.totalComment);
      setTotalPage(data.totalPage);
    } catch (error) {
      console.log("Get comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, currentPage]);

  useEffect(() => {
    list_comments_for_admin();
  }, [list_comments_for_admin]);

  //? ---------------| HANDLE REFRESH LIST COMMENT |---------------
  const handleRefresh = async () => {
    await list_comments_for_admin();
    toast.success("List Comments Refreshed!", { theme: "colored" });
  };

  //? ---------------| HANDLE CHANGE PAGE |---------------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) setCurrentPage(page);
  };

  const handleDeleteComment = () => {
    console.log("COMMENT ID:", commentId);
  };

  console.log("COMMENT:", commentList);

  return (
    <div className="relative mx-auto p-7 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <div className="font-semibold text-4xl">List Comment</div>
        <div className="flex gap-2">
          <Button
            className="rounded-full w-10 border-2 shadow-md"
            color="none"
            onClick={handleRefresh}
          >
            <Tooltip
              content="Refresh"
              style="light"
              placement="bottom"
              trigger="hover"
            >
              <IoRefresh className="w-4 h-4" />
            </Tooltip>
          </Button>
        </div>
      </div>
      <span className="flex flex-col mt-7 text-left text-base">
        {role === "admin" ? (
          <p>All Comments: {totalComment}</p>
        ) : (
          <p>All Your Comments: {totalComment}</p>
        )}
      </span>
      <div>
        {commentList.length > 0 ? (
          <div>
            <Table hoverable className="mt-7 shadow-md">
              <Table.Head className="text-base">
                <Table.HeadCell>Title&apos;s Post</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
                <Table.HeadCell>Author</Table.HeadCell>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Updated At</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {commentList.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell className="max-w-44 whitespace-normal break-words">
                      {comment.postInformation?.title}
                    </Table.Cell>
                    <Table.Cell className="max-w-44 whitespace-normal break-words">
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.userInformation?.username}</Table.Cell>
                    <Table.Cell>
                      {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
              />
            </div>
          </div>
        ) : (
          <p className="italic font-semibold text-red-700 mt-2">
            You have no permission or list user is empty!
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Delete
              </Button>
              <Button color="gray" onClick={() => setModalOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListPost;
