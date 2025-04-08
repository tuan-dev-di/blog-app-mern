import PropTypes from "prop-types";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { AiFillLike } from "react-icons/ai";

import { GET_USER } from "../../apis/comment";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const userId_comment = comment.userId;
  const curUser = useSelector((state) => state?.user?.currentUser);
  const user_id = curUser.user._id;

  //? ---------------| GET USER WHO COMMENTED |---------------
  const get_user = useCallback(async () => {
    try {
      const data = await GET_USER(userId_comment);
      if (data) setUser(data);
    } catch (error) {
      console.log("Get User - ERROR:", error.message);
    }
  }, [userId_comment]);

  useEffect(() => {
    get_user();
  }, [get_user]);

  return (
    <div className="flex p-4 border-b dark:border-gray-500 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profileImage}
          alt={user.email}
          className="w-10 h-10 object-cover rounded-full"
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold truncate ">
            {user ? `@${user.username}` : "Unknown User"}
          </span>
          <span className="text-gray-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="pb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-sm gap-2">
          <button
            className={`border-none hover:text-blue-600 
              ${curUser && comment.likes.includes(user_id) && "!text-blue-600"}
              `}
            color="gray"
            onClick={() => onLike(comment._id)}
          >
            <AiFillLike className="text-sm" />
          </button>
          <p className="text-gray-600 text-sm">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "Like" : "Likes")}
          </p>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  onLike: PropTypes.func.isRequired,
  comment: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]).isRequired,
    likes: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    numberOfLikes: PropTypes.number.isRequired,
  }).isRequired,
};

export default Comment;
