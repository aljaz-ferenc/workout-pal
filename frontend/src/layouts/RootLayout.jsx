import React, { useEffect } from "react";
import Navigation from "../components/Navigation";
import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import "./RootLayout.scss";
import MobileNavigation from "../components/MobileNavigation";
import { useUserStore } from "../store/userStore";
import { authenticateUser } from "../api/api";

export default function RootLayout() {
  const setUser = useUserStore((state) => state.setUser);
  const auth = useLoaderData();
  const userId = auth.data._id;

  setUser(userId); 

  if(auth.status === "fail") return <Navigate to="/login"/>


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

export const protectedLoader = async () => {
  const response = await authenticateUser();
  if (response.status === "fail") return redirect("/login");
  return response;
};