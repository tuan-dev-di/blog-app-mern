//? ---------------| IMPORT LIBRARIES |---------------
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-teal-500 h-[370px] overflow-hidden rounded-lg sm:w-[350px] transition-all mx-auto ">
      <Link to={`/posts/get-posts/detail/${post.slug}`}>
        <img
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
          src={post.image}
          alt={post.title}
        />
      </Link>
      <div className="flex flex-col p-3 gap-2">
        <p className="text-lg font-semibold">{post.title}</p>
        <span className="italic text-xs">{post.category}</span>
        <Link
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-slate-50 transition-all duration-300 text-center py-2 rounded-md m-2"
          to={`/posts/get-posts/detail/${post.slug}`}
        >
          Xem bài này
        </Link>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostCard;
