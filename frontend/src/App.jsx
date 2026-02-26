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
            <AppContext.Provider value={ctx}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/submit" element={<ItemSubmissionPage />} />
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/register" element={<RegisterAndLogout/>}/>
                    <Route path="/item-details" element={<ItemDetails />} />
                    <Route path="*" element={<NotFound/>}></Route>
                </Routes>
            </AppContext.Provider>
        </BrowserRouter>
    )
}
