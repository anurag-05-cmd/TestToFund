import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Developed by{' '}
            <a 
              href="https://expose.software" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-gray-300 transition-colors"
            >
              Team EXPOSE
            </a>
            {' '}for{' '}
            <a 
              href="https://hackodisha-4.devfolio.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 font-medium hover:text-white transition-colors"
            >
              HackOdisha 5.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
