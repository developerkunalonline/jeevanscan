import localforage from 'localforage'

// Configure localforage
localforage.config({
  name: 'ai-diagnostic-tool',
  storeName: 'diagnostic_data'
})

// Save data to local storage
export const saveData = async (key, data) => {
  try {
    await localforage.setItem(key, data)
    return true
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error)
    return false
  }
}

// Load data from local storage
export const loadData = async (key) => {
  try {
    const data = await localforage.getItem(key)
    return data
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error)
    return null
  }
}

// Remove data from local storage
export const removeData = async (key) => {
  try {
    await localforage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error)
    return false
  }
}

// Clear all data from local storage
export const clearAllData = async () => {
  try {
    await localforage.clear()
    return true
  } catch (error) {
    console.error('Error clearing all data:', error)
    return false
  }
}

// Get all keys in local storage
export const getAllKeys = async () => {
  try {
    const keys = await localforage.keys()
    return keys
  } catch (error) {
    console.error('Error getting all keys:', error)
    return []
  }
}