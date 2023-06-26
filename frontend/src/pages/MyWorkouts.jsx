import React, { useEffect, useState } from "react";
import { getMyWorkouts } from "../api/api";
import { Box, Grid, Heading } from "@chakra-ui/react";
import WorkoutCard from "../components/WorkoutCard";
import "./MyWorkouts.scss";

export default function MyWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    getMyWorkouts()
      .then((res) => res.json())
      .then((json) => {
        if (workouts.status === "fail") throw new Error(json.message);
        setWorkouts(json.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <Box p="2rem" bg="#212A3E" h={"full"} className="my-workouts">
      <Heading color="#F1F6F9" className="my-workouts__heading" pb="2rem">
        My Workouts
      </Heading>
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
