import React from "react";
import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import { authenticateUser } from "../api/api";
import { useUserStore } from "../store/userStore";

export default function Protected() {
  const setUser = useUserStore((state) => state.setUser);
  const auth = useLoaderData();
  const userId = auth.data._id;

  setUser(userId);

  return auth.status === "fail" ? <Navigate to="/login" /> : <Outlet />;
}

export const protectedLoader = async () => {
  const response = await authenticateUser();
  if (response.status === "fail") return redirect("/login");
  return response;
};
