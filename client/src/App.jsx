import { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext'; // Import Theme bits
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext); // Now this will work
  const [isRegistering, setIsRegistering] = useState(false);

  if (token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 mb-8 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">ProManager</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                title="Toggle Dark Mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              <button 
                onClick={logout} 
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 pb-12">
          <Dashboard />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-xl shadow-lg mb-4">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">ProManager</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Streamline your workflow with ease.</p>
        
        {/* Login Page Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors"
        >
          {isDark ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-10 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {isRegistering ? (
            <Register onSwitch={() => setIsRegistering(false)} />
          ) : (
            <>
              <Login />
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New here?{' '}
                  <button 
                    onClick={() => setIsRegistering(true)} 
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="bottom-right" toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700 border',
        }} /> 
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}