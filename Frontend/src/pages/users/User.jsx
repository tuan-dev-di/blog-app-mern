//? ---------------| IMPORT LIBRARIES |---------------
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Table, Tooltip, Pagination } from "flowbite-react";
import { IoRefresh } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { GET_USERS } from "../../apis/user";
import { SidebarApp } from "../../components/_index";

const User = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  /*
   * Set pagination
   * Set 7 users per page
   */
  const limitUsers = 7;
  const [userList, setUserList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [userLastMonth, setUserLastMonth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //? ---------------| HANDLE GET LIST POST |---------------
  const list_users = useCallback(async () => {
    try {
      const data = await GET_USERS(userId, currentPage, limitUsers);
      if (!data) toast.error(data.message, { theme: "colored" });

      setUserList(data.users);
      setTotalPage(data.totalPage);
      setTotalUser(data.totalUser);
      setUserLastMonth(data.userLastMonth);
    } catch (error) {
      console.log("Get user error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, currentPage, limitUsers]);

  useEffect(() => {
    if (role === "admin") list_users();
  }, [role, list_users]);

  //? ---------------| HANDLE REFRESH LIST USER |---------------
  const handleRefresh = async () => {
    await list_users();
    toast.success("Danh sách người dùng đã được tải lại!", {
      theme: "colored",
    });
  };

  //? ---------------| HANDLE CHANGE PAGE |---------------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <div className="relative mx-auto p-7 w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center">
          <div className="font-semibold text-4xl">
            Danh sách thành viên người dùng
          </div>
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
              Tổng người dùng: <strong>{totalUser}</strong>
            </p>
          ) : (
            <p>Quyền truy cập của bạn không được cho phép!</p>
          )}
        </span>
        <span className="flex flex-col text-left text-base">
          {role === "admin" ? (
            <p>
              Thành viên mới trong tháng vừa qua:{" "}
              <strong>{userLastMonth}</strong>
            </p>
          ) : (
            <p>Quyền truy cập của bạn không được cho phép!</p>
          )}
        </span>
        <div>
          {role === "admin" && userList.length > 0 ? (
            <div>
              <Table hoverable className="mt-7 shadow-md dark:bg-slate-800">
                <Table.Head className="text-base">
                  <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
                  <Table.HeadCell>Tên người dùng</Table.HeadCell>
                  <Table.HeadCell>Tài khoản</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Chức vụ</Table.HeadCell>
                  <Table.HeadCell>Đăng ký vào</Table.HeadCell>
                  <Table.HeadCell>Cập nhật vào</Table.HeadCell>
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
                      <Table.Cell>{user.displayName}</Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <span
                          className={`px-4 py-2 text-sm font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(user.updatedAt).toLocaleDateString("en-GB", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
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
      </div>
    </div>
  );
};

export default User;
