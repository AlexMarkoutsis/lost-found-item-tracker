import react, { createContext, useMemo, useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'

import './App.css'

import LoginPage from './pages/LoginPage.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import MainPage from './pages/MainPage.jsx'
import ItemSubmissionPage from './pages/ItemSubmissionPage.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'

import { AuthProvider } from "./context/AuthContext";


export const AppContext = createContext(null)


// todo add `npn install jwt-decode` to instructions


function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register />
}

export default function App() {

    const [currentUser, setCurrentUser] = useState('Username')

    const [items, setItems] = useState([{
        id: 'seed-1',
        itemName: 'Wallet',
        description: 'Brown leather wallet found near the physics building.',
        category: 'Accessories',
        location: 'Library',
        dateFound: new Date().toISOString().slice(0, 10),
        imageName: '',
        createdAt: Date.now(),
    },])

    const ctx = useMemo(
        () => ({
            currentUser,
            setCurrentUser,
            items,
            setItems,
        }),
        [currentUser, items],
    )

    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <Navigate to="/login" replace />
              }
            />

            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <MainPage/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserProfilePage/>
                </ProtectedRoute>
              }
            />


            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <ItemSubmissionPage/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/item-details"
              element={
                <ProtectedRoute>
                  <ItemDetails/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout/>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound/>}/>

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )
}