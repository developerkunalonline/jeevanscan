import { createContext, useContext, useState, useEffect } from 'react'
import { saveData } from '../utils/storage'

const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

export function AppProvider({ children, initialData }) {
  const [isOnline, setIsOnline] = useState(initialData?.isOnline || navigator.onLine)
  const [userData, setUserData] = useState(initialData?.userData || null)
  const [language, setLanguage] = useState('en')
  const [darkMode, setDarkMode] = useState(false)
  const [syncQueue, setSyncQueue] = useState([])

  // Update online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  // Sync data when online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      // In a real app, this would send data to a server
      console.log('Syncing data with server:', syncQueue)
      setSyncQueue([])
    }
  }, [isOnline, syncQueue])

  // Save user data to local storage when it changes
  useEffect(() => {
    if (userData) {
      saveData('userData', userData)
    }
  }, [userData])

  // Add data to sync queue when offline
  const addToSyncQueue = (data) => {
    setSyncQueue(prev => [...prev, { ...data, timestamp: Date.now() }])
  }

  // Update user data
  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData }
    setUserData(updatedData)
    
    if (!isOnline) {
      addToSyncQueue({ type: 'UPDATE_USER_DATA', data: newData })
    } else {
      // In a real app, this would send data to a server
      console.log('Sending user data update to server:', newData)
    }
  }

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang)
    saveData('language', lang)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
    saveData('darkMode', !darkMode)
  }

  const value = {
    isOnline,
    userData,
    updateUserData,
    language,
    changeLanguage,
    darkMode,
    toggleDarkMode,
    syncQueue,
    addToSyncQueue
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}