import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa";

const PostTable = () => {
  return (
    <div className="relative mx-auto p-5 w-full">
      <div className="font-semibold text-4xl">Post List</div>
      <div className="absolute top-5 right-5">
        <Link to="/posts/create-post">
          <Button gradientMonochrome="teal">
            <FaPlus className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostTable;
