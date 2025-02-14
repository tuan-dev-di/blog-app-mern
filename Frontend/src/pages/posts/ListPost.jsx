import { Button, Table, Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { RiDeleteBin2Line } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ListPost = () => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userId = curUser.user._id;
  const role = curUser.user.role;

  const [userPost, setUserPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/list-post?userId=${userId}`);
        const data = await res.json();
        console.log("DATA:", data);

        if (res.ok) setUserPost(data.posts);
      } catch (error) {
        console.log("ERROR:", error.message);
      }
    };
    if (role === "admin") fetchPosts();
  }, [userId, role]);

  return (
    <div className="relative mx-auto p-7 w-full">
      <div className="font-semibold text-4xl">List Post</div>
      <div className="absolute top-5 right-5">
        <Link to="/posts/create-post">
          <Button gradientMonochrome="teal">
            <FaPlus className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </Link>
      </div>
      <div>
        {role === "admin" && userPost.length > 0 ? (
          <div>
            <Table hoverable className="mt-7 shadow-md">
              <Table.Head>
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
                      <Link to={`/posts/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-32 h-16 object-cover "
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/posts/${post.slug}`}>{post.title}</Link>
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
                      <Tooltip
                        content="Edit"
                        style="light"
                        placement="bottom"
                        trigger="hover"
                      >
                        <LuPencil className="w-5 h-5" />
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        content="Remove"
                        style="light"
                        placement="bottom"
                        trigger="hover"
                      >
                        <RiDeleteBin2Line className="w-5 h-5 text-red-600" />
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <p className="italic font-semibold text-red-700"> You have no permission </p>
        )}
      </div>
    </div>
  );
};

export default ListPost;
