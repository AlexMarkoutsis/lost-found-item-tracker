import { createContext, useMemo, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './App.css'

import LoginPage from './pages/LoginPage.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import MainPage from './pages/MainPage.jsx'
import ItemSubmissionPage from './pages/ItemSubmissionPage.jsx'

export const AppContext = createContext(null)

export default function App() {
  const [currentUser, setCurrentUser] = useState('Username')
  const [items, setItems] = useState([
    {
      id: 'seed-1',
      itemName: 'Wallet',
      description: 'Brown leather wallet found near the physics building.',
      category: 'Accessories',
      location: 'Library',
      dateFound: new Date().toISOString().slice(0, 10),
      imageName: '',
      createdAt: Date.now(),
    },
  ])

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
    <Router>
      <AppContext.Provider value={ctx}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/submit" element={<ItemSubmissionPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContext.Provider>
    </Router>
  )
}