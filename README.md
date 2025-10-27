# Math Master 🧮

A powerful AI-powered math problem solver that provides step-by-step solutions with beautiful mathematical notation rendering. Built with React, Node.js, and Google Gemini AI.

![Math Master](https://img.shields.io/badge/Math-Solver-red)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

- 🤖 **AI-Powered Solutions** - Uses Google Gemini AI to solve complex math problems
- 📊 **Step-by-Step Explanations** - Detailed breakdown of solution process
- 🔢 **LaTeX Rendering** - Beautiful mathematical notation using KaTeX
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 💾 **Local History** - Automatically saves your calculations locally
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- ⚡ **Fast & Reliable** - Real-time health checks and connection monitoring

## 🚀 Supported Math Operations

- **Calculus**: Derivatives, Integrals, Limits
- **Algebra**: Solving equations, Factoring, Simplification
- **Polynomial Operations**: Finding zeros, roots
- **And more!**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd math-solver2-main
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.0-flash-exp
   PORT=3000
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server** (in the root directory):
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000`

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3001` (or next available port)

3. **Open your browser** and navigate to the frontend URL

### Production Build

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
math-solver2-main/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── App.tsx          # Main React component
│   │   ├── App.css          # Styles
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # Frontend dependencies
├── server.js                # Express backend server
├── .env                     # Environment variables (not in repo)
├── .gitignore              # Git ignore file
├── package.json            # Backend dependencies
└── README.md               # This file
```

## 🎯 Usage

1. **Enter a math problem** in the text area
   - Example: "Find the derivative of x^2 + 3x + 2"
   - Example: "Integrate 2x + 3 dx"
   - Example: "Factor x^2 + 5x + 6"

2. **Click "Solve Problem"** to get your solution

3. **View the results**:
   - See the final answer
   - Read the AI explanation
   - Expand step-by-step solutions
   - Check your calculation history

## 🔧 Technologies Used

### Frontend
- **React 19.1.0** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **KaTeX** - Fast math typesetting library
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Google Generative AI** - Gemini API integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🌐 API Endpoints

### Backend API

- `GET /health` - Check server and AI availability
- `POST /solve` - Solve a math problem
  ```json
  {
    "problem": "Find the derivative of x^2 + 3x + 2"
  }
  ```

## 📱 Mobile Support

Math Master is fully responsive and optimized for mobile devices:
- Collapsible sidebar navigation
- Touch-friendly buttons and inputs
- Adaptive text sizing
- Mobile-optimized layouts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Backend won't start
- Make sure you have a valid `GEMINI_API_KEY` in your `.env` file
- Check that port 3000 is not already in use

### Frontend connection issues
- Verify the backend is running on port 3000
- Check browser console for CORS errors
- Ensure your API key is valid and has not expired

### Math not rendering properly
- Clear browser cache and reload
- Check that KaTeX is properly installed: `cd frontend && npm install katex react-katex`

## 🙏 Acknowledgments

- Google Gemini AI for powerful math solving capabilities
- KaTeX for beautiful mathematical notation rendering
- The React and Node.js communities

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Made with ❤️ and ☕ by Tian Jacobs
