import { useState, useEffect, useRef } from 'react';
import { diagnoseFromSymptoms } from '../utils/diagnosticEngine';
import OfflineIndicator from '../components/common/OfflineIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { isOnline, language } = useAppContext();

  const recognitionRef = useRef(null);

  // Check if browser supports speech recognition
  const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'en-US'; // Default to English, would support more languages in a real app

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prevTranscript) => prevTranscript + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setError(`Error: ${event.error}. Please try again.`);
        stopRecording();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startRecording = () => {
    if (!isSpeechRecognitionSupported) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (!isOnline) {
      setError('Voice input requires an internet connection.');
      return;
    }

    setError(null);
    setTranscript('');
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleProcess = async () => {
    if (!transcript.trim()) {
      setError('Please record some symptoms first.');
      return;
    }

    setIsProcessing(true);
    setResult(null);

    // Extract symptoms from transcript
    const symptoms = [];
    const commonSymptoms = [
      'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'yellow_urine', 'fever', 'cough', 'headache',
      'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
      'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
      'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
      'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
      'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
      'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
      'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
      'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
      'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
      'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of_urine',
      'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
      'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
      'abnormal_menstruation', 'dischromic_patches', 'watering_from_eyes', 'increased_appetite', 'polyuria',
      'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances',
      'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
      'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum',
      'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads',
      'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
      'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
    ];

    commonSymptoms.forEach((symptom) => {
      if (transcript.toLowerCase().includes(symptom)) {
        symptoms.push(symptom.replace(' ', '_'));
      }
    });

    // Remove duplicate symptoms using Set
    const uniqueSymptoms = [...new Set(symptoms)];

    // If no symptoms found, use a fallback
    if (uniqueSymptoms.length === 0) {
      setIsProcessing(false);
      setError('No recognizable symptoms found in your description. Please try again with more specific symptoms.');
      return;
    }

    // Process with diagnostic engine
    try {
      const diagnosisResult = await diagnoseFromSymptoms(uniqueSymptoms);
      setResult({
        ...diagnosisResult,
        detectedSymptoms: uniqueSymptoms, // Add unique detected symptoms to the result
      });
    } catch (err) {
      setError('An error occurred while processing your symptoms. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTranscript('');
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <OfflineIndicator />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Voice Input</h1>
        <p className="text-gray-600">
          Describe symptoms using voice for AI-assisted diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Input Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Speak Symptoms</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {!isSpeechRecognitionSupported && (
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
              Your browser doesn't support speech recognition. Please try using a modern browser like Chrome.
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <button
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-primary text-white'
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isSpeechRecognitionSupported || !isOnline}
              >
                {isRecording ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>

            {isRecording && (
              <div className="voice-wave flex justify-center mb-2">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <p className="text-center text-sm mb-4">
              {isRecording ? 'Recording... Click the button to stop' : 'Click the microphone to start recording'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transcript
            </label>
            <div className="border rounded-md p-3 min-h-32 max-h-60 overflow-y-auto bg-gray-50">
              {transcript ? (
                <p>{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">Your spoken symptoms will appear here...</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={isRecording}
            >
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={handleProcess}
              disabled={isRecording || !transcript.trim() || !isOnline}
            >
              Process Symptoms
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Tips for better results:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Speak clearly and at a moderate pace</li>
              <li>Mention specific symptoms (e.g., "fever", "cough", "headache")</li>
              <li>Include duration of symptoms if possible</li>
              <li>Describe the severity (mild, moderate, severe)</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="large" message="Processing your symptoms..." />
              <p className="text-sm text-gray-500 mt-4">
                This may take a moment as we analyze your description
              </p>
            </div>
          ) : result ? (
            <div>
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                <p className="font-medium">Disclaimer:</p>
                <p>{result.disclaimer}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Detected Symptoms</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.detectedSymptoms.map((symptom, index) => (
                    <div key={index} className="symptom-tag selected">
                      {symptom.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Possible Conditions</h3>
                {result.possibleConditions.length > 0 ? (
                  result.possibleConditions.map((condition, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold">{condition.name}</h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            condition.urgency === 'high'
                              ? 'bg-red-100 text-red-800'
                              : condition.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {condition.urgency.charAt(0).toUpperCase() + condition.urgency.slice(1)} Urgency
                        </div>
                      </div>
                      <p className="text-gray-600 my-2">{condition.description}</p>
                      <div className="mt-2">
                        <h5 className="font-medium mb-1">Recommendations:</h5>
                        <ul className="list-disc list-inside text-sm">
                          {condition.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No conditions detected based on the provided symptoms</p>
                )}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-gray-500">
                Record your symptoms using the microphone and click "Process Symptoms" to get diagnostic results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceInput;