import React from "react";
import { USER_TYPES } from "../../Data";
import { useAuth } from "../../Hooks";
import RestrictedPage from "./RestrictedPage";

function UserOnlyPage({ children }) {
  const { user, setUser } = useAuth();

  const credentials = {
    username: "smartworld",
    password: "sw$999",
  };

  const isAdminLoggedIn = user && user.login && user.type === USER_TYPES.USER;
  const setAdminLoggedIn = () =>
    setUser({
      login: true,
      type: USER_TYPES.USER,
    });

  return (
    // <RestrictedPage
    //   credentials={credentials}
    //   isLoggedIn={isAdminLoggedIn}
    //   setIsLoggedIn={setAdminLoggedIn}
    //   loginTitle={"SmartWorld Login"}
    // >
    children
    // </RestrictedPage>
  );
}

export default UserOnlyPage;
