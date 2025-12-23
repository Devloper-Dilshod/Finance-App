import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Filter, Calendar, List, TrendingUp, TrendingDown, Wallet, Trash2, History, Search } from 'lucide-react';

// Grafik uchun chiroyli ranglar
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#4b5563'];

// Hisobot va tranzaksiyalar tarixini ko'rsatadigan sahifa
const SummaryPage = () => {
    // Contextdan kerakli ma'lumotlarni olamiz
    const { transactions, totals, deleteTransaction } = useFinance();

    // Filtrlar uchun o'zgaruvchilar
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Filtrlangan tranzaksiyalar ro'yxatini hisoblaymiz
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const dateMatch = (!startDate || t.date >= startDate) && (!endDate || t.date <= endDate);
            const categoryMatch = categoryFilter === 'All' || t.category === categoryFilter;
            return dateMatch && categoryMatch;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, startDate, endDate, categoryFilter]);

    // Diagramma (grafik) uchun ma'lumotlarni tayyorlaymiz
    const chartData = useMemo(() => {
        const expenses = transactions.filter(t => !t.is_income);
        const categoryTotals = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        return Object.keys(categoryTotals).map(name => ({
            name,
            value: categoryTotals[name]
        }));
    }, [transactions]);

    // Bor bo'lgan hamma kategoriyalarni ruyxatga olamiz
    const categoriesList = useMemo(() => {
        const allCats = transactions.map(t => t.category);
        return ['All', ...new Set(allCats)];
    }, [transactions]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">

            {/* Asosiy raqamlar (Kirim, Chiqim, Balans) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-50 flex items-center space-x-5 group hover:shadow-xl transition-all">
                    <div className="bg-emerald-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kirim</p>
                        <h3 className="text-3xl font-black text-emerald-600">${totals.income.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-50 flex items-center space-x-5 group hover:shadow-xl transition-all">
                    <div className="bg-rose-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                        <TrendingDown className="h-8 w-8 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chiqim</p>
                        <h3 className="text-3xl font-black text-rose-600">${totals.expenses.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-indigo-600 p-7 rounded-[32px] shadow-xl flex items-center space-x-5 group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="bg-white/20 p-4 rounded-2xl relative z-10">
                        <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-indigo-100 uppercase tracking-wider">Qoldiq Balans</p>
                        <h3 className="text-3xl font-black text-white">${totals.balance.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chiqimlar grafigi */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 min-h-[450px] flex flex-col">
                    <h3 className="text-2xl font-black mb-8 text-gray-800 flex items-center">
                        <div className="bg-gray-100 p-2 rounded-xl mr-3">📈</div> Chiqimlar Diagrammasi
                    </h3>
                    {chartData.length > 0 ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <div className="text-6xl">🏜️</div>
                            <p className="font-bold">Hali chiqim qilmabsiz-ku?</p>
                        </div>
                    )}
                </div>

                {/* Filtrlar va Operatsiyalar ro'yxati */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col h-full">
                    <h3 className="text-2xl font-black mb-8 text-gray-800 flex items-center">
                        <div className="bg-gray-100 p-2 rounded-xl mr-3">📝</div> Amallar Tarixi
                    </h3>

                    {/* Qidiruv va Filtr bo'limi */}
                    <div className="bg-gray-50/50 p-6 rounded-3xl mb-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-xs font-black text-gray-400 ml-2">DAN</span>
                                <input
                                    type="date"
                                    className="w-full bg-white border-2 border-transparent rounded-2xl p-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-black text-gray-400 ml-2">GACHA</span>
                                <input
                                    type="date"
                                    className="w-full bg-white border-2 border-transparent rounded-2xl p-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-black text-gray-400 ml-2">KATEGORIYA</span>
                            <select
                                className="w-full bg-white border-2 border-transparent rounded-2xl p-3 text-sm font-bold focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categoriesList.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'All' ? 'Hamma kategoriyalar' : cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tranzaksiyalar ro'yxati */}
                    <div className="flex-1 space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-5 rounded-3xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-2xl ${t.is_income ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {t.is_income ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 tracking-tight">{t.category}</p>
                                            <p className="text-xs text-gray-400 font-bold">{t.date} • {t.description || 'Izohsiz'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`text-lg font-black ${t.is_income ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.is_income ? '+' : '-'}${t.amount.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="p-2 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center animate-pulse">
                                <div className="text-4xl mb-4">🔍</div>
                                <p className="text-gray-400 font-bold">Hech narsa topilmadi...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
