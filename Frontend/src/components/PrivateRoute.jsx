//? ---------------| IMPORT LIBRARIES |---------------
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const curUser = useSelector((state) => state.user.currentUser);

  return curUser ? <Outlet /> : <Navigate to="sign-in" />;
};

export default PrivateRoute;
