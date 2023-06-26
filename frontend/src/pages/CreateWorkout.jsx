import { Box } from "@chakra-ui/react";
import { useState } from "react";
import "./CreateWorkout.scss";
import CreateWorkoutInfo from "../components/CreateWorkoutInfo";
import CreateWorkoutAddExercises from "../components/CreateWorkoutAddExercises";
import { AnimatePresence } from "framer-motion";

export default function CreateWorkout() {
  const [state, setState] = useState(1);

  return (
    <Box bg="#212A3E" className="create-workout">
      <AnimatePresence>
        {state === 1 && <CreateWorkoutInfo setState={setState} state={state} />}
        {state === 2 && (
          <CreateWorkoutAddExercises setState={setState} state={state} />
        )}
      </AnimatePresence>
    </Box>
  );
}
