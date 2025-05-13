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

const ListPost = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  /*
   * Set pagination
   * Set 7 posts per page
   */
  const [userList, setUserList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [userLastMonth, setUserLastMonth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Set delete function with modal
   */

  //? ---------------| GET LIST POST |---------------
  const list_users = useCallback(async () => {
    try {
      const data = await GET_USERS(userId, currentPage);
      if (!data) toast.error(data.message, { theme: "colored" });

      setUserList(data.users);
      setTotalPage(data.totalPage);
      setTotalUser(data.totalUser);
      setUserLastMonth(data.userLastMonth);
    } catch (error) {
      console.log("Get user error:", error.message);
      toast.error(error.message, { theme: "colored" });
    }
  }, [userId, currentPage]);

  useEffect(() => {
    if (role === "admin") list_users();
  }, [role, list_users]);

  //? ---------------| HANDLE REFRESH LIST USER |---------------
  const handleRefresh = async () => {
    await list_users();
    toast.success("List Users Refreshed!", { theme: "colored" });
  };

  //? ---------------| HANDLE CHANGE PAGE |---------------
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) setCurrentPage(page);
  };

  return (
    <div className="relative mx-auto p-7 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <div className="font-semibold text-4xl">List User</div>
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
      <div>
        {role === "admin" && userList.length > 0 ? (
          <div>
            <Table hoverable className="mt-7 shadow-md">
              <Table.Head className="text-base">
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Full Name</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Updated At</Table.HeadCell>
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
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(user.updatedAt).toLocaleDateString("en-GB", {
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
              />
            </div>
          </div>
        ) : (
          <p className="italic font-semibold text-red-700 mt-2">
            You have no permission or list user is empty!
          </p>
        )}
      </div>
    </div>
  );
};

export default ListPost;
