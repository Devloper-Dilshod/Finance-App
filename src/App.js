import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Navbar from './components/Navbar';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';

// ilovani boshqaruvchi asosiy komponent
function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto shadow-xl shadow-slate-200">

          {/* Tepadagi kichik sarlavha qismi */}
          <header className="bg-white px-6 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Finance Tracker</h1>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">DS</span>
            </div>
          </header>

          {/* Sahifalar kontenti */}
          <main className="flex-1 px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/history" />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/expense" element={<ExpensePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/history" />} />
            </Routes>
          </main>

          {/* Pastdan chiqadigan menyu */}
          <Navbar />
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
