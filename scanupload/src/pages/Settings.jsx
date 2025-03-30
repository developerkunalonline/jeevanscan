import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import OfflineIndicator from '../components/common/OfflineIndicator'
import { clearAllData } from '../utils/storage'

function Settings() {
  const { 
    isOnline, 
    userData, 
    updateUserData, 
    language, 
    changeLanguage, 
    darkMode, 
    toggleDarkMode,
    syncQueue
  } = useAppContext()
  
  const [clinicInfo, setClinicInfo] = useState({
    name: userData?.clinicName || '',
    location: userData?.clinicLocation || '',
    contactPerson: userData?.contactPerson || '',
    phone: userData?.phone || ''
  })
  
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Available languages (would be expanded in a real app)
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'sw', name: 'Swahili' }
  ]
  
  const handleClinicInfoChange = (e) => {
    const { name, value } = e.target
    setClinicInfo({
      ...clinicInfo,
      [name]: value
    })
  }
  
  const handleSaveSettings = () => {
    updateUserData({
      clinicName: clinicInfo.name,
      clinicLocation: clinicInfo.location,
      contactPerson: clinicInfo.contactPerson,
      phone: clinicInfo.phone
    })
    
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }
  
  const handleResetData = async () => {
    try {
      await clearAllData()
      setResetSuccess(true)
      setShowResetConfirm(false)
      
      // In a real app, we would reload the app or redirect to a welcome screen
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error resetting data:', error)
    }
  }
  
  return (
    <div>
      <OfflineIndicator />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure application settings and manage your clinic information.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Clinic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="Enter clinic name"
                value={clinicInfo.name}
                onChange={handleClinicInfoChange}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="input-field"
                placeholder="Enter clinic location"
                value={clinicInfo.location}
                onChange={handleClinicInfoChange}
              />
            </div>
            
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                className="input-field"
                placeholder="Enter contact person name"
                value={clinicInfo.contactPerson}
                onChange={handleClinicInfoChange}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="input-field"
                placeholder="Enter phone number"
                value={clinicInfo.phone}
                onChange={handleClinicInfoChange}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              className="btn btn-primary w-full"
              onClick={handleSaveSettings}
            >
              Save Information
            </button>
            
            {saveSuccess && (
              <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm text-center rounded">
                Information saved successfully!
              </div>
            )}
          </div>
        </div>
        
        {/* Application Settings */}
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  className="input-field"
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-600">Enable dark theme for low-light environments</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    id="darkMode"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <label
                    htmlFor="darkMode"
                    className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                      darkMode ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in-out bg-white ${
                        darkMode ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Offline Mode</h3>
                  <p className="text-sm text-gray-600">Current connection status</p>
                </div>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${isOnline ? 'bg-success' : 'bg-warning'}`}></div>
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              {!isOnline && syncQueue.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-700">Sync Queue</h3>
                  <p className="text-sm text-blue-600">
                    {syncQueue.length} item(s) waiting to be synchronized when you're back online.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Reset Application Data</h3>
                <p className="text-sm text-gray-600 mb-2">
                  This will clear all saved data and reset the application to its default state.
                </p>
                
                {!showResetConfirm ? (
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset Data
                  </button>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 mb-3">
                      Are you sure? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        className="btn btn-danger"
                        onClick={handleResetData}
                      >
                        Yes, Reset Data
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {resetSuccess && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm text-center rounded">
                    Data reset successful! Reloading application...
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Export all application data for backup or transfer.
                </p>
                <button 
                  className="btn btn-secondary"
                  disabled={!isOnline}
                >
                  Export Data
                </button>
                {!isOnline && (
                  <p className="text-sm text-red-500 mt-1">
                    Export requires an internet connection
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings