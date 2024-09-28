import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Tasks  from './pages/Tasks';

export const BASE_URL='http://192.168.109.2:8000/api';

export const App = () => {
 const [user,setUser]=useState(localStorage.getItem('user'))
 const handleUser=(user)=>{
  setUser(user);
  localStorage.setItem('user',user);

 }

  return (
    <Router>
      <Routes>

        <Route path="/" element={user ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />

        <Route path="/login" element={user ? <Navigate to="/tasks" /> : <Login handleUser={handleUser} />} />

        <Route path="/tasks" element={user? <Tasks handleUserAuth={handleUser} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
