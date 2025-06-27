import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from '../pages/Login'
import LoginHelp from '../pages/LoginHelp'
import Subscribe from '../pages/Subscribe'

const AppRoutes = () => {
  return (
  <>
  <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/LoginHelp" element={<LoginHelp />} />
        <Route path="/Subscribe" element={<Subscribe />} />
  </Routes>
  </>
  )
}

export default AppRoutes
