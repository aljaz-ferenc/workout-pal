import "./Sidebar.scss";
import { NavLink } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { CgGym, CgProfile } from "react-icons/cg";
import { GrAdd } from "react-icons/gr";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/">
        Home
        <HiHome size={25} />
      </NavLink>
      <NavLink to="workouts">
        Workouts
        <CgGym size={25} />
      </NavLink>
      <NavLink to="profile">
        New Workout
        <GrAdd size={25} />
      </NavLink>
      <NavLink to="profile">
        Profile
        <CgProfile size={25} />
      </NavLink>
    </div>
  );
}
