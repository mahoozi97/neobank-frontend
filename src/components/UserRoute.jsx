import { Navigate, Outlet } from "react-router";

export const UserRoute = ({ user }) => {
  // if no user → redirect to sign-in, otherwise render the page
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
};
