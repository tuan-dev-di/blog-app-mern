import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashboardSidebar, DashboardProfile } from "../components/_index";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) setTab(tabFromURL);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <DashboardSidebar />
      </div>
      {tab === "profile" && <DashboardProfile />}
    </div>
  );
};

export default Dashboard;
