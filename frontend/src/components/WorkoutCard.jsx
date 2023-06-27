import { useNavigate } from "react-router-dom";
import "./WorkoutCard.scss";
import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "beginner":
      return "#008000";
    case "intermediate":
      return "#FFA500 ";
    case "advanced":
      return "#8B0000";
    case "expert":
      return "#800080";
  }
};

export default function WorkoutCard({ workout, user, index }) {
  const navigate = useNavigate();
  return (
    <Box
      overflow="hidden"
      width="full"
      height="20rem"
      _hover={{
        cursor: "pointer",
        outline: "1px solid #F1F6F9",
        borderRadius: "10px",
      }}
      onClick={() => navigate(`/workouts/${workout._id}`)}
    >
      <motion.div
        initial={{ y: "200px", opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.05 * index } }}
        className="workout-card"
        style={{
          backgroundImage: `url(/${workout.difficulty}.webp)`,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <Flex direction="column" justifyContent="center" h="100%" p="1rem">
          <Heading fontSize="2rem" mb="2rem">
            {workout.name}
          </Heading>
          {user && <Text fontSize="1rem">Created by: {user}</Text>}
          <Text fontSize="1.5rem" mt="auto">
            Duration: {workout.duration} min
          </Text>
        </Flex>
        <Box
          backgroundColor={getDifficultyColor(workout.difficulty)}
          className="workout-card__difficulty"
        >
          {workout.difficulty.toUpperCase()}
        </Box>
      </motion.div>
    </Box>
  );
}
