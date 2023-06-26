import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { deleteWorkout } from "../api/api";
import { ProgressBar } from "./ProgressBar";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({ isOpen, setModalIsOpen, workoutId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteWorkout = () => {
    setIsSubmitting(true);
    deleteWorkout(workoutId)
      .then((res) => {
        if (res.status === "success") {
          setHasSubmitted(true);
          setTimeout(() => {
            navigate("../my-workouts");
          }, 2000);
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => {
          setModalIsOpen(false);
          setError(null);
          setIsSubmitting(false);
        }, 2000);
      });
  };

  const handleOnClose = () => {
    setModalIsOpen(false);
    setError(null);
    setIsSubmitting(false);
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleOnClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Workout
          </AlertDialogHeader>
          {!isSubmitting && (
            <AlertDialogBody>
              Are you sure you want to delete this workout? You can't undo this
              action afterwards.
            </AlertDialogBody>
          )}
          {isSubmitting && (
            <AlertDialogBody display="flex" justifyContent="center">
              {!hasSubmitted && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              )}
              {!error && hasSubmitted && (
                <Box display="flex" flexDir="column">
                  <Alert flexDir="column" textAlign="center" status="success">
                    <AlertIcon />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      The workout has been successfully deleted!
                    </AlertDescription>
                  </Alert>
                  <ProgressBar color="#38a169" />
                </Box>
              )}
              {error && (
                <Box display="flex" flexDir="column">
                  <Alert flexDir="column" textAlign="center" status="error">
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Something went wrong. Please try again.
                    </AlertDescription>
                  </Alert>
                  <ProgressBar color="red" />
                </Box>
              )}
            </AlertDialogBody>
          )}
          <AlertDialogFooter>
            {!error && !isSubmitting && (
              <Button onClick={() => setModalIsOpen(false)}>Cancel</Button>
            )}
            {!error && !isSubmitting && (
              <Button colorScheme="red" ml={3} onClick={handleDeleteWorkout}>
                Delete
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
