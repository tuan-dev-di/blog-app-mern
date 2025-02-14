import { SidebarApp } from "../../components/_index";
import ListPost from "./ListPost";

const Post = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <ListPost />
    </div>
  );
};

export default Post;
