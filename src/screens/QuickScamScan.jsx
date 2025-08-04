import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const QuickScamScan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [manualText, setManualText] = useState('');

  // Get user info from location state or localStorage
  const userInfo = location.state?.userInfo || JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo.uid || 'anonymous';

  useEffect(() => {
    // Load scan history on component mount
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      const response = await fetch(
        `https://us-central1-allstate-8f387.cloudfunctions.net/get_scan_history?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setScanHistory(data.scans || []);
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !manualText.trim()) {
      setError('Please select an image or enter text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let textToAnalyze = manualText.trim();
      let imageUrl = '';

      // If file is selected, extract text from it (simplified approach)
      if (selectedFile) {
        // For demo purposes, we'll use a simple text extraction
        // In a real implementation, you'd use OCR or Google Cloud Vision API
        textToAnalyze = `Sample text from image: This is a placeholder for text that would be extracted from the uploaded image using OCR technology. The actual implementation would use Google Cloud Vision API to extract text from the image.`;
        imageUrl = previewUrl;
      }

      // Analyze the text using our Firebase Function
      const response = await fetch(
        'https://us-central1-allstate-8f387.cloudfunctions.net/analyze_text_for_scams',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textToAnalyze,
            userId: userId,
            imageUrl: imageUrl
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      // Reload scan history
      await loadScanHistory();

    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return '✅';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* Header */}
      <Header variant="home" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-20 pb-24">
        {/* Back Button */}
        <div className="px-4 pt-4">
          <BackButton onClick={() => navigate(-1)} />
        </div>

        {/* Quick Scam Scan Header */}
        <div className="bg-[#0033A0] text-white px-4 py-3 mx-4 mt-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="font-semibold text-lg">Quick Scam Scan</h2>
          <button className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white mx-4 px-4 py-4">
          {!previewUrl && !manualText ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Upload a screenshot or enter text to analyze for potential scams
                </p>
              </div>

              {/* Upload Options */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '📷', label: 'Take Photo', action: () => handleUploadClick() },
                  { icon: '📁', label: 'Upload File', action: () => handleUploadClick() },
                  { icon: '📝', label: 'Enter Text', action: () => setManualText(' ') }
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg hover:border-[#0033A0] hover:bg-gray-50 transition-all"
                  >
                    <span className="text-2xl mb-2">{option.icon}</span>
                    <span className="text-xs text-gray-600">{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview or Text Input */}
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain border rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter text to analyze:
                  </label>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Paste the text you want to analyze for scams..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#0033A0] focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      setManualText('');
                      setAnalysisResult(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Clear text
                  </button>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full py-3 rounded-full font-semibold text-white transition-all ${
                  isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0033A0] hover:bg-[#002266]'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze for Scams'
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="mt-6 space-y-4">
              <h3 className="font-bold text-lg text-[#0033A0]">Analysis Results</h3>
              
              {/* Risk Level */}
              <div className={`p-4 rounded-lg ${getRiskLevelColor(analysisResult.scamAnalysis.risk_level)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {getRiskLevelIcon(analysisResult.scamAnalysis.risk_level)} Risk Level: {analysisResult.scamAnalysis.risk_level.toUpperCase()}
                    </p>
                    <p className="text-sm mt-1">
                      Risk Score: {analysisResult.scamAnalysis.risk_score}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Text */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Analyzed Text:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {analysisResult.translatedText || analysisResult.originalText}
                </p>
              </div>

              {/* Red Flags */}
              {analysisResult.scamAnalysis.flagged_phrases.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-red-700 mb-2">🚨 Red Flags Detected:</h4>
                  <ul className="space-y-1">
                    {analysisResult.scamAnalysis.flagged_phrases.map((phrase, index) => (
                      <li key={index} className="text-sm text-red-600">
                        • "{phrase}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Category Analysis */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-700 mb-2">Analysis Breakdown:</h4>
                <div className="space-y-2">
                  {Object.entries(analysisResult.scamAnalysis.categories).map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-blue-600 capitalize">
                        {category.replace('_', ' ')}:
                      </span>
                      <span className="text-sm font-semibold text-blue-700">
                        {data.count} indicators
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Alli Button */}
              <button
                onClick={() => navigate('/chat', { 
                  state: { 
                    name: userInfo.displayName || 'there',
                    context: 'scam_analysis',
                    analysisResult: analysisResult
                  }
                })}
                className="w-full bg-[#00AEFF] hover:bg-[#0094d3] text-white py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center"
              >
                <span className="mr-2">📎</span>
                Message Alli for Help
                <span className="ml-2">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Recent Scans */}
        {scanHistory.length > 0 && (
          <div className="mx-4 mt-6">
            <h3 className="font-bold text-lg text-[#0033A0] mb-3">Recent Scans</h3>
            <div className="space-y-2">
              {scanHistory.slice(0, 3).map((scan) => (
                <div key={scan.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Risk: {scan.scamAnalysis.risk_level.toUpperCase()}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getRiskLevelColor(scan.scamAnalysis.risk_level)}`}>
                      {scan.scamAnalysis.risk_score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav activePage="/quick-scam-scan" />
    </div>
  );
};

export default QuickScamScan; 