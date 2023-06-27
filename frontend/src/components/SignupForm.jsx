import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { signupUser } from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const signupInitialValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const signupValidate = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email format";
  }
  if (!values.password) {
    errors.password = "Required";
  }
  if(values.password.length < 6){
    errors.password = "Must be at least 6 characters."
  }
  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Required";
  }
  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }
  return errors;
};

const signupVariants = {
  initial: {
    x: "100vw",
  },
  animate: {
    x: 0,
    transition: {
      ease: "easeOut",
    },
  },
};

export default function SignupForm({ state, setState }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState()
  const user = useUserStore(state => state.user)

  const signupFormik = useFormik({
    initialValues: signupInitialValues,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null)
      const response = await signupUser(values);
      if (response.status === 'success') {
        setUser(response.data);
        localStorage.setItem('workout-pal', JSON.stringify(response.token))
        navigate("/workouts");
      } else {
        setError(response.message)
      }
    },
    validate: signupValidate,
  });

  return (
    <motion.div
      variants={signupVariants}
      initial="initial"
      animate={state === "signup" ? "animate" : "initial"}
      style={{
        position: "absolute",
        display: "grid",
        placeContent: "center",
        height: "100vh",
      }}
    >
      <Box
        w={["full", "md"]}
        p={[8, 10]}
        h="100%"
        mx="auto"
        border={["none", "1px"]}
        borderColor={["", "gray.300"]}
        borderRadius={10}
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align={["flex-start", "center"]} w="full">
            <Heading>Sign up</Heading>
            <Text>Create your account</Text>
          </VStack>
          <form style={{ width: "100%" }} onSubmit={signupFormik.handleSubmit}>
            <FormControl mb="3rem">
              <FormLabel>Username</FormLabel>
              <Input
                rounded="none"
                variant="filled"
                type="text"
                name="name"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.name}
                onBlur={signupFormik.handleBlur}
                isInvalid={
                  signupFormik.errors.name && signupFormik.touched.name
                    ? true
                    : false
                }
              />
              {!error && signupFormik.errors.name && signupFormik.touched.name && (
                <FormHelperText position="absolute" color="red">
                  {signupFormik.errors.name}
                </FormHelperText>
              )}
              {error &&error.includes('dup key: { name:') && (
                <FormHelperText position="absolute" color="red">
                  User with this username already exists.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb="3rem">
              <FormLabel>Email</FormLabel>
              <Input
                rounded="none"
                variant="filled"
                type="email"
                name="email"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.email}
                onBlur={signupFormik.handleBlur}
                isInvalid={
                  signupFormik.errors.email && signupFormik.touched.email
                    ? true
                    : false
                }
              />
              {!error && signupFormik.errors.email && signupFormik.touched.email && (
                <FormHelperText position="absolute" color="red">
                  {signupFormik.errors.email}
                </FormHelperText>
              )}
              {error && error.includes('dup key: { email:') && (
                <FormHelperText position="absolute" color="red">
                  User with this email already exists.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb="3rem">
              <FormLabel>Password</FormLabel>
              <Input
                rounded="none"
                variant="filled"
                type="password"
                name="password"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.password}
                onBlur={signupFormik.handleBlur}
                isInvalid={
                  signupFormik.errors.password && signupFormik.touched.password
                    ? true
                    : false
                }
              />
              {signupFormik.errors.password &&
                signupFormik.touched.password && (
                  <FormHelperText position="absolute" color="red">
                    {signupFormik.errors.password}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl mb="3rem">
              <FormLabel>Confirm password</FormLabel>
              <Input
                rounded="none"
                variant="filled"
                type="password"
                name="passwordConfirm"
                onChange={signupFormik.handleChange}
                value={signupFormik.values.passwordConfirm}
                onBlur={signupFormik.handleBlur}
                isInvalid={
                  signupFormik.errors.passwordConfirm &&
                  signupFormik.touched.passwordConfirm
                    ? true
                    : false
                }
              />
              {signupFormik.errors.passwordConfirm &&
                signupFormik.touched.passwordConfirm && (
                  <FormHelperText position="absolute" color="red">
                    {signupFormik.errors.passwordConfirm}
                  </FormHelperText>
                )}
            </FormControl>
            <Button
              type="submit"
              mt={4}
              rounded="none"
              colorScheme="blue"
              w="full"
              isDisabled={!signupFormik.isValid}
              isLoading={isLoading}
            >
              Sign up
            </Button>
          </form>
          <Text mx="auto">
            Already have an account?{" "}
            <Link onClick={() => setState("login")} color="teal">
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </motion.div>
  );
}
