import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import "./RootLayout.scss";
import MobileNavigation from "../components/MobileNavigation";
import { useUserStore } from "../store/userStore";
import { authenticateUser } from "../api/api";

export default function RootLayout() {
  const [verified, setVerified] = useState(null)
  const setUser = useUserStore((state) => state.setUser);
  const auth = useLoaderData();
  
  setUser(auth.data)

  // // console.log('yo')

  // // setUser(userId); 

  
  // useEffect(() => {
  //   authenticateUser()
  //   .then(res => {
  //     setVerified(res.status)
  //   })
  //   .catch(err => console.log(err.message))
  // }, [])
  
  // if(verified === "fail") {
  //   return <Navigate to="/login"/>
  // }else if(verified === 'success'){
    
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
// }

export const protectedLoader = async () => {
  const response = await authenticateUser();
  console.log('fofo')
  if (response.status === "fail") return redirect("/login");
  return response;
};