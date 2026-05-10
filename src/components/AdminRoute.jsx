import { Navigate, Outlet } from "react-router";

export const AdminRoute = ({ admin }) => {
  // if no admin → redirect to sign-in, otherwise render the page
  return admin ? <Outlet /> : <Navigate to="/sign-in" replace />;
};
