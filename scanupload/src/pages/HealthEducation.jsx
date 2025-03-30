import { useState } from 'react'
import OfflineIndicator from '../components/common/OfflineIndicator'

function HealthEducation() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedScheme, setSelectedScheme] = useState(null)
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'health_insurance', name: 'Health Insurance Schemes' },
    { id: 'maternal', name: 'Maternal Health' },
    { id: 'child', name: 'Child Health' },
    { id: 'elderly', name: 'Senior Citizens' },
    { id: 'disease', name: 'Disease Control' }
  ]
  
  const schemes = [
    {
      id: 1,
      title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)',
      category: 'health_insurance',
      description: 'Worlds largest health insurance scheme fully financed by the government.',
      image: 'https://www.pmjay.gov.in/sites/default/files/2019-09/AB%20PM-JAY%20Logo%20English.png',
      link: 'https://pmjay.gov.in/',
      content: `
        <h3>About PM-JAY</h3>
        <p>Provides a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.</p>
        
        <h3>Key Benefits</h3>
        <ul>
          <li>Cashless and paperless access to quality healthcare services</li>
          <li>Coverage of up to 5 lakh rupees per family per year</li>
          <li>No restriction on family size, age or gender</li>
          <li>All pre-existing conditions covered from day one</li>
        </ul>
        
        <h3>Eligibility</h3>
        <ul>
          <li>Families included in SECC 2011 database</li>
          <li>Currently entitled RSBY beneficiaries</li>
          <li>No cap on family size or age</li>
        </ul>
      `
    },
    {
      id: 2,
      title: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
      category: 'maternal',
      description: 'Provides free antenatal care to pregnant women on the 9th of every month.',
      image: 'https://pmsma.nhp.gov.in/wp-content/uploads/2016/08/PMSMA-Logo.png',
      link: 'https://pmsma.nhp.gov.in/',
      content: `
        <h3>About PMSMA</h3>
        <p>A program to provide fixed-day assured, comprehensive and quality antenatal care to pregnant women on the 9th of every month.</p>
        
        <h3>Services Provided</h3>
        <ul>
          <li>Free antenatal check-ups</li>
          <li>Required medical tests</li>
          <li>Regular monitoring of high-risk pregnancies</li>
          <li>Counseling and support</li>
        </ul>
        
        <h3>How to Avail</h3>
        <ul>
          <li>Visit nearest government health facility on 9th of every month</li>
          <li>Carry any government photo ID</li>
          <li>No prior registration needed</li>
        </ul>
      `
    },
    {
      id: 3,
      title: 'Mission Indradhanush',
      category: 'child',
      description: 'Universal Immunization Programme to protect children against preventable diseases.',
      image: 'https://nhm.gov.in/New_Updates_2018/NHM_Components/Immunization/Gid_Files/mi_logo.jpg',
      link: 'https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=824&lid=441',
      content: `
        <h3>About Mission Indradhanush</h3>
        <p>Aims to immunize all children under the age of two years against seven vaccine preventable diseases.</p>
        
        <h3>Diseases Covered</h3>
        <ul>
          <li>Diphtheria</li>
          <li>Pertussis</li>
          <li>Tetanus</li>
          <li>Childhood Tuberculosis</li>
          <li>Polio</li>
          <li>Hepatitis B</li>
          <li>Measles</li>
        </ul>
        
        <h3>Implementation</h3>
        <ul>
          <li>Four phases of vaccination drives</li>
          <li>Focus on high-risk areas</li>
          <li>Door-to-door campaign</li>
          <li>Regular monitoring and follow-up</li>
        </ul>
      `
    },
    {
      id: 4,
      title: 'Rashtriya Swasthya Bima Yojana (RSBY)',
      category: 'health_insurance',
      description: 'Health insurance scheme for Below Poverty Line (BPL) families.',
      image: 'https://www.rsby.gov.in/Images/RSBY_Logo.jpg',
      link: 'https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana',
      content: `
        <h3>About RSBY</h3>
        <p>Provides health insurance coverage to BPL families with focus on providing financial security against health shocks.</p>
        
        <h3>Coverage</h3>
        <ul>
          <li>Up to Rs. 30,000 coverage per annum per family</li>
          <li>Covers hospitalization expenses</li>
          <li>Pre-existing conditions covered</li>
          <li>Transportation costs included</li>
        </ul>
        
        <h3>Eligibility</h3>
        <ul>
          <li>BPL families as per state BPL list</li>
          <li>MGNREGA workers</li>
          <li>Street vendors</li>
          <li>Domestic workers</li>
        </ul>
      `
    },
    {
      id: 5,
      title: 'National Programme for Health Care of the Elderly (NPHCE)',
      category: 'elderly',
      description: 'Dedicated healthcare program for senior citizens.',
      image: 'https://main.mohfw.gov.in/sites/default/files/NPHCE-banner.jpg',
      link: 'https://main.mohfw.gov.in/major-programmes/other-national-health-programmes/national-programme-health-care-elderly-nphce',
      content: `
        <h3>About NPHCE</h3>
        <p>Addresses various health related problems of elderly people with focus on preventive and promotive care.</p>
        
        <h3>Services Provided</h3>
        <ul>
          <li>Dedicated OPD services</li>
          <li>Physical activity guidance</li>
          <li>Medicines and basic tests</li>
          <li>Home visits for bed-ridden elderly</li>
        </ul>
        
        <h3>Implementation</h3>
        <ul>
          <li>District hospitals</li>
          <li>CHCs and PHCs</li>
          <li>Sub-centers</li>
          <li>Referral services</li>
        </ul>
      `
    }
  ]
  
  // Filter schemes based on search and category
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  return (
    <div>
      <OfflineIndicator />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Indian Healthcare Schemes</h1>
        <p className="text-gray-600">
          Explore government healthcare schemes and programs available for citizens.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Schemes</h2>
            
            <div className="mb-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="input-field"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="input-field"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Available Schemes</h2>
            
            {filteredSchemes.length > 0 ? (
              <div className="space-y-3">
                {filteredSchemes.map(scheme => (
                  <div 
                    key={scheme.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedScheme?.id === scheme.id 
                        ? 'bg-primary text-white border-primary' 
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    <h3 className={`font-medium ${selectedScheme?.id === scheme.id ? 'text-white' : 'text-gray-800'}`}>
                      {scheme.title}
                    </h3>
                    <p className={`text-sm mt-1 ${selectedScheme?.id === scheme.id ? 'text-white opacity-90' : 'text-gray-600'}`}>
                      {scheme.description}
                    </p>
                    <div className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
                      selectedScheme?.id === scheme.id 
                        ? 'bg-white text-primary' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {categories.find(c => c.id === scheme.category)?.name || scheme.category}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Schemes Found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            {selectedScheme ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedScheme.title}</h2>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {categories.find(c => c.id === selectedScheme.category)?.name || selectedScheme.category}
                  </span>
                </div>
                
                <div className="mb-6">
                  <img 
                    src={selectedScheme.image} 
                    alt={selectedScheme.title}
                    className="w-full max-h-48 object-contain bg-gray-50 rounded-lg"
                  />
                </div>
                
                <div 
                  className="prose max-w-none mb-6"
                  dangerouslySetInnerHTML={{ __html: selectedScheme.content }}
                />
                
                <div className="mb-6">
                  <a 
                    href={selectedScheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <span>Visit Official Website</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedScheme(null)}
                  >
                    Back to List
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.print()}
                  >
                    Print Information
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Select a Scheme</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Choose a healthcare scheme from the list to view detailed information about benefits, 
                  eligibility criteria, and how to apply.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthEducation