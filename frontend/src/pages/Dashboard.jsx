import "./Dashboard.scss";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <Outlet />
    </div>
  );
}
