import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Pages/Login/Login';
import TaskList from './Components/Tasks/TaskList';
import DashboardLayout from './Components/Pages/Home/DashboardLayout';
import Register from './Components/Pages/Registation/Register';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="tasks" />} />
          <Route path="tasks" element={<TaskList />} />
          {/* <Route path="timeline" element={<Timeline />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
