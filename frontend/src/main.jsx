
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import ProfileForm from "./components/ProfileForm/ProfileForm";
import Layout from "./components/Layout/Layout";
import Profile from "./components/Profile/Profile";
import SubmissionHistory from "./components/SubmissionHistory/SubmissionHistory";
import ReviewHistory from "./components/ReviewHistory/ReviewHistory";
import TeamPage from "./components/TeamPage/TeamPage";
import Review from "./components/Review/ReviewPage";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import AsgnViewReviewee from "./components/AsgnView_reviewee/AsgnView_reviewee";
import AsgnViewTeam from "./components/AsgnView_team/AsgnView_team";
import ManageUsersAndRoles from "./components/manageUsersAndRoles/manageUsersAndRoles";
import { Provider } from "react-redux";

import store from "./redux/store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Home />} />
        <Route path="users/:id" element={<Profile />}>
          <Route index element={<ProfileForm />} />
          <Route path="submission_history" element={<SubmissionHistory />} />
          <Route path="review_history" element={<ReviewHistory />} />
        </Route>
        <Route path="assignment/:id" element={<AsgnViewReviewee />} />
        <Route path="team/:teamId" element={<TeamPage />} />
        <Route path="team/:teamId/assignment/:assignmentId" element={<AsgnViewTeam />} />
        <Route path="review/:id" element={<Review />} />
        <Route path="manageusersandroles/" element={<ManageUsersAndRoles/>}/>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </Provider>
  </StrictMode>
);
