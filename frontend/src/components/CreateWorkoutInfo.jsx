import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useExerciseStore } from "../store/userStore";
import { useState } from "react";
import './CreateWorkoutInfo.scss'

export default function CreateWorkoutInfo({ setState }) {
  const workout = useExerciseStore((state) => state.workout);
  const updateWorkout = useExerciseStore((state) => state.updateWorkout);
  const [name, setName] = useState(workout.name || "");
  const [rounds, setRounds] = useState(workout.rounds || "");
  const [difficulty, setDifficulty] = useState(workout.difficulty || '')
  const [duration, setDuration] = useState(workout.duration || '')
  const [restBetweenSets, setRestBetweenSets] = useState(
    workout.restBetweenSets || ""
  );
  const [restBetweenRounds, setRestBetweenRounds] = useState(
    workout.restBetweenRounds || ""
  );
  const [isPublic, setIsPublic] = useState(false);

  const handleAddWorkout = (e) => {
    e.preventDefault();
    updateWorkout({
      name,
      rounds: Number(rounds),
      restBetweenSets: Number(restBetweenSets),
      restBetweenRounds: Number(restBetweenRounds),
      public: isPublic,
      difficulty,
      duration
    });
    setState(2);
  };

  return (
    <motion.form
    className="info-form-container"
      onSubmit={handleAddWorkout}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      style={{backgroundColor: 'white', padding: '2rem'}}
    >
      <Heading mb="2rem">Create a new workout</Heading>
      <FormControl mb="3rem">
        <FormLabel>Name</FormLabel>
        <Input
          onChange={(e) => setName(e.target.value)}
          rounded="none"
          variant="filled"
          type="text"
          name="name"
          value={name}
          required
        />
      </FormControl>
      <FormControl mb="3rem">
        <FormLabel>Rounds</FormLabel>
        <Input
          onChange={(e) => setRounds(e.target.value)}
          rounded="none"
          variant="filled"
          type="number"
          name="rounds"
          value={rounds}
          required
          min={1}
        />
      </FormControl>
      <Flex direction='column'>
        <FormControl mb="3rem">
          <FormLabel>Rest between sets</FormLabel>
          <InputGroup>
            <Input
              onChange={(e) => setRestBetweenSets(e.target.value)}
              rounded="none"
              variant="filled"
              type="number"
              name="rest"
              value={restBetweenSets}
              required
              min={5}
            />
            <InputRightAddon children="seconds" />
          </InputGroup>
        </FormControl>
        <FormControl mb="3rem">
          <FormLabel>Rest between rounds</FormLabel>
          <InputGroup>
            <Input
              onChange={(e) => setRestBetweenRounds(e.target.value)}
              rounded="none"
              variant="filled"
              type="number"
              name="restBetweenRounds"
              value={restBetweenRounds}
              required
              min={5}
            />
            <InputRightAddon children="seconds" />
          </InputGroup>
        </FormControl>
        <FormControl mb="3rem">
          <FormLabel>Duration</FormLabel>
          <InputGroup>
            <Input
              onChange={(e) => setDuration(e.target.value)}
              rounded="none"
              variant="filled"
              type="number"
              name="duration"
              value={duration}
              required
            />
            <InputRightAddon children="minutes" />
          </InputGroup>
        </FormControl>
      </Flex>
      <Checkbox mb="3rem" checked={isPublic} onChange={() => setIsPublic(!isPublic)}>
        Make public{" "}
        <small style={{ color: "gray" }}>
          <em>
            (any registered user will be able to see and use this workout if
            checked)
          </em>
        </small>
      </Checkbox>
      <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Select difficulty..." required>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="expert">Expert</option>
      </Select>
      <Button colorScheme="blue" mt="2rem" display="block" type="submit">
        Create Exercises
      </Button>
    </motion.form>
  );
}
