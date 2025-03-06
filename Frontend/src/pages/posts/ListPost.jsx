import { Button, Table, Tooltip, Pagination, Modal } from "flowbite-react";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoRefresh } from "react-icons/io5";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GET_POSTS, DELETE_POST } from "../../apis/post";

const ListPost = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  /*
   * Set pagination
   * Set 7 posts per page
   */
  const [userPost, setUserPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const postPerPage = 7;

  /*
   * Set delete function with modal
   */
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  //? ---------------| GET LIST POST |---------------
  const list_posts = useCallback(async () => {
    try {
      const data = await GET_POSTS(userId, currentPage, postPerPage);
      if (data) {
        setUserPost(data.posts);
        setTotalPage(data.totalPage);
      } else toast.error(data.message, { theme: "colored" });
    } catch (error) {
      console.log("Get Post - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, currentPage, postPerPage]);

  useEffect(() => {
    if (role === "admin") list_posts();
  }, [role, list_posts]);

  //? ---------------| HANDLE REFRESH LIST POST |---------------
  const handleRefresh = async () => {
    await list_posts();
    toast.success("List Posts Refreshed!", { theme: "colored" });
  };

  //? ---------------| HANDLE CHANGE PAGE |---------------
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //? ---------------| HANDLE DELETE POST |---------------
  const handleDeletePost = async () => {
    setDeleteModal(false);

    try {
      const { ok, data } = await DELETE_POST(postIdToDelete, userId);

      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Delete post successfully!", {
        theme: "colored",
      });
      setUserPost((prev) =>
        prev ? prev.filter((post) => post._id !== postIdToDelete) : []
      );
    } catch (error) {
      console.log("Delete Post - ERROR:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    <div className="relative mx-auto p-7 w-full">
      <ToastContainer position="top-right" autoClose={7000} />
      <div className="flex justify-between items-center">
        <div className="font-semibold text-4xl">List Post</div>
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
          <Link to="/posts/create-post">
            <Button gradientMonochrome="teal">
              <FaPlus className="mr-2 h-5 w-5" />
              New Post
            </Button>
          </Link>
        </div>
      </div>
      <div>
        {role === "admin" && userPost?.length > 0 ? (
          <div>
            <Table hoverable className="mt-7 shadow-md">
              <Table.Head className="text-base">
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {userPost.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell>
                      <Link to={`/posts/get-posts/${post._id}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-32 h-16 object-cover "
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/posts/get-posts/${post._id}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => {
                          setDeleteModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="cursor-pointer bg-transparent border-none shadow-none sm:inline"
                        color="none"
                      >
                        <Tooltip
                          content="Delete"
                          style="light"
                          placement="bottom"
                          trigger="hover"
                        >
                          <RiDeleteBin2Line className="w-5 h-5 text-red-600" />
                        </Tooltip>
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
            You have no permission or list post is empty!
          </p>
        )}
      </div>
      <Modal
        show={deleteModal}
        size="md"
        onClose={() => setDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModal(false)}>
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
