//? ---------------| IMPORT LIBRARIES |---------------
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Table } from "flowbite-react";
import { FaUsers } from "react-icons/fa";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { MdArticle } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { SidebarApp } from "../components/_index";
import { GET_USERS_OVERVIEW } from "../apis/user";
import { GET_POSTS_OVERVIEW } from "../apis/post";
import { GET_COMMENT_OVERVIEW } from "../apis/comment";

const Overview = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  const [userList, setUserList] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [userLastMonth, setUserLastMonth] = useState(0);
  const limitUsers = 5;

  const [postList, setPostList] = useState([]);
  const [totalPost, setTotalPost] = useState(0);
  const [postLastMonth, setPostLastMonth] = useState(0);
  const limitPosts = 5;

  const [commentList, setCommentList] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const limitComments = 5;

  const list_users = useCallback(async () => {
    try {
      const data = await GET_USERS_OVERVIEW(userId, limitUsers);
      if (!data) toast.error(data.message, { theme: "colored" });

      setUserList(data.users);
      setTotalUser(data.totalUser);
      setUserLastMonth(data.userLastMonth);
    } catch (error) {
      console.log("Get user error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, limitUsers]);

  const list_posts = useCallback(async () => {
    try {
      const data = await GET_POSTS_OVERVIEW(limitPosts);
      if (!data) toast.error(data.message, { theme: "colored" });

      setPostList(data.posts);
      setTotalPost(data.totalPost);
      setPostLastMonth(data.postLastMonth);
    } catch (error) {
      console.log("Get post error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [limitPosts]);

  const list_comments = useCallback(async () => {
    try {
      const data = await GET_COMMENT_OVERVIEW(userId, limitComments);
      if (!data) toast.error(data.message, { theme: "colored" });
      const merged = data.comments.map((comment, index) => ({
        ...comment,
        ...data.extraComments?.[index],
      }));
      setCommentList(merged);
      setTotalComment(data.totalComment);
    } catch (error) {
      console.log("Get comment error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, limitComments]);

  useEffect(() => {
    if (role === "admin") {
      list_users();
      list_posts();
      list_comments();
    }
  }, [role, list_users, list_posts, list_comments]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        <SidebarApp />
      </div>
      <div className="relative md:mx-auto p-7 w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div>
          {role === "admin" ? (
            <div>
              {/* ---------------| TOTAL PART |---------------*/}
              <div className="flex flex-wrap gap-4 justify-center">
                {/* ---------------| USERS |--------------- */}
                <div className="flex flex-col p-3 gap-3 md:w-80 w-full rounded-md shadow-md dark:bg-slate-800">
                  <div className="flex justify-between">
                    <div className="">
                      <h3 className="uppercase text-xl">Tất cả người dùng:</h3>
                      <p className="text-4xl">{totalUser}</p>
                    </div>
                    <FaUsers className="p-3 bg-teal-700 text-white rounded-full text-7xl shadow-lg" />
                  </div>
                  {userLastMonth >= 0 ? (
                    <div className="flex gap-2 text-base">
                      <span className="text-lime-600 flex items-center">
                        <FaArrowUpLong />
                        {userLastMonth}
                      </span>
                      <p className="">Tháng vừa qua</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 text-base">
                      <span className="text-red-700 flex items-center">
                        <FaArrowDownLong />
                        {userLastMonth}
                      </span>
                      <p className="">Tháng vừa qua</p>
                    </div>
                  )}
                </div>

                {/* ---------------| POSTS |--------------- */}
                <div className="flex flex-col p-3 gap-3 md:w-80 w-full rounded-md shadow-md dark:bg-slate-800">
                  <div className="flex justify-between">
                    <div className="">
                      <h3 className="uppercase text-xl">Tất cả bài viết:</h3>
                      <p className="text-4xl">{totalPost}</p>
                    </div>
                    <MdArticle className="p-3 bg-indigo-700 text-white rounded-full text-7xl shadow-lg" />
                  </div>
                  {postLastMonth >= 0 ? (
                    <div className="flex gap-2 text-base">
                      <span className="text-lime-600 flex items-center">
                        <FaArrowUpLong />
                        {postLastMonth}
                      </span>
                      <p className="">Tháng vừa qua</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 text-base">
                      <span className="text-red-700 flex items-center">
                        <FaArrowDownLong />
                        {postLastMonth}
                      </span>
                      <p className="">Tháng vừa qua</p>
                    </div>
                  )}
                </div>

                {/* ---------------| COMMENTS |---------------*/}
                <div className="flex flex-col p-3 gap-3 md:w-80 w-full rounded-md shadow-md dark:bg-slate-800">
                  <div className="flex justify-between">
                    <div className="">
                      <h3 className="uppercase text-xl">Tất cả bình luận:</h3>
                      <p className="text-4xl">{totalComment}</p>
                    </div>
                    <BiSolidCommentDetail className="p-3 bg-lime-700 text-white rounded-full text-7xl shadow-lg" />
                  </div>
                </div>
              </div>

              {/* ---------------| RECENT PART |---------------*/}
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {/* ---------------| RECENT USER |---------------*/}
                <div className="p-3 w-full md:w-auto font-semibold text-base rounded-md shadow-md dark:bg-slate-800 ">
                  <div className="flex justify-between p-3 font-semibold text-base">
                    <h3 className="uppercase text-center p-2">
                      Người dùng gần đây
                    </h3>
                    <Button outline gradientDuoTone="purpleToBlue">
                      <Link to="/users/get-users">Xem tất cả</Link>
                    </Button>
                  </div>
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
                      <Table.HeadCell>Tài khoản</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {userList.map((user) => (
                        <Table.Row key={user._id}>
                          <Table.Cell>
                            <img
                              src={user.profileImage}
                              alt={user.email}
                              className="w-16 h-16 object-cover rounded-full"
                              onError={(e) => {
                                e.target.src =
                                  "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>{user.username}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>

                {/* ---------------| RECENT COMMENT |---------------*/}
                <div className="p-3 w-full md:w-auto font-semibold text-base rounded-md shadow-md dark:bg-slate-800 ">
                  <div className="flex justify-between p-3 font-semibold text-base">
                    <h3 className="uppercase text-center p-2">
                      Các bình luận gần đây
                    </h3>
                    <Button outline gradientDuoTone="purpleToBlue">
                      <Link to="/comments/get-comments">Xem tất cả</Link>
                    </Button>
                  </div>
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell className="w-48">Tiêu đề</Table.HeadCell>
                      <Table.HeadCell>Bình luận</Table.HeadCell>
                      <Table.HeadCell>Lượt thích</Table.HeadCell>
                      <Table.HeadCell>Tác giả</Table.HeadCell>
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
                          <Table.Cell>
                            {comment.userInformation?.username}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>

                {/* ---------------| RECENT POSTS |---------------*/}
                <div className="p-3 w-full md:w-auto font-semibold text-base rounded-md shadow-md dark:bg-slate-800 ">
                  <div className="flex justify-between p-3 font-semibold text-base">
                    <h3 className="uppercase text-center p-2">
                      Bài viết gần đây
                    </h3>
                    <Button outline gradientDuoTone="purpleToBlue">
                      <Link to="/posts/get-posts">Xem tất cả</Link>
                    </Button>
                  </div>
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Ảnh minh họa</Table.HeadCell>
                      <Table.HeadCell>Tiêu đề</Table.HeadCell>
                      <Table.HeadCell>Thể loại</Table.HeadCell>
                      <Table.HeadCell>Tạo vào</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {postList.map((post) => (
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
                            {new Date(post.createdAt).toLocaleDateString(
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
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <p className="italic font-semibold text-red-700 mt-2">
              Bạn không có quyền hoặc danh sách rỗng!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
