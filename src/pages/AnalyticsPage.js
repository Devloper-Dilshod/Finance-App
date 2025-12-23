import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


// ranglar 
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// moliyaviy grafik sahifasi
const AnalyticsPage = () => {
    // Context orqali umumiy ma'lumotlarni ruyxatdan olamiz
    const { transactions, totals } = useFinance();

    // Diagramma uchun chiqimlarni tayyorlash funksiyasi
    const chartData = useMemo(() => {
        const expenses = transactions.filter(t => !t.is_income);
        const dataMap = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        return Object.keys(dataMap).map(name => ({
            name,
            value: dataMap[name]
        }));
    }, [transactions]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">📊 Moliyaviy Grafik</h2>

            {/* Asosiy Kartochka Balans qismiga */}
            <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1">Mavjud Balansingiz</p>
                <h3 className="text-4xl font-black mb-6">${totals.balance.toLocaleString()}</h3>

                <div className="flex justify-between border-t border-white/10 pt-6">
                    <div>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Kirim</p>
                        <p className="text-xl font-black text-emerald-300">+${totals.income}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Chiqim</p>
                        <p className="text-xl font-black text-rose-300">-${totals.expenses}</p>
                    </div>
                </div>
            </div>

            {/* Chiqimlar diagrammasi */}
            <div className="card">
                <h4 className="text-lg font-black text-slate-800 mb-6">Chiqimlar ulushi</h4>

                {chartData.length > 0 ? (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-300 font-bold">
                        Hozircha hech qanday chiqim yo'q 📉
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
