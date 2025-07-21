import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleBasedTimeline from './Components/Role/Role';
import Projects from './Components/Projects/Projects';
import ProtectedRoute from './Components/Role/ProtectedRoute';
// import ProtectedRoute from './Components/Role/ProtectedRoute';
const Dashboard = lazy(() => import('./Components/Pages/Dasboard'));
const Register = lazy(() => import('./Components/Pages/Registation/Register'));
const Login = lazy(() => import('./Components/Pages/Login/Login'));
const Tasks = lazy(() => import('./Components/Tasks/TaskList'));
const Timeline = lazy(() => import('./Components/TimeLine/TimeLine'));
const Presence = lazy(() => import('./Components/Presence/PresenceIndicator/Presence'));
const Notifications = lazy(() => import('./Components/Notifications/Notifications'));
const Users = lazy(() => import('./Components/Users/Users'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            {/* <Route path="/dashboard" element={<Tasks />}/> */}
            <Route path="/projects" element={<Projects />}/>
            {/* <Route index element={<Dashboard />} /> */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/presence" element={<Presence />} />
            <Route path="/role" element={<RoleBasedTimeline />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users" element={<Users />} />
          {/* </Route> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
