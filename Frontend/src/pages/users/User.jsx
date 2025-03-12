import { SidebarApp } from "../../components/_index";
import ListUser from "./ListUser";

const User = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <ListUser />
    </div>
  );
};

export default User;
