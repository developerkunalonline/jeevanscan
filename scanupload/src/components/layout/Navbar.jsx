import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isOnline, darkMode } = useAppContext()
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/symptom-checker', label: 'Symptom Checker' },
    { path: '/image-diagnostic', label: 'Image Diagnostic' },
    { path: '/health-education', label: 'Health Education' },
    { path: '/register', label: 'Register' },    
    { path: '/login', label: 'Login' }
  ]

  return (
    <nav className={`bg-white shadow-md ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-xl font-semibold">Jeevanscan</span>
          </Link>

          {/* Connection status indicator */}
          <div className="hidden md:flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-success' : 'bg-danger'}`}></div>
            <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex items-center px-4 py-2">
              <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-success' : 'bg-danger'}`}></div>
              <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar