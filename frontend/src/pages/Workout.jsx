import { useEffect, useReducer, useState } from "react";
import { useLoaderData } from "react-router-dom";
import WorkoutComplete from "../components/WorkoutComplete";
import { Box, Button, Heading, Text, Progress } from "@chakra-ui/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "nextSet": {
      return { ...state, currentSet: state.currentSet + 1 };
    }
    case "nextExercise": {
      return {
        ...state,
        currentSet: 1,
        exerciseCount: state.exerciseCount + 1,
        currentExercise: state.nextExercise,
        nextExercise: action.nextExercise,
      };
    }
    case "nextRound": {
      return {
        ...action.initialState,
        currentRound: state.currentRound + 1,
      };
    }
  }
};

const createInitialState = (workout) => {
  return {
    exerciseCount: 0,
    currentRound: 1,
    currentExercise: workout.exercises[0],
    nextExercise: workout.exercises[1],
    currentSet: 1,
  };
};

export default function Workout() {
  const workout = useLoaderData().data;
  const [workoutIsComplete, setWorkoutIsComplete] = useState(false);
  const [exerciseState, dispatch] = useReducer(
    reducer,
    workout,
    createInitialState
  );
  const [restCountdown, setRestCountdown] = useState(null);
  const [isResting, setIsResting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const next = () => {
    const setIsComplete =
      exerciseState.currentSet < exerciseState.currentExercise.sets;
    const exerciseIsComplete =
      exerciseState.currentSet >= exerciseState.currentExercise.sets;
    const roundIsComplete =
      exerciseIsComplete &&
      exerciseState.exerciseCount + 1 >= workout.exercises.length;
    const workoutIsComplete =
      roundIsComplete && exerciseState.currentRound >= workout.rounds;

    if (workoutIsComplete) return completeWorkout();
    if (roundIsComplete) return nextRound();
    if (setIsComplete) return nextSet();
    if (exerciseIsComplete) return nextExercise();
  };

  const nextSet = async () => {
    await rest(workout.restBetweenSets, "betweenSets");
    dispatch({ type: "nextSet" });
  };

  const nextExercise = async () => {
    await rest(workout.restBetweenRounds, "betweenExercises");
    dispatch({
      type: "nextExercise",
      exerciseCount: exerciseState.exerciseCount + 1,
      nextExercise: workout.exercises[exerciseState.exerciseCount + 2],
    });
  };

  const nextRound = () => {
    setIsPausing(true);
    dispatch({ type: "nextRound", initialState: createInitialState(workout) });
  };

  const completeWorkout = () => {
    setWorkoutIsComplete(true);
  };

  const rest = (time, type) => {
    setIsResting(type);
    setRestCountdown(time);

    return new Promise((resolve, _) => {
      const timer = setInterval(() => {
        setRestCountdown((prevCount) => {
          const newCount = prevCount - 1;

          if (newCount < 0) {
            clearInterval(timer);
            setIsResting(false);
            resolve();
          }
          return newCount;
        });
      }, 1000);
    });
  };

  const calcProgress = (value) => {
    return ((value - restCountdown) / value) * 100;
  };

  return (
    <Box
      color=" #F1F6F9"
      bg="#212A3E"
      position="absolute"
      top="50%"
      left="50%"
      h="full"
      w="full"
      display="grid"
      placeItems="center"
      transform="translate(-50%, -50%)"
      gridTemplateRows="repeat(3, calc(100% / 3))"
      textAlign="center"
    >
      {workoutIsComplete && (
        <WorkoutComplete workoutIsComplete={workoutIsComplete} />
      )}
      <Box className="workout__top">
        <Heading>
          Round {exerciseState.currentRound} / {workout.rounds}{" "}
          {isPausing && "complete"}
        </Heading>
      </Box>
      <Box maxWidth="30rem" w="full" className="workout__center">
        {!isResting && !isPausing && (
          <Box className="current-exercise">
            <Text fontSize="2rem">Current exercise:</Text>
            <Heading mb="2rem" fontSize="xxx-large">
              {exerciseState.currentExercise.name.toUpperCase()}
            </Heading>
            <Text fontSize="1.5rem">
              {exerciseState.currentExercise.reps} reps
            </Text>
            <Text mb="2rem" fontSize="1.5rem" className="current-exercise__set">
              Set {exerciseState.currentSet} /{" "}
              {exerciseState.currentExercise.sets}
            </Text>
            <Button
              w="full"
              colorScheme="blue"
              className="nextExerciseBtn"
              onClick={next}
            >
              Next
            </Button>
          </Box>
        )}
        {isResting && (
          <Box className="rest">
            <Heading fontSize="xxx-large">REST</Heading>
            <Heading fontSize="xxx-large">{String(restCountdown)}</Heading>
            <Progress
              mt="2rem"
              colorScheme="blue"
              variant="determinate"
              w="full"
              value={
                isResting === null
                  ? null
                  : isResting === "betweenSets"
                  ? calcProgress(workout.restBetweenSets)
                  : calcProgress(workout.restBetweenRounds)
              }
            />
          </Box>
        )}
        {isPausing && (
          <Box>
            <Text fontSize="1.5rem" mb="2rem">
              Continue with the next round whenever you're ready!
            </Text>
            <Button
              w="full"
              colorScheme="blue"
              onClick={() => setIsPausing(false)}
            >
              Next Round
            </Button>
          </Box>
        )}
      </Box>
      <Box className="workout__bottom">
        {isResting && (
          <Box className="next-exercise">
            <Text fontSize="1.5rem">Next exercise:</Text>
            <Text fontSize="2rem" fontWeight="bold">
              {exerciseState.currentSet < exerciseState.currentExercise.sets
                ? exerciseState.currentExercise.name.toUpperCase()
                : exerciseState?.nextExercise.name.toUpperCase()}
            </Text>
          </Box>
        )}
        {isPausing && (
          <Box className="next-exercise">
            <Text fontSize="1.5rem">Next exercise:</Text>
            <Text fontSize="2rem" fontWeight="bold">
              {workout.exercises[0].name.toUpperCase()}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
