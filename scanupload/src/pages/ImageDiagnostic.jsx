import { useState, useRef } from 'react';
import OfflineIndicator from '../components/common/OfflineIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyB0D-Gjo84CNRBPTUVApRZSvH4iU7Egz0o'; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

function ImageDiagnostic() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { isOnline } = useAppContext();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Use the updated model name
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Convert image to base64
      const base64Image = await convertImageToBase64(image);

      // Prepare the content for the API request
      const content = {
        contents: [
          {
            parts: [
              { text: 'Describe the features visible in this medical image.' },
              {
                inlineData: {
                  mimeType: image.type, // e.g., "image/jpeg" or "image/png"
                  data: base64Image.split(',')[1], // Remove the data URL prefix
                },
              },
            ],
          },
        ],
      };

      const result = await model.generateContent(content);
      const diagnosis = result.response.text(); // Extracting response text
      setResult({ text: diagnosis }); // Set the result with the diagnosis text
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Server error. Try again later.'); // Use setError for error handling
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Utility function to convert image to base64
  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <OfflineIndicator />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Image Diagnostic</h1>
        <p className="text-gray-600">
          Upload images of skin conditions, wounds, or X-rays for AI-assisted analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {!preview ? (
            <div
              className={`image-upload-area ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mb-2">Drag and drop an image here, or click to select</p>
              <p className="text-sm text-gray-500">Supports JPEG, PNG, GIF (Max 5MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="mb-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-md max-h-80 object-contain bg-gray-100"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={resetForm}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !isOnline}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
                {!isOnline && (
                  <p className="text-sm text-red-500 mt-2">
                    Image analysis requires an internet connection
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-medium mb-2">Tips for better results:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Ensure good lighting when taking photos</li>
              <li>Focus the camera on the affected area</li>
              <li>Include a reference object for scale if possible</li>
              <li>Take multiple angles if needed</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="large" message="Analyzing image..." />
              <p className="text-sm text-gray-500 mt-4">
                This may take a moment as we process the image
              </p>
            </div>
          ) : result ? (
            <div>
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                <p className="font-medium">Disclaimer:</p>
                <p>
                  This analysis is generated by AI and should not replace professional medical advice.
                  Always consult a qualified healthcare provider for medical diagnoses.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Observations
                </h3>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-gray-700 leading-relaxed">{result.text}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Next Steps
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Consult a qualified doctor or radiologist for a professional diagnosis.</li>
                  <li>Provide the doctor with this image and any additional medical history.</li>
                  <li>Do not self-diagnose or rely solely on AI-generated insights.</li>
                </ul>
              </div>

              <button
                className="btn btn-primary w-full"
                onClick={() => window.print()}
              >
                Print Results
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2H6a2 2 0 012 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-gray-500">
                Upload an image and click "Analyze Image" to get diagnostic results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageDiagnostic;