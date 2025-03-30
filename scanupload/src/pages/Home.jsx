import { Link, useNavigate } from 'react-router-dom'
import OfflineIndicator from '../components/common/OfflineIndicator'


function Home() {

  /**const navigate = useNavigate();
  let promice = fetch("http://127.0.0.1:3456/get-session");
  promice.then((e)=>{return e.json()}).then(e=>{
    if(e['response']['status']=='failed'){
      navigate('/login');
    }
  }).catch((e)=>console.log("failed to request"));**/

  const features = [
    {
      title: 'Symptom Checker',
      description: 'Input symptoms to get possible diagnoses and recommendations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
      path: '/symptom-checker'
    },
    {
      title: 'Image Diagnostic',
      description: 'Upload images of skin conditions, wounds, or X-rays for analysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      path: '/image-diagnostic'
    },
    {
      title: 'Voice Input',
      description: 'Describe symptoms using voice in your local language',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      ),
      path: '/voice-input'
    },
    {
      title: 'Health Education',
      description: 'Access information about common diseases and preventive measures',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      path: '/health-education'
    }
  ]

  return (
    <div>
      <OfflineIndicator />
      
      <section className="mb-10 ">
        <div className="text-center mb-8" >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-800">AI-Based Diagnostic Tool for Rural Clinics</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Empowering healthcare workers in rural areas with AI-assisted diagnosis, even in areas with limited connectivity.
          </p>
        </div>
        
        <div className="bg-blue-100 p-8 rounded-lg mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">How to use this tool:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Select a diagnostic method from the options below</li>
            <li>Follow the step-by-step instructions to input patient information</li>
            <li>Review the AI-assisted diagnosis and recommendations</li>
            <li>Use the information to support your clinical decision-making</li>
          </ol>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Diagnostic Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.path}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-300 mt-auto">
                  Start Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/*
      <section className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Offline Functionality</h2>
        <p className="mb-4">
          This application is designed to work offline. Once loaded, you can use most features without an internet connection. 
          Your data will be stored locally and synchronized when you're back online.
        </p>
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center mr-6">
            <div className="h-3 w-3 rounded-full bg-success mr-2"></div>
            <span>Online Mode: Full functionality</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-warning mr-2"></div>
            <span>Offline Mode: Core features available</span>
          </div>
        </div>
      </section>*/}
    </div>
  )
}

export default Home
