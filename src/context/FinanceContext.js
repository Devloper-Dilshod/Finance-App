import React, { createContext, useContext, useState, useEffect } from 'react';

// Ma'lumotlarni saqlash va boshqarish uchun context yaratamiz
const FinanceContext = createContext();

// Boshqa komponentlarda contextdan oson foydalanish uchun custom hook
export const useFinance = () => useContext(FinanceContext);

// Asosiy provider komponenti - hamma ma'lumotlar shu erda saqlanadi
export const FinanceProvider = ({ children }) => {
    // Tranzaksiyalarni localStoragedan o'qib olamiz yoki bo'sh massiv yaratamiz
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('finance_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Har safar tranzaksiyalar o'zgarganda localStoragaga saqlab qo'yamiz
    useEffect(() => {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Yangi tranzaksiya (kirim yoki chiqim) qo'shish funksiyasi
    const addTransaction = (transaction) => {
        setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
    };

    // Tranzaksiyani o'chirib tashlash funksiyasi
    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Kirim, chiqim va umumiy balansni hisoblab beruvchi o'zgaruvchi
    const totals = transactions.reduce((acc, curr) => {
        if (curr.is_income) {
            acc.income += parseFloat(curr.amount);
        } else {
            acc.expenses += parseFloat(curr.amount);
        }
        acc.balance = acc.income - acc.expenses;
        return acc;
    }, { income: 0, expenses: 0, balance: 0 });

    return (
        <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, totals }}>
            {children}
        </FinanceContext.Provider>
    );
};
