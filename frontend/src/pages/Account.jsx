import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
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
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setconfirmNewPass] = useState("");
  const [delAccPass, setDelAccPass] = useState("");
  const [error, setError] = useState(null);
  const [passIsSubmitting, setPassIsSubmitting] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [accDelError, setAccDelError] = useState(null)

  const handleDeleteUser = (e) => {
    e.preventDefault()
    deleteUser(user.id, delAccPass).then((res) => {
      try{
        if (res.status === "success") {
          navigate("/login");
        }else{
          throw new Error(res.message)
        }
      }catch(err){
        setAccDelError(err.message)
        console.log(err.message)
      }
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassIsSubmitting(true);
    setError("");
    updatePassword(user.id, currentPass, newPass, confirmNewPass).then((res) => {
      try {
        if (res.status === "success") {
          setPasswordChanged(true);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
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
      <Flex gap="1rem" direction='column' border='1px solid gray' padding='2rem' w='full' maxW='25rem'>
        <Heading textAlign="center">User</Heading>
      <Flex direction='column' w='full'>
        <Flex gap ='1rem'>
          <Text>Username: </Text>
          <Text>{user.name}</Text>
        </Flex>
      </Flex>
      <Flex direction='column' w='full' maxW='25rem'>
        <Flex gap ='1rem'>
          <Text>Email: </Text>
          <Text>{user.email}</Text>
        </Flex>
      </Flex>
      </Flex>
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
          border: "1px solid red",
          padding: "2rem",
          width: "100%",
        }}
        onSubmit={handleDeleteUser}
      >
        <Heading textAlign="center">Delete Account</Heading>
        <Text color='red' fontSize='.9rem'>This action cannot be undone!</Text>
        <FormControl>
          <Text>Password</Text>
          <Input
            value={delAccPass}
            required
            onChange={(e) => setDelAccPass(e.target.value)}
            type="password"
          />
          {accDelError === "password incorrect" && (
            <FormHelperText color="red">
              Password incorrect.
            </FormHelperText>
          )}
        </FormControl>
        <Button type="submit" colorScheme="red">
          Delete Account
        </Button>
      </form>
    </Box>
  );
}
