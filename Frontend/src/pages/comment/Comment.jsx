import { SidebarApp } from "../../components/_index";
import ListComment from "./ListComment";

const Comment = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <ListComment />
    </div>
  );
};

export default Comment;
