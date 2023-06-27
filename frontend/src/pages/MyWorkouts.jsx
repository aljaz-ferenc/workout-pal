import React, { useEffect, useState } from "react";
import { getMyWorkouts } from "../api/api";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";
import WorkoutCard from "../components/WorkoutCard";
import "./MyWorkouts.scss";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function MyWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    getMyWorkouts(user.id)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "fail") throw new Error(json.message);
        console.log(json)
        setWorkouts(json.data);
        console.log(workouts)
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <Box color="white" p="2rem" bg="#212A3E" h={"full"} className="my-workouts">
      <Heading color="#F1F6F9" className="my-workouts__heading" pb="2rem">
        My Workouts
      </Heading>
      {workouts.length === 0 && (
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
