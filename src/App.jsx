import { Navigate, Route, Routes } from "react-router";
import { Drawer } from "./components/Drawer";
import { Homepage } from "./pages/Homepage";
import { UserRoute } from "./components/UserRoute";
import { AdminRoute } from "./components/AdminRoute";
import { useEffect, useState } from "react";
import { SignUp } from "./pages/auth/SignUp";
import { SignIn } from "./pages/auth/SignIn";
import { Dashboard } from "./pages/user/Dashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Footer } from "./components/Footer";
import { Profile } from "./pages/user/Profile";
import { DocumentUploadForm } from "./pages/user/DocumentUploadForm";
import { AccountForm } from "./pages/user/AccountForm";
import { TransferFrom } from "./pages/user/TransferFrom";
import { Loading } from "./components/Loading";
import { AccountSummary } from "./pages/admin/AccountSummary";
import { UserKyc } from "./pages/admin/UserKyc";
import { AuditLogs } from "./pages/admin/AuditLogs";

export const App = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isToken, setIsToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split(".")[1]));

        if (userInfo.role === "admin") {
          setAdmin(userInfo);
        } else if (userInfo.role === "user") {
          setUser(userInfo);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setIsToken(false);
  }, []);

  if (isToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Drawer
              user={user}
              setUser={setUser}
              admin={admin}
              setAdmin={setAdmin}
            />
          }
        >
          {/* <Route index element={<Homepage />} /> */}
          <Route path="home" element={<Homepage user={user} admin={admin} />} />
          <Route
            path="sign-up"
            element={
              !user && !admin ? (
                <SignUp />
              ) : admin ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                user && <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="sign-in"
            element={
              !user && !admin ? (
                <SignIn setUser={setUser} setAdmin={setAdmin} />
              ) : admin ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                user && <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="settings" element={<h1>Settings</h1>} />

          {/* USER */}
          <Route element={<UserRoute user={user} />}>
            <Route path="dashboard" element={<Dashboard user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />
            <Route
              path="upload-kyc"
              element={<DocumentUploadForm user={user} />}
            />
            <Route path="open-account" element={<AccountForm user={user} />} />
            <Route path="transfer" element={<TransferFrom user={user} />} />
          </Route>

          {/* ADMIN */}
          <Route element={<AdminRoute admin={admin} />}>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-account" element={<AccountSummary />} />
            <Route path="admin-kyc" element={<UserKyc />} />
            <Route path="admin-logs" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<h1>Page not found 404</h1>} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};
