import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { deleteUser, updatePassword } from "../api/api";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProgressBar } from "../components/ProgressBar";

export default function Account() {
  const userId = useUserStore((state) => state.userId);
  const navigate = useNavigate();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setconfirmNewPass] = useState("");
  const [delAccPass, setDelAccPass] = useState("");
  const [error, setError] = useState(null);
  const [passIsSubmitting, setPassIsSubmitting] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleDeleteUser = () => {
    deleteUser(userId).then((res) => {
      if (res.status === "success") {
        navigate("/login");
      }
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassIsSubmitting(true);
    setError("");
    updatePassword(currentPass, newPass, confirmNewPass).then((res) => {
      console.log(res);
      try {
        if (res.status === "success") {
          setPasswordChanged(true);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      }
      setPassIsSubmitting(false);
    });
  };

  useEffect(() => {
    if (!passwordChanged) return;
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, [passwordChanged]);

  useEffect(() => {
    if (error === "Duplicate password") {
      setNewPass("");
      setconfirmNewPass("");
    }
  }, [error]);

  return (
    <Box
      gap="2rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      color="white"
      h="full"
      bg="#212A3E"
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
          border: "1px solid gray",
          padding: "2rem",
          width: "100%",
          maxWidth: "25rem",
        }}
        onSubmit={handleChangePassword}
      >
        {passwordChanged && (
          <Box position="sticky" zIndex={2} top={0}>
            <Alert
              color="black"
              flexDir="column"
              textAlign="center"
              status="success"
            >
              <AlertIcon />
              <AlertTitle>Password changed!</AlertTitle>
              <AlertDescription>
                Please log in again with your new password.
              </AlertDescription>
              <ProgressBar color="#38a169" duration={2} />
            </Alert>
          </Box>
        )}
        <Heading textAlign="center">Change Password</Heading>
        <FormControl>
          <Text>Current password</Text>
          <Input
            value={currentPass}
            required
            onChange={(e) => setCurrentPass(e.target.value)}
            type="password"
          />
          {error === "Password incorrect" && (
            <FormHelperText color="red" position="absolute">
              Password incorrect
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <Text>New password</Text>
          <Input
            value={newPass}
            required
            onChange={(e) => setNewPass(e.target.value)}
            type="password"
          />
          {error === "Duplicate password" && (
            <FormHelperText color="red">
              New password can't be the same as the old one.
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <Text>Confirm new password</Text>
          <Input
            value={confirmNewPass}
            required
            onChange={(e) => setconfirmNewPass(e.target.value)}
            type="password"
          />
        </FormControl>
        <Button isLoading={passIsSubmitting} type="submit" colorScheme="blue">
          Change password
        </Button>
      </form>
      <form
        style={{
          maxWidth: "25rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          border: "1px solid gray",
          padding: "2rem",
          width: "100%",
        }}
        onSubmit={handleChangePassword}
      >
        <Heading textAlign="center">Delete Account</Heading>
        <FormControl>
          <Text>Password</Text>
          <Input
            value={delAccPass}
            required
            onChange={(e) => setDelAccPass(e.target.value)}
            type="password"
          />
        </FormControl>
        <Button type="submit" colorScheme="red" onClick={handleDeleteUser}>
          Delete Account
        </Button>
      </form>
    </Box>
  );
}
