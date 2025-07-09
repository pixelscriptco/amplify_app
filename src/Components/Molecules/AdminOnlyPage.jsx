import React from "react";
import { USER_TYPES } from "../../Data";
import { useAuth } from "../../Hooks";
// import RestrictedPage from "./RestrictedPage";

function AdminOnlyPage({ children }) {
  const { user, setUser } = useAuth();

  const credentials = {
    username: "admin",
    password: "admin",
  };

  const isAdminLoggedIn = user && user.login && user.type === USER_TYPES.ADMIN;
  const setAdminLoggedIn = () =>
    setUser({
      login: true,
      type: USER_TYPES.ADMIN,
    });

  return (
    // <RestrictedPage
    //   credentials={credentials}
    //   isLoggedIn={isAdminLoggedIn}
    //   setIsLoggedIn={setAdminLoggedIn}
    //   loginTitle={"SmartWorld Admin"}
    // >
      {children}
    // </RestrictedPage>
  );
}

export default AdminOnlyPage;
