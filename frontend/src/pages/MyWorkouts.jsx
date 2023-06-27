import React, { useEffect, useState } from "react";
import { getMyWorkouts } from "../api/api";
import { Box, Button, Grid, Heading, Spinner, Text } from "@chakra-ui/react";
import WorkoutCard from "../components/WorkoutCard";
import "./MyWorkouts.scss";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function MyWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [isFetching, setIsFetching] = useState(false)
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetching(true)
    getMyWorkouts(user.id)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "fail") throw new Error(json.message);
        console.log(json)
        setWorkouts(json.data);
        console.log(workouts)
      })
      .catch((err) => console.log(err.message))
      .finally(() => setIsFetching(false))
  }, []);

  return (
    <Box color="white" p="2rem" bg="#212A3E" h={"full"} className="my-workouts">
      <Heading color="#F1F6F9" className="my-workouts__heading" pb="2rem">
        My Workouts
      </Heading>
      {!isFetching && workouts.length === 0 && (
        <Box>
          <Text mb="2rem">You haven't created any workouts yet.</Text>
          <Button
            onClick={() => navigate("/create-workout")}
            colorScheme="blue"
          >
            Create your first workout
          </Button>
        </Box>
      )}
      {isFetching && (
        <Box 
          w='full'
          display='grid'
          placeContent='center'
        >
        <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        />
        </Box>
      )}
      <Grid
        templateColumns="repeat(auto-fill, minmax(15rem, 1fr))"
        gap="1rem"
        width="100%"
      >
        {workouts &&
          workouts.length > 0 &&
          workouts.map((workout, i) => (
            <WorkoutCard key={workout._id} index={i} workout={workout} />
          ))}
      </Grid>
    </Box>
  );
}
