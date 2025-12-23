import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Check } from 'lucide-react';

// Kirim yoki Chiqim qo'shish formasi 
const TransactionForm = ({ isIncome }) => {
    // contextdan malumot qo'shish funksiyasini olamiz
    const { addTransaction } = useFinance();

    // formalar uchun state-lar
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [saved, setSaved] = useState(false);

    // Formani saqlash funksiyasi
    const handleSave = (e) => {
        e.preventDefault();

        // agar summa yoki kategoriya bo'lmasa saqlamslik
        if (!amount || !category) return;

        // yangi tranzaksiya obyekti
        addTransaction({
            amount: parseFloat(amount),
            category,
            description,
            date,
            is_income: isIncome
        });

        // formani tozalash
        setAmount('');
        setCategory('');
        setDescription('');

        // muvaffaqiyatli saqlanganligini ko'rsatish
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Is_income bo'lsa tanlash uchun kategoriyalar
    const categoriesList = isIncome
        ? ['Oylik', 'Bonus', 'Sovg\'a', 'Ijaradan']
        : ['Ovqat', 'Yo\'l kira', 'Kiyim', 'Uy-ro\'zg\'or', 'Boshqa'];

    return (
        <div className="max-w-md mx-auto animate-in fade-in duration-500">
            <h2 className={`text-2xl font-black mb-8 ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isIncome ? '💰 Kirim Qo\'shish' : '💸 Chiqim Qo\'shish'}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Summa kiritish */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Summa ($)</label>
                    <input
                        type="number"
                        className="input-field text-lg font-bold"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                {/* Kategoriya tanlash */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Kategoriya</label>
                    <select
                        className="input-field font-bold"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Tanlang...</option>
                        {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Sana tanlash */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Sana</label>
                    <input
                        type="date"
                        className="input-field font-bold"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                {/* Izoh yozish */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Izoh (ixtiyoriy)</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Nima uchun?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Saqlash tugmasi */}
                <button
                    type="submit"
                    className={`${isIncome ? 'bg-emerald-600 shadow-emerald-100' : 'bg-rose-600 shadow-rose-100'} btn-primary flex items-center justify-center space-x-2`}
                >
                    <span>{saved ? 'Muvaffaqiyatli saqlandi' : 'Saqlash'}</span>
                    {saved && <Check size={20} />}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
