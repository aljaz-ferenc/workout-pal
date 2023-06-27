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
import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const loginInitialValues = {
  email: "user123@email.com",
  password: "pass123",
};

const loginValidate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email format";
  }
  if (!values.password) {
    errors.password = "Required";
  }

  return errors;
};

const loginVariants = {
  initial: {
    x: 0,
    transition: {
      ease: "easeOut",
    },
  },
  animate: {
    x: "100vw",
  },
};

export default function LoginForm({ state, setState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {setUser, user} = useUserStore((state) => state);

  const handleLogin = async (values) => {
    setIsLoading(true);
    const response = await loginUser(values);
    setIsLoading(false);
    console.log(response)
    if (response.status === "success") {
      const user = {
        email: response.data.user.email,
        name: response.data.user.name,
        id: response.data.user._id
      }
      // console.log(user)
      setUser(user);
      localStorage.setItem('workout-pal', JSON.stringify(response.data.token))
      console.log(localStorage.getItem('workout-pal'))
      navigate("/workouts");
    } else {
      setError(response.message);
    }
  }

  const loginFormik = useFormik({
    initialValues: loginInitialValues,
    onSubmit: handleLogin,
    validate: loginValidate,
  });

  return (
    <motion.div
      variants={loginVariants}
      initial="initial"
      animate={state === "login" ? "initial" : "animate"}
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
        mx="auto"
        border={["none", "1px"]}
        borderColor={["", "gray.300"]}
        borderRadius={10}
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align={["flex-start", "center"]} w="full">
            <Heading>Log in</Heading>
            <Text>Enter your email and password to login</Text>
          </VStack>
          <form
            style={{ width: "100%" }}
            onSubmit={loginFormik.handleSubmit}
            noValidate
          >
            <FormControl mb="3rem" onSubmit={() => console.log("submit")}>
              <FormLabel>Email</FormLabel>
              <Input
                defaultValue="user123@email.com"
                rounded="none"
                variant="filled"
                type="email"
                name="email"
                onChange={loginFormik.handleChange}
                value={loginFormik.values.loginEmail}
                onBlur={loginFormik.handleBlur}
                isInvalid={
                  loginFormik.errors.email && loginFormik.touched.email
                    ? true
                    : false
                }
              />
              {!error === "User not found." &&
                loginFormik.errors.email &&
                loginFormik.touched.email && (
                  <FormHelperText position="absolute" color="red">
                    {loginFormik.errors.email}
                  </FormHelperText>
                )}
              {error === "User not found." && (
                <FormHelperText position="absolute" color="red">
                  User with this email does not exist.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb="3rem">
              <FormLabel>Password</FormLabel>
              <Input
                defaultValue="pass123"
                rounded="none"
                variant="filled"
                type="password"
                name="password"
                onChange={loginFormik.handleChange}
                value={loginFormik.values.loginPass}
                onBlur={loginFormik.handleBlur}
                isInvalid={
                  loginFormik.errors.password && loginFormik.touched.password
                    ? true
                    : false
                }
              />
              {!error === "Password incorrect. " &&
                loginFormik.errors.password &&
                loginFormik.touched.password && (
                  <FormHelperText position="absolute" color="red">
                    {loginFormik.errors.password}
                  </FormHelperText>
                )}
              {error === "Password incorrect." && (
                <FormHelperText position="absolute" color="red">
                  Password incorrect.
                </FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              mt={4}
              rounded="none"
              colorScheme="blue"
              w="full"
              isDisabled={!loginFormik.isValid}
              isLoading={isLoading}
            >
              Log in
            </Button>
          </form>
          <Text mx="auto">
            Don't have an account?{" "}
            <Link onClick={() => setState("signup")} color="teal">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </motion.div>
  );
}
