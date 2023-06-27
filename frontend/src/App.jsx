import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Workout from "./pages/Workout";
import Workouts from "./pages/Workouts";
import Login from "./pages/Login";
import RootLayout from "./layouts/RootLayout";
import MyWorkouts from "./pages/MyWorkouts";
import Account from "./pages/Account";
import SingleWorkout, { workoutLoader } from "./pages/SingleWorkout";
import CreateWorkout from "./pages/CreateWorkout";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="login" element={<Login />} />
        <Route element={<RootLayout />}  >
          <Route path="/" element={<Navigate to="workouts" />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="workouts/:workoutId" element={<SingleWorkout />} />
          <Route
            path="workouts/:workoutId/start"
            element={<Workout />}
            loader={workoutLoader}
          />
          <Route path="my-workouts" element={<MyWorkouts />} />
          <Route path="account" element={<Account />} />
          <Route path="create-workout" element={<CreateWorkout />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
