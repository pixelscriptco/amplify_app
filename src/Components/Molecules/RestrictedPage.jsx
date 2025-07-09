import React from "react";
import { useAuth } from "../../Hooks";
// import Login from "../../Pages/Login";

function RestrictedPage({
  children,
  isLoggedIn,
  setIsLoggedIn,
  credentials,
  loginTitle,
}) {
  return  (
    children
  );
}

export default RestrictedPage;
