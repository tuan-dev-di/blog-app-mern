//? ---------------| IMPORT COMPONENTS |---------------
import { SidebarApp } from "../../components/_index";
import DetailAccount from "./DetailAccount";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <DetailAccount />
    </div>
  );
};

export default Profile;
