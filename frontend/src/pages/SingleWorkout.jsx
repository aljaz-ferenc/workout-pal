import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOneWorkout } from "../api/api";
import { Heading, Text, Button, Flex } from "@chakra-ui/react";
import { BsArrowRepeat } from "react-icons/bs";
import { motion } from "framer-motion";
import DeleteModal from "../components/DeleteModal";
import { useUserStore } from "../store/userStore";

export default function SingleWorkout() {
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    getOneWorkout(workoutId)
      .then((res) => res.json())
      .then((workout) => {
        setWorkout(workout.data);
        workout = workout.data.id;
      });
  }, []);

  const deleteWorkout = () => {
    setModalIsOpen(true);
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <>
      {
        <DeleteModal
          isOpen={modalIsOpen}
          workoutId={workoutId}
          setModalIsOpen={setModalIsOpen}
        />
      }
      <Flex
        bg="#212A3E"
        color="#F1F6F9"
        justifyContent="center"
        alignItems="center"
        direction="column"
        width="full"
        height="full"
        className="single-workout"
      >
        <Heading>{workout.name}</Heading>
        <Flex
          w="fit-content"
          m="3rem 0"
          direction="column"
          gap="2rem"
          className="single-workout__exercises"
        >
          {workout.exercises.map((exercise, i) => (
            <Flex
              borderRadius="5px"
              border="1px solid #F1F6F9"
              justifyContent="flex-start"
              alignItems="center"
              key={i}
            >
              <Flex
                alignItems="center"
                borderRight="1px solid  #F1F6F9"
                h="full"
              >
                <Text fontWeight="bold" m="1rem">
                  {exercise.sets}X
                </Text>
              </Flex>
              <Flex m="0 1rem" direction="column">
                <Text fontWeight="bold">{exercise.name.toUpperCase()}</Text>
                <Text>{exercise.reps} reps</Text>
              </Flex>
            </Flex>
          ))}
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="1rem"
            fontSize="lg"
          >
            {workout.rounds > 1 && (
              <Text fontWeight="bold">Repeat {workout.rounds} times</Text>
            )}
            <motion.div
              animate={{
                transform: "rotate(360deg)",
                transition: { repeat: Infinity, ease: "linear", duration: 3 },
              }}
            >
              <BsArrowRepeat size={30} color="3182ce" />
            </motion.div>
          </Flex>
        </Flex>
        <Flex gap="2rem">
          {workout.user._id === userId && (
            <Button colorScheme="red" onClick={deleteWorkout}>
              Delete Workout
            </Button>
          )}
          <Button
            colorScheme="blue"
            onClick={() => navigate(`/workouts/${workoutId}/start`)}
          >
            Start Workout
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export const workoutLoader = async (workout) => {
  const response = await getOneWorkout(workout.params.workoutId);
  return response.json();
};
