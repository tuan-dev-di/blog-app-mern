import { SidebarApp } from "../../components/_index";
import PostTable from "../posts/PostTable";

const Post = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <PostTable />
    </div>
  );
};

export default Post;
