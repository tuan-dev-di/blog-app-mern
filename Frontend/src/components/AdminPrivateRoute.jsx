import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

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

AdminPrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default AdminPrivateRoute;
