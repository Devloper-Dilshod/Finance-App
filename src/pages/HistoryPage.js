import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, TrendingUp, TrendingDown, Filter } from 'lucide-react';

// tranzksiyalar tarixi sahifasi (\
const HistoryPage = () => {
    // Context hook orqali tranzaksiyalarni olamiz
    const { transactions, deleteTransaction } = useFinance();

    // Filtrlash holatlarini saqlaymiz
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('Barchasi');

    // Mavjud hamma kategoriyalarni ruyxatga olamiz
    const allCategories = ['Barchasi', ...new Set(transactions.map(t => t.category))];

    // Filtrlash funksiyasi 
    const filteredRows = useMemo(() => {
        return transactions.filter(t => {
            const dateMatch = (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate);
            const catMatch = category === 'Barchasi' || t.category === category;
            return dateMatch && catMatch;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, startDate, endDate, category]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">📜 Amallar Tarixi</h2>

            {/* Filtrlar qismi (Minimalist kartochka) */}
            <div className="card space-y-4">
                <div className="flex items-center space-x-2 text-slate-500 mb-2">
                    <Filter size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Filtrlash</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 ml-1">DAN</span>
                        <input
                            type="date"
                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 ml-1">GACHA</span>
                        <input
                            type="date"
                            className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 ml-1">KATEGORIYA</span>
                    <select
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Tranzaksiyalar ro'yxati */}
            <div className="space-y-3">
                {filteredRows.length > 0 ? (
                    filteredRows.map(t => (
                        <div key={t.id} className="card flex items-center justify-between group hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl ${t.is_income ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {t.is_income ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 leading-tight">{t.category}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">{t.date} • {t.description || 'Izohsiz'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`text-lg font-black ${t.is_income ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {t.is_income ? '+' : '-'}${t.amount}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(t.id)}
                                    className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-slate-300">
                        <p className="font-bold">Hech narsa topilmadi 🏜️</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
