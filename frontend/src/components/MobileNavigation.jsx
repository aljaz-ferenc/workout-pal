import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import "./Navigation.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CgGym } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { MdTravelExplore, MdLibraryAdd } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegWindowClose } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import "./Navigation.scss";
import { useState } from "react";
import { logoutUser } from "../api/api";

const hoverProps = {
  bg: "#2b6cb0",
  color: "white",
};

const activeProp = {
  bg: "#3182ce",
  color: "white",
};

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser().then((res) => {
      navigate("/login");
    });
  };

  return (
    <Box bg="#F1F6F9" className="mobile-navigation">
      <IconButton
        colorScheme="blue"
        borderRadius="0 0 8px 0"
        position="absolute"
        zIndex="1"
        icon={<GiHamburgerMenu />}
        onClick={() => setIsOpen(true)}
      />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <Box
            width="20rem"
            gridRow="1 /span 2"
            gridColumn={1}
            shadow="1px 1px 3px rgba(0, 0, 0, 0.2)"
            height="full"
          >
            <Flex direction="column" minH="100vh">
              <IconButton
                colorScheme="red"
                rounded={false}
                onClick={() => setIsOpen(false)}
                icon={<FaRegWindowClose />}
              />
              <Box onClick={() => setIsOpen(false)}>
                <NavItem path="/overview">
                  <AiOutlineHome size={30} />
                  <Link>Overview</Link>
                </NavItem>
              </Box>
              <Box onClick={() => setIsOpen(false)}>
                <NavItem path="/my-workouts">
                  <CgGym size={30} />
                  <Link>My Workouts</Link>
                </NavItem>
              </Box>
              <Box onClick={() => setIsOpen(false)}>
                <NavItem path="/create-workout">
                  <MdLibraryAdd size={30} />
                  <Link>Create Workout</Link>
                </NavItem>
              </Box>
              <Box onClick={() => setIsOpen(false)}>
                <NavItem path="/workouts">
                  <MdTravelExplore size={30} />
                  <Link>Explore Workouts</Link>
                </NavItem>
              </Box>
              <Box onClick={() => setIsOpen(false)}>
                <NavItem path="/account">
                  <BsFillPersonFill size={30} />
                  <Link>Account</Link>
                </NavItem>
              </Box>
              <Box onClick={handleLogout}>
                <NavItem>
                  <CgLogOut size={30} />
                  <Link>Logout</Link>
                </NavItem>
              </Box>
            </Flex>
          </Box>
        </DrawerContent>
      </Drawer>
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
