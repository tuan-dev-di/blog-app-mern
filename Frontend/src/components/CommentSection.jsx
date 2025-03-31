import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Label, Textarea, Button } from "flowbite-react";

const CommentSection = ({ postId }) => {
  const curUser = useSelector((state) => state?.user?.currentUser);

  const [comment, setComment] = useState("");

  //? ---------------| HANDLE SUBMIT COMMENT |---------------
  const handleSubmitComment = (e) => {};

  return (
    <div className="max-w-2xl w-full mx-auto p-2">
      {curUser ? (
        <div className="flex items-center gap-2 my-5">
          <p>Signed in as: </p>
          <img
            src={curUser.user.profileImage}
            alt=""
            className="w-7 h-7 object-cover rounded-full"
            onError={(e) => {
              e.target.src =
                "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg";
            }}
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-sm text-cyan-600 hover:underline"
          >
            {curUser.user.username} - {curUser.user.email}
          </Link>
        </div>
      ) : (
        <div className="text-sm italic">
          You must be
          <Link
            className="mx-1 text-sm text-cyan-600 hover:underline"
            to={"/sign-in"}
          >
            sign in
          </Link>
          to comment.
        </div>
      )}
      {curUser && (
        <form onSubmit={handleSubmitComment}>
          <Label className="text-base" value="Your comment" />
          <Textarea
            id="comment"
            placeholder="Add your comment..."
            rows={4}
            maxLength="300"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="italic text-sm text-gray-500">
              {300 - comment.length} character remaining
            </p>
            <Button outline gradientDuoTone="greenToBlue" type="submit">
              Comment
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
