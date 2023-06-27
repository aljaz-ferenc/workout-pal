import { Box, Button, Heading } from "@chakra-ui/react";
import "./WorkoutComplete.scss";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

export default function WorkoutComplete({ workoutIsComplete }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: workoutIsComplete ? 0 : "-100%" }}
      className="workout-complete"
      style={{ backgroundColor: "#212A3E" }}
    >
      <Box>
        <Heading fontSize="2rem">
          You have completed the workout, good job!
        </Heading>
        <Button
          onClick={() => navigate("/workouts")}
          colorScheme="blue"
          mt="2rem"
        >
          Back to workouts
        </Button>
      </Box>
      <Confetti className="workout-complete__confetti"/>
    </motion.div>
  );
}
