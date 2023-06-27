import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Heading,
  Input,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useExerciseStore, useUserStore } from "../store/userStore";
import { createWorkout } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import './CreateWorkoutAddExercises.scss'

export default function CreateWorkoutAddExercises({ setState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const addExercise = useExerciseStore((state) => state.addExercise);
  const exercises = useExerciseStore((state) => state.exercises);
  const workout = useExerciseStore((state) => state.workout);
  const removeExercise = useExerciseStore((state) => state.removeExercise);
  const removeAllExercises = useExerciseStore(
    (state) => state.removeAllExercises
  );
  const userId = useUserStore((state) => state.user.id);
  const clearWorkout = useExerciseStore((state) => state.clearWorkout);
  const navigate = useNavigate();

  const clearForm = () => {
    setName("");
    setSets("");
    setReps("");
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    const newExercise = {
      name,
      reps: Number(reps),
      sets: Number(sets),
      id: crypto.randomUUID(),
    };
    clearForm();

    addExercise(newExercise);
    setIsOpen(true);
  };

  const handleSubmitWorkout = () => {
    setIsSubmitting(true);
    const newWorkout = { ...workout, exercises, user: userId };
    console.log(newWorkout.user);
    createWorkout(newWorkout)
      .then((res) => {
        if (res.status === "success") {
          setHasSubmitted(true);
          clearForm();
          removeAllExercises();
          clearWorkout();
          setTimeout(() => {
            navigate("/my-workouts");
          }, 2000);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleCloseDrawer = () => {
    setError(null);
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <motion.form
    className="exercise-form-container"
      style={{
        backgroundColor: "white",
        padding: "2rem",
      }}
      onSubmit={handleAddExercise}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
    >
      <Heading >Add Exercise</Heading>
      <Text m="1rem 0">
        Multiple exercises make up one round, which can be repeated multiple
        times.
      </Text>
      <FormControl mb="3rem">
        <Text>
          <strong>Name</strong>
        </Text>
        <Input
          onChange={(e) => setName(e.target.value)}
          required
          rounded="none"
          variant="filled"
          value={name}
        />
      </FormControl>
      <FormControl mb="3rem">
        <Text>
          <strong>Sets</strong> - How many times the exercise should be repeated
          consecutively
        </Text>
        <Input
          type="number"
          onChange={(e) => setSets(e.target.value)}
          required
          min={1}
          rounded="none"
          variant="filled"
          value={sets}
        />
      </FormControl>
      <FormControl mb="3rem">
        <Text>
          <strong>Reps</strong> - How many repetitions should be performed in
          one set
        </Text>
        <Input
          type="number"
          onChange={(e) => setReps(e.target.value)}
          required
          min={1}
          rounded="none"
          variant="filled"
          value={reps}
        />
      </FormControl>
      <Flex className="exercise-buttons" justifyContent="space-between">
        <Button colorScheme="blue" onClick={() => setState(1)}>
          Back
        </Button>
        <Button colorScheme="blue" type="submit">
          Add Exercise to Workout
        </Button>
        <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
          View Workout
        </Button>
      </Flex>
      <Drawer isOpen={isOpen} onClose={handleCloseDrawer} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          {hasSubmitted && (
            <>
              <Alert flexDir="column" textAlign="center" status="success">
                <AlertIcon />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your workout has been successfully submitted!
                </AlertDescription>
              </Alert>
              <ProgressBar color='#38a169' />
            </>
          )}
          {error && (
            <Alert flexDir="column" textAlign="center" status="error">
              <AlertIcon />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isSubmitting && (
            <DrawerHeader>
              <Heading mb="1rem">{workout.name}</Heading>
              <Text>Rest between sets: {workout.restBetweenSets} sec</Text>
              <Text>Rest between rounds: {workout.restBetweenRounds} sec</Text>
            </DrawerHeader>
          )}

          {!isSubmitting && (
            <DrawerBody>
              <Flex width="100%" direction="column" gap="1rem">
                <Heading fontSize="x-large">Exercises</Heading>
                {exercises.map((exercise, i) => (
                  <Flex
                    key={i}
                    justifyContent="space-between"
                    alignItems="center"
                    boxShadow="lg"
                    border="1px solid #eee"
                    borderRadius={5}
                  >
                    <Flex flexDir="column" gap={1} p={2}>
                      <Text as="b" fontSize="lg">
                        {exercise.name}
                      </Text>
                      <Text>Reps: {exercise.reps}</Text>
                      <Text>Sets: {exercise.sets}</Text>
                    </Flex>
                    <Button
                      onClick={() => removeExercise(exercise.id)}
                      height="100"
                      rounded={false}
                      color="red"
                    >
                      <MdDeleteForever size="2rem" />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </DrawerBody>
          )}
          {!isSubmitting && (
            <DrawerFooter display="flex" justifyContent="space-between">
              <Button
                onClick={removeAllExercises}
                colorScheme="red"
                isLoading={isSubmitting}
              >
                Remove All
              </Button>

              <Button
                onClick={handleSubmitWorkout}
                colorScheme="blue"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </motion.form>
  );
}


