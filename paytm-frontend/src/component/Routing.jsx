import React from 'react'
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard';

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
}

export default Routing