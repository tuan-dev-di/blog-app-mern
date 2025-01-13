import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ allowedRoles = [] }) => {
  const curUser = useSelector((state) => state.user.currentUser);
  const userRole = curUser.user.role;

  if (!curUser || userRole !== "admin") {
    return <Navigate to="sign-in" />;
  }

  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="sign-in" />
  );
};

export default AdminPrivateRoute;
