//? ---------------| IMPORT LIBRARIES |---------------
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { SidebarApp } from "../../components/_index";
import DetailAccount from "./DetailAccount";

const Profile = () => {
  // const location = useLocation();
  // const [tab, setTab] = useState("");

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(location.search);
  //   const tabFromURL = urlParams.get("tab");
  //   if (tabFromURL) setTab(tabFromURL);
  // }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      {/* {tab === "profile" && <DetailAccount />} */}
      <DetailAccount />
    </div>
  );
};

export default Profile;
