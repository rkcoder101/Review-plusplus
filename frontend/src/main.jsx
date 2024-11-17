import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ProfileForm from './components/ProfileForm/ProfileForm';
import Layout from './components/Layout/Layout';
import Profile from './components/Profile/Profile';
import SubmissionHistory from './components/SubmissionHistory/SubmissionHistory';
import ReviewHistory from './components/ReviewHistory/ReviewHistory';
import TeamCreation from './components/TeamCreation/TeamCreation';
import TeamPage from './components/TeamPage/TeamPage';
import ContentListing from './components/ContentListing/ContentListing';
import Review from './components/Review/Review';
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import FullScreenDialog from './components/FullScreenDialog/FullScreenDialog';
const router = createBrowserRouter(
  createRoutesFromElements(
      <>
    <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    <Route path="/" element={<Layout />}>
      <Route path='dashboard' element={<Home/>}></Route>
      <Route path="users/:id" element={<Profile />}>
        <Route index element={<ProfileForm />} /> 
        <Route path="submission_history" element={<SubmissionHistory />} />
        <Route path="review_history" element={<ReviewHistory />} />
      </Route>
      <Route path="createteam" element={<TeamCreation />} />
      <Route path="teams/:id" element={<TeamPage />} />
      <Route path="assignments/:id" element={<ContentListing />}>
        <Route path="reviews" element={<Review />} />
      </Route>
      
    </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />      
    </NextUIProvider>
  </StrictMode>
);
