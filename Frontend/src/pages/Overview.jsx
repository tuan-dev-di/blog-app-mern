import { SidebarApp } from "../components/_index";

const Overview = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <SidebarApp />
      </div>
      <div>
        Overview Page
      </div>
    </div>
  );
};

export default Overview;
