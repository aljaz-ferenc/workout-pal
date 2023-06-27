import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import "./RootLayout.scss";
import MobileNavigation from "../components/MobileNavigation";
import { useUserStore } from "../store/userStore";
import { authenticateUser } from "../api/api";

export default function RootLayout() {
  const [verified, setVerified] = useState(null);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    authenticateUser()
    .then((res) => {
      if (res.status === "success") {
        setUser(res.data)
          return setVerified(res.status);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setVerified("fail");
      });
  }, []);

  if (verified === "fail") {
    return <Navigate to="/login" />;
  } else if (verified === "success") {
    return (
      <div className="root-layout">
        <Navigation />
        <MobileNavigation />
        <div style={{ position: "relative", width: "100%" }}>
          <Outlet />
        </div>
      </div>
    );
  }
}
