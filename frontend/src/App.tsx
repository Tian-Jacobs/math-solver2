import React, { useState, useEffect } from 'react';
import { Calculator, History, User, LogIn, LogOut, Menu, X, Eye, EyeOff, ChevronDown, ChevronRight, BookOpen, Lightbulb, Clock, Trash2 } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import katex from 'katex';
import 'katex/dist/katex.min.css';

type UserType = { username: string; email: string; password?: string };

const MathSolver = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  // Start with sidebar closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeTab, setActiveTab] = useState('solver');
  const [serverConnected, setServerConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  
  // Math solver state
  const [problem, setProblem] = useState('');
  type ResultType = {
    originalProblem: string;
    analysis: any;
    calculation: {
      result: string;
      operation: string;
      steps: string[] | string;
    };
    explanation: string;
  };
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(false);
  
  // Local storage simulation (replacing localStorage)
  const [users, setUsers] = useState<UserType[]>([]);
  type CalculationType = {
    id: number;
    userId: string;
    problem: string;
    result: string;
    operation: string;
    timestamp: string;
    steps: string[];
  };
  const [calculations, setCalculations] = useState<CalculationType[]>([]);

  // API Configuration - use local backend in development, production URL otherwise
  const API_BASE = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://math-solver2.onrender.com');

  // Load saved result from localStorage on mount
  useEffect(() => {
    // Load saved result
    const savedResult = localStorage.getItem('mathSolverResult');
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error('Failed to load saved result:', e);
      }
    }

    // Load saved problem
    const savedProblem = localStorage.getItem('mathSolverProblem');
    if (savedProblem) {
      setProblem(savedProblem);
    }

    // Load calculations
    const savedCalculations = localStorage.getItem('mathSolverCalculations');
    if (savedCalculations) {
      try {
        setCalculations(JSON.parse(savedCalculations));
      } catch (e) {
        console.error('Failed to load calculations:', e);
      }
    }
    
    // Test server connection on mount
    testServerConnection();
  }, []);

  const testServerConnection = async () => {
    setConnectionStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE}/health`, {
        signal: controller.signal,
        method: 'GET'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerConnected(true);
        setConnectionStatus('connected');
        console.log('✅ Server connected and AI is available');
      } else {
        // Server responded but AI is not available (503 or other error)
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Server health check failed:', response.status, errorData);
        throw new Error(`Server unavailable: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setServerConnected(false);
      setConnectionStatus('disconnected');
    }
  };

  const handleAuth = () => {
    if (isLogin) {
      // Login logic
      const user = users.find(u => u.username === authForm.username && u.password === authForm.password);
      if (user || authForm.username === 'demo') {
        setCurrentUser(authForm.username === 'demo' ? { username: 'demo', email: 'demo@example.com' } : user ?? null);
        setShowAuth(false);
        setAuthForm({ username: '', password: '', email: '' });
      } else {
        alert('Invalid credentials');
      }
    } else {
      // Register logic
      if (users.find(u => u.username === authForm.username)) {
        alert('Username already exists');
        return;
      }
      const newUser = { username: authForm.username, password: authForm.password, email: authForm.email };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setShowAuth(false);
      setAuthForm({ username: '', password: '', email: '' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('solver');
  };

  const solveProblem = async () => {
    if (!problem.trim()) return;
    
    if (!serverConnected) {
      alert('Server is not connected. Please wait for connection or try again.');
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ problem: problem })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const processedResult = {
          originalProblem: data.originalProblem,
          analysis: data.analysis,
          calculation: data.calculation,
          explanation: data.explanation
        };
        
        setResult(processedResult);
        
        // Save result to localStorage
        localStorage.setItem('mathSolverResult', JSON.stringify(processedResult));
        localStorage.setItem('mathSolverProblem', problem);
        
        // Save to calculation history
        const newCalculation = {
          id: Date.now(),
          userId: 'user', // Static user identifier
          problem: problem,
          result: data.calculation.result,
          operation: data.analysis.operation,
          timestamp: new Date().toISOString(),
          steps: Array.isArray(data.calculation.steps) 
            ? data.calculation.steps 
            : data.calculation.steps.split('\n').filter((step: string) => step.trim())
        };
        const updatedCalculations = [newCalculation, ...calculations];
        setCalculations(updatedCalculations);
        
        // Save calculations to localStorage
        localStorage.setItem('mathSolverCalculations', JSON.stringify(updatedCalculations));
      } else {
        throw new Error(data.error || 'Unknown error from server');
      }
      
    } catch (error) {
      console.error('Error solving problem:', error);
      // Fallback to local mock solution for demo
      const mockResult = {
        originalProblem: problem,
        analysis: {
          operation: 'solve',
          expression: problem,
          context: 'Local fallback solution (server unavailable)'
        },
        calculation: {
          result: 'x = 4',
          operation: 'solve',
          steps: [
            'Server connection failed - showing demo solution',
            'Subtract 2 from both sides: 3x + 2 - 2 = 14 - 2',
            'Simplify: 3x = 12',
            'Divide both sides by 3: 3x/3 = 12/3',
            'Final answer: x = 4'
          ]
        },
        explanation: 'This is a demo solution since the server is currently unavailable. The actual server would provide AI-powered solutions using Google Gemini.'
      };
      
      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render LaTeX math with better text/math separation
  const renderMath = (text: string) => {
    try {
      // If the text contains dollar signs, process them as inline math
      if (text.includes('$')) {
        let result = '';
        let lastIndex = 0;
        const regex = /\$([^$]+)\$/g;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          // Add text before the match (as plain text)
          const textBefore = text.substring(lastIndex, match.index);
          result += textBefore.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          
          // Render the math part
          try {
            result += katex.renderToString(match[1], {
              throwOnError: false,
              displayMode: false,
            });
          } catch (e) {
            console.error('KaTeX error:', e);
            result += match[0]; // Keep original if rendering fails
          }
          lastIndex = regex.lastIndex;
        }
        // Add remaining text (as plain text)
        const remainingText = text.substring(lastIndex);
        result += remainingText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return result;
      }
      
      // If it contains LaTeX commands but no dollar signs, wrap it and render
      if (text.includes('\\int') || text.includes('\\frac') || text.includes('\\cdot') || 
          text.includes('^') || text.includes('_') || text.match(/\\[a-zA-Z]+/)) {
        // This is LaTeX math without $ delimiters - render it
        try {
          return katex.renderToString(text, {
            throwOnError: false,
            displayMode: false,
          });
        } catch (e) {
          console.error('KaTeX error rendering LaTeX:', e);
          // If rendering fails, return as plain text
          return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      }

      // Otherwise return as-is (escaped for safety)
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } catch (e) {
      console.error('Error rendering math:', e);
      return text;
    }
  };


  const exampleProblems = [
    'Find the derivative of x^2 + 3x + 2',
    'Integrate 2x + 3 dx',
    'Factor x^2 + 5x + 6',
    'Simplify (x + 1)^2',
    'Find zeros of x^2 - 4'
  ];


  const deleteCalculation = (id: number) => {
    const updatedCalculations = calculations.filter(calc => calc.id !== id);
    setCalculations(updatedCalculations);
    // Save to localStorage
    localStorage.setItem('mathSolverCalculations', JSON.stringify(updatedCalculations));
  };

  const ConnectionStatus = () => {
    const statusConfig = {
      checking: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '🔄 Checking server connection...', icon: '🔄' },
      connected: { color: 'bg-green-100 text-green-800 border-green-200', text: '✅ Connected to server - Ready to solve!', icon: '✅' },
      disconnected: { color: 'bg-red-100 text-red-800 border-red-200', text: '❌ AI service unavailable - Cannot solve problems', icon: '❌' }
    };
    
    const config = statusConfig[connectionStatus as keyof typeof statusConfig];
    
    return (
      <div className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-between ${config.color}`}>
        <span>{config.text}</span>
        {connectionStatus === 'disconnected' && (
          <button 
            onClick={testServerConnection}
            className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay for Sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-80' : 'w-0 md:w-16'} 
        fixed md:relative inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 
        transition-all duration-300 flex flex-col overflow-y-auto
        ${!sidebarOpen && 'md:flex hidden'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Math Master</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('solver');
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'solver' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
            }`}
          >
            <Calculator className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Math Solver</span>}
          </button>
          
          <button
            onClick={() => {
              setActiveTab('history');
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
            }`}
          >
            <History className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">History</span>}
          </button>
        </div>

        {/* User Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          {currentUser ? (
            <div className="space-y-3">
              {sidebarOpen && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.username}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Log out</span>}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="w-full flex items-center space-x-3 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Log in here!</span>}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Math Master</h1>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {activeTab === 'solver' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-8">
              {/* Connection Status */}
              <ConnectionStatus />
              
              {/* Problem Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Enter your math problem:</h2>
                <div className="space-y-4">
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Example: Find the derivative of x^2 + 3x + 2"
                    className="w-full p-3 md:p-4 border border-gray-300 rounded-lg resize-none h-24 md:h-32 text-base focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={solveProblem}
                    disabled={loading || !problem.trim()}
                    className="w-full md:w-auto px-6 md:px-8 py-3 md:py-3 text-base md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? 'Solving...' : '🚀 Solve Problem'}
                  </button>
                </div>
              </div>

              {/* Example Problems */}
              <div className="bg-red-50 rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-red-800 mb-3 text-base md:text-base">Try these examples:</h3>
                <div className="flex flex-wrap gap-2">
                  {exampleProblems.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setProblem(example)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm md:text-sm hover:bg-red-200 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 md:p-6 bg-green-50 border-b border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-green-800">Solution</h3>
                      </div>
                      <button
                        onClick={() => {
                          setResult(null);
                          setProblem('');
                          localStorage.removeItem('mathSolverResult');
                          localStorage.removeItem('mathSolverProblem');
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 text-sm md:text-base">Problem:</h4>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm md:text-base">{result.originalProblem}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 text-sm md:text-base">Result:</h4>
                        <div 
                          className="text-lg md:text-xl font-bold text-red-600 bg-red-50 p-3 rounded-lg"
                          dangerouslySetInnerHTML={{ __html: renderMath(result.calculation.result) }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2 text-sm md:text-base">
                        <Lightbulb className="w-4 h-4" />
                        <span>Explanation:</span>
                      </h4>
                      <div 
                        className="text-gray-700 bg-yellow-50 p-5 rounded-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: renderMath(result.explanation)
                            .split(/\*\*/)
                            .map((part, index) => {
                              // Bold text between ** markers
                              if (index % 2 === 1) {
                                return `<strong class="font-semibold text-gray-900">${part}</strong>`;
                              }
                              return part;
                            })
                            .join('')
                        }}
                      />
                    </div>

                    <div>
                      <button
                        onClick={() => setExpandedSteps(!expandedSteps)}
                        className="flex items-center space-x-2 font-medium text-red-600 hover:text-red-700 mb-3 text-sm md:text-base"
                      >
                        {expandedSteps ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <BookOpen className="w-4 h-4" />
                        <span>Step-by-Step Solution</span>
                      </button>
                      
                      {expandedSteps && (
                        <div className="bg-gray-50 rounded-lg p-3 md:p-6 border border-gray-200">
                          <div className="space-y-4 md:space-y-6">
                            {/* Problem Statement */}
                            <div className="bg-white rounded-lg p-3 md:p-5 border-l-4 border-red-500">
                              <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Question</h4>
                              <div className="text-sm md:text-lg text-gray-900 leading-relaxed">
                                {result.originalProblem}
                              </div>
                            </div>
                            
                            {/* Solution Header */}
                            <div className="bg-white rounded-lg p-3 md:p-5 border-l-4 border-blue-500">
                              <h4 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Solution</h4>
                            </div>
                            
                            {/* Steps */}
                            <div className="space-y-3 md:space-y-6">
                              {(Array.isArray(result.calculation.steps) 
                                ? result.calculation.steps 
                                : result.calculation.steps.split('\n').filter((step: string) => step.trim())
                              ).map((step: string, index: number) => {
                                // Parse step - separate the equation from the explanation
                                // Remove the step prefix from AI to get clean content
                                let cleanedStep = step.replace(/^(Step\s+)?\d+[a-z]?[\.:]\s*/i, '').trim();
                                
                                let stepTitle = '';
                                let contentToDisplay = '';
                                let textExplanation = '';
                                
                                // Detect if this seems like a sub-step (shorter, starts with specific keywords, or is just math)
                                const isLikelySubStep = cleanedStep.length < 50 && 
                                  (cleanedStep.match(/^(Here|So|Thus|Therefore|Use|Apply|Now)/i) || 
                                   !cleanedStep.includes(':') && /[\$\\=]/.test(cleanedStep));
                                
                                if (cleanedStep.includes(':')) {
                                  // Format: "Description: Content"
                                  const colonIndex = cleanedStep.indexOf(':');
                                  let beforeColon = cleanedStep.substring(0, colonIndex).trim();
                                  let afterColon = cleanedStep.substring(colonIndex + 1).trim();
                                  
                                  // Check if the part before colon contains LaTeX or math symbols
                                  const titleHasMath = /\$|\\int|\\frac|\^|_/.test(beforeColon);
                                  
                                  if (titleHasMath) {
                                    // The "title" contains math, so extract the actual text part
                                    // Example: "Integrate the first term, $\int 2x dx$"
                                    const textMatch = beforeColon.match(/^([^$\\]+?)(?:[,$]|\\)/);
                                    if (textMatch) {
                                      stepTitle = textMatch[1].trim();
                                      // Put the math part into content along with what's after colon
                                      const mathInTitle = beforeColon.substring(textMatch[1].length).trim();
                                      contentToDisplay = afterColon ? `${mathInTitle} ${afterColon}` : mathInTitle;
                                    } else {
                                      stepTitle = 'Apply the rule';
                                      contentToDisplay = `${beforeColon} ${afterColon}`;
                                    }
                                  } else {
                                    // Normal case: text before colon, content after
                                    stepTitle = beforeColon;
                                    
                                    // Check if afterColon has both explanation text and math
                                    // Look for period followed by LaTeX or just period at sentence end
                                    const periodMatch = afterColon.match(/^([^$.]+?\.)(.+)$/);
                                    if (periodMatch && (periodMatch[2].includes('\\') || periodMatch[2].includes('$'))) {
                                      textExplanation = periodMatch[1].trim();
                                      contentToDisplay = periodMatch[2].trim();
                                    } else {
                                      contentToDisplay = afterColon;
                                    }
                                  }
                                } else {
                                  // No colon - check if it's mostly text or mostly math
                                  const hasLaTeX = /\$|\\int|\\frac|\\/.test(cleanedStep);
                                  const hasMathSymbols = /[=+\-*/()^]/.test(cleanedStep);
                                  
                                  if (!hasLaTeX && !hasMathSymbols && cleanedStep.length > 20) {
                                    // It's explanatory text only
                                    stepTitle = cleanedStep;
                                    contentToDisplay = '';
                                  } else if (hasLaTeX) {
                                    // Contains LaTeX - try to separate text from math
                                    const textMatch = cleanedStep.match(/^([^$\\]+?)(?:[,$]|\\)/);
                                    if (textMatch && textMatch[1].length > 10) {
                                      stepTitle = textMatch[1].trim();
                                      contentToDisplay = cleanedStep.substring(textMatch[1].length).trim();
                                    } else {
                                      stepTitle = 'Calculation';
                                      contentToDisplay = cleanedStep;
                                    }
                                  } else {
                                    // It's math content
                                    stepTitle = 'Calculation';
                                    contentToDisplay = cleanedStep;
                                  }
                                }
                                
                                return (
                                  <div key={index} className={`bg-white rounded-lg p-3 md:p-5 shadow-sm border border-gray-200 ${isLikelySubStep ? 'ml-4 md:ml-8' : ''}`}>
                                    <div className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                                      <span>Step {index + 1}: </span>
                                      <span dangerouslySetInnerHTML={{ __html: renderMath(stepTitle) }} />
                                    </div>
                                    {(textExplanation || contentToDisplay) && (
                                      <div className="pl-3 md:pl-4 border-l-2 border-gray-300 space-y-2">
                                        {textExplanation && (
                                          <div 
                                            className="text-xs md:text-sm text-gray-700 italic"
                                            dangerouslySetInnerHTML={{ __html: renderMath(textExplanation) }}
                                          />
                                        )}
                                        {contentToDisplay && (
                                          <div 
                                            className="text-sm md:text-base bg-gray-50 p-2 md:p-3 rounded text-gray-800 overflow-x-auto"
                                            dangerouslySetInnerHTML={{ __html: renderMath(contentToDisplay) }}
                                          />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Final Answer */}
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border-2 border-red-300 shadow-sm">
                              <div className="font-bold text-gray-900 mb-3 text-base">
                                Step {(Array.isArray(result.calculation.steps) 
                                  ? result.calculation.steps.length 
                                  : result.calculation.steps.split('\n').filter((s: string) => s.trim()).length) + 1}: Final Answer
                              </div>
                              <div 
                                className="text-2xl font-bold text-red-600 bg-white p-4 rounded border-2 border-red-400 text-center"
                                dangerouslySetInnerHTML={{ __html: renderMath(result.calculation.result) }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              <div className="max-w-4xl mx-auto pb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Calculation History</h2>
              
              {calculations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
                  <History className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-medium text-gray-500 mb-2">No calculations yet</h3>
                  <p className="text-sm md:text-base text-gray-400">Start solving problems to see your history here!</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {calculations.map((calc) => (
                    <div key={calc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base truncate">{calc.problem}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0 text-xs md:text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 md:w-4 md:h-4" />
                              <span className="text-xs md:text-sm">{new Date(calc.timestamp).toLocaleDateString()}</span>
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs w-fit">
                              {calc.operation}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                        <div 
                          className="font-mono text-base md:text-lg text-red-600 font-semibold break-words"
                          dangerouslySetInnerHTML={{ __html: renderMath(calc.result) }}
                        />
                      </div>
                      
                      <details className="text-xs md:text-sm">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                          View Steps
                        </summary>
                        <div className="mt-3 space-y-2 pl-2 md:pl-4">
                          {(Array.isArray(calc.steps) ? calc.steps : [calc.steps]).map((step, index) => (
                            <div 
                              key={index} 
                              className="text-gray-600 text-xs md:text-sm break-words"
                              dangerouslySetInnerHTML={{ __html: renderMath(step) }}
                            />
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Log In' : 'Sign Up'}
              </h2>
              <button
                onClick={() => setShowAuth(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter username (try 'demo')"
                  required
                />
              </div>
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter email"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter password (try 'demo')"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAuth}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <strong>Demo:</strong> Use username "demo" and password "demo" to try the app
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathSolver;
