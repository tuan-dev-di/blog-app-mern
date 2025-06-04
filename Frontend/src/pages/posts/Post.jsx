//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Table, Tooltip, Pagination, Modal } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";
import { IoRefresh } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_POSTS, DELETE_POST } from "../../apis/post";
import { SidebarApp } from "../../components/_index";

const Post = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  const navigate = useNavigate();

  /*
   * Set pagination
   * Set 7 posts per page
   */
  const [userPost, setUserPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [postLastMonth, setPostLastMonth] = useState(0);
  const limitPosts = 7;

  /*
   * Set modal
   */
  const [postId, setPostId] = useState("");
  const [modalType, setModalType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  //? ---------------| GET LIST POST |---------------
  const list_posts = useCallback(async () => {
    try {
      const data = await GET_POSTS(currentPage, limitPosts);
      if (!data) toast.error(data.message, { theme: "colored" });

      setUserPost(data.posts);
      setTotalPage(data.totalPage);
      setTotalPost(data.totalPost);
      setPostLastMonth(data.postLastMonth);
    } catch (error) {
      console.log("Get post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [currentPage, limitPosts]);

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
    if (page >= 1 && page <= totalPage) setCurrentPage(page);
  };

  //? ---------------| HANDLE DELETE POST |---------------
  const handleDeletePost = async () => {
    setModalOpen(false);

    try {
      const { ok, data } = await DELETE_POST(postId, userId);

      if (!ok) {
        toast.error(data.message, { theme: "colored" });
        return;
      }

      toast.success("Delete post successfully!", {
        theme: "colored",
      });
      setUserPost((prev) =>
        prev ? prev.filter((post) => post._id !== postId) : []
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log("Delete post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        <SidebarApp />
      </div>
      {/* Whole page List Post */}
      <div className="relative mx-auto p-7 w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center">
          <div className="font-semibold text-4xl">List Post</div>
          <div className="flex gap-2">
            <Button
              className="rounded-full w-10 border-2 shadow-md mr-2"
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
              <Button>
                <FaPlus className="mr-2 h-5 w-5" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
        <span className="flex flex-col mt-7 text-left text-base">
          {role === "admin" ? (
            <p>
              All Posts: <strong>{totalPost}</strong>
            </p>
          ) : (
            <p>You have no permission to know</p>
          )}
        </span>
        <span className="flex flex-col text-left text-base">
          {role === "admin" ? (
            <p>
              Post in last month: <strong>{postLastMonth}</strong>
            </p>
          ) : (
            <p>You have no permission to know</p>
          )}
        </span>
        {/* Table: Display data of list post */}
        <div>
          {role === "admin" && userPost?.length > 0 ? (
            <div>
              <Table hoverable className="mt-7 shadow-md dark:bg-slate-800">
                <Table.Head className="text-base">
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>Updated At</Table.HeadCell>
                  <Table.HeadCell>Update</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {userPost.map((post) => (
                    <Table.Row key={post._id}>
                      <Table.Cell>
                        <Link to={`/posts/get-posts/detail/${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-32 h-16 object-cover "
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/posts/get-posts/detail/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        {new Date(post.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                        {" - "}
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                        {" - "}
                        {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() => {
                            setPostId(post._id);
                            setModalType("update");
                            setModalOpen(true);
                          }}
                          className="cursor-pointer bg-transparent border-none shadow-none sm:inline"
                          color="none"
                        >
                          <RiPencilLine className="w-5 h-5" />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={() => {
                            setPostId(post._id);
                            setModalType("delete");
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
              You have no permission or list post is empty!
            </p>
          )}
        </div>

        {/* Modal to confirm Update/Delete Post --- SEVERE */}
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
                {modalType === "delete"
                  ? "Are you sure you want to delete this post?"
                  : "Are you sure you want to update this post?"}
              </h3>
              <div className="flex justify-center gap-4">
                {modalType === "delete" ? (
                  <Button color="failure" onClick={handleDeletePost}>
                    Yes, delete it
                  </Button>
                ) : (
                  <Button
                    color="info"
                    onClick={() => {
                      setModalOpen(false);
                      navigate(`/posts/update-posts/${postId}`);
                    }}
                  >
                    Yes, update it
                  </Button>
                )}
                <Button color="gray" onClick={() => setModalOpen(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Post;
