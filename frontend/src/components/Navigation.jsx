import { Box, Flex, Text } from "@chakra-ui/react";
import "./Navigation.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgGym } from "react-icons/cg";
import { BsFillPersonFill } from "react-icons/bs";
import { MdTravelExplore, MdLibraryAdd } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../api/api";

const hoverProps = {
  bg: "#2b6cb0",
  color: "white",
};

const activeProp = {
  bg: "#3182ce",
  color: "white",
};

export default function Navigation() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser().then((res) => {
      navigate("/login");
    });
  };
  return (
    <Box
      bg="#F1F6F9"
      className="navigation"
      width="20rem"
      gridRow="1 /span 2"
      gridColumn={1}
      shadow="1px 1px 3px rgba(0, 0, 0, 0.2)"
      height="full"
    >
      <Flex direction="column" minH="100vh">
        <NavItem path="/my-workouts">
          <CgGym size={30} />
          <Text>My Workouts</Text>
        </NavItem>
        <NavItem path="/create-workout">
          <MdLibraryAdd size={30} />
          <Text>Create Workout</Text>
        </NavItem>
        <NavItem path="/workouts">
          <MdTravelExplore size={30} />
          <Text>Explore Workouts</Text>
        </NavItem>
        <NavItem path="/account">
          <BsFillPersonFill size={30} />
          <Text>Account</Text>
        </NavItem>
        <Box onClick={handleLogout}>
          <NavItem>
            <CgLogOut size={30} />
            <Text>Logout</Text>
          </NavItem>
        </Box>
      </Flex>
    </Box>
  );
}

const NavItem = ({ children, path }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Flex
      cursor="pointer"
      onClick={() => navigate(path)}
      p="1rem"
      justifyContent="flex-start"
      gap="2rem"
      _hover={hoverProps}
      color={location.pathname === path && activeProp.color}
      bg={location.pathname === path && activeProp.bg}
    >
      {children}
    </Flex>
  );
};
