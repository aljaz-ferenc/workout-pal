import "./Workouts.scss";
import WorkoutCard from "../components/WorkoutCard";
import { useEffect, useState } from "react";
import { getAllWorkouts } from "../api/api";
import {
  Box,
  Flex,
  Heading,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { BiSearchAlt } from "react-icons/bi";

export default function Workouts() {
  console.log('workouts')
  const [workouts, setWorkouts] = useState();
  const [search, setSearch] = useState("");
  const [displayedWorkouts, setDisplayedWorkouts] = useState();
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    getAllWorkouts().then((res) => {
      if (res.status === "success") {
        setWorkouts(res.data);
        setDisplayedWorkouts(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!workouts) return;
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDisplayedWorkouts(
        workouts.filter((workout) =>
          workout.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setIsDebouncing(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <Flex bg="#212A3E" h="full" direction="column" gap="2rem" p="2rem">
      <Heading color="#F1F6F9" className="workouts__heading">
        Explore Workouts
      </Heading>
      <InputGroup>
        <InputLeftElement>
          <BiSearchAlt color="#212A3E" size={20} />
        </InputLeftElement>
        {isDebouncing && (
          <InputRightElement h="100%" className="workouts-spinner">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="md"
            />
          </InputRightElement>
        )}
        <Input
          onChange={(e) => setSearch(e.target.value)}
          w="full"
          bg="#9BA4B5"
          placeholder="Search for workouts..."
        />
      </InputGroup>
      <Box>
        <Grid
          templateColumns="repeat(auto-fill, minmax(15rem, 1fr))"
          gap="1rem"
          width="100%"
          height="100%"
        >
          {displayedWorkouts &&
            displayedWorkouts.map((workout, i) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                user={workout.user.name}
                index={i}
              />
            ))}
        </Grid>
      </Box>
    </Flex>
  );
}
