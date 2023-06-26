import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { ChakraProvider } from "@chakra-ui/react";

export default function Login() {
  const [state, setState] = useState("login");

  return (
    <ChakraProvider>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LoginForm state={state} setState={setState} />
        <SignupForm state={state} setState={setState} />
      </div>
    </ChakraProvider>
  );
}
