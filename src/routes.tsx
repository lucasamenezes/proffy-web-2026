import { createBrowserRouter } from "react-router";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { FinallyRegister } from "./pages/auth/finally-register";
import { Forgot } from "./pages/auth/forgot";
import { ForgotCompleted } from "./pages/auth/forgot-completed";

export const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-up/finally-register", element: <FinallyRegister /> },
  { path: "/forgot", element: <Forgot /> },
  { path: "/forgot/send-email", element: <ForgotCompleted /> },
]);
